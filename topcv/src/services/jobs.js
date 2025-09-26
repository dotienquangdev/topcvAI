import { _get, _delete, _patch, _post } from "../utils/request";
import axios from "axios";

const createJobs = async (
  page = 1,
  limit = 8,
  sort = "title",
  order = "asc"
) => {
  try {
    const res = await axios.get(
      `http://localhost:9000/api/jobs/getJobs` ||
        `https://topcv-api.vercel.app/api/jobs/getJobs`,
      {
        params: { _page: page, _limit: limit, _sort: sort, _order: order },
      }
    );

    const data = res.data;
    if (data && data.docs) {
      return {
        docs: data.docs,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
      };
    }

    return { docs: [], totalPages: 1, currentPage: 1 };
  } catch (err) {
    console.error("Lỗi khi gọi API công việc:", err);
    return { docs: [], totalPages: 1, currentPage: 1 };
  }
};

const createJobsId = async (_id) => {
  const response = await _get(`/jobs/listJobs/${_id}`);
  const result = await response.json();
  return result;
};

const deleteJobById = async (_id) => {
  const response = await _delete(`/jobs/deleteJobs/${_id}`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Lỗi ${response.status}: ${errorText}`);
  }
  return await response.json();
};

const updateJob = async (_id, updatedData) => {
  const response = await _patch(`/jobs/editJobs/${_id}`, updatedData);

  const text = await response.text();
  // console.log("Raw response:", text);

  if (!response.ok) {
    throw new Error(`Lỗi ${response.status}: ${text}`);
  }

  return JSON.parse(text);
};

const addJobs = async (jobs) => {
  try {
    const res = await _post(`/jobs/applyJobs`, jobs);
    const result = await res.json();
    if (res.ok) {
      return {
        success: true,
        user: result.user,
      };
    } else {
      return {
        success: false,
        message: result.message || "Tạo Jobs thành công ! ",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.message || "lỗi kết nối máy chủ",
    };
  }
};

export { createJobs, createJobsId, deleteJobById, updateJob, addJobs };
