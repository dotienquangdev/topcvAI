import { _delete, _get, _patch, _post } from "../utils/request";

const getJobApplication = async (page = 1, limit = 8) => {
  try {
    const res = await _get(
      `/jobApplication/getJobApplications?_page=${page}&_limit=${limit}`
    );
    const data = await res.json();
    const result = data.companies;
    if (result && result.docs) {
      return {
        docs: result.docs,
        totalPages: result.totalPages,
        currentPage: result.page,
      };
    }
    if (Array.isArray(result)) {
      return {
        docs: result,
        totalPages: 1,
        currentPage: 1,
      };
    }
    return { docs: [], totalPages: 1, currentPage: 1 };
  } catch (err) {
    console.error("Lỗi khi gọi API công ty:", err);
    return { docs: [], totalPages: 1, currentPage: 1 };
  }
};

const listJobApplication = async (_id, updatedData) => {
  const response = await _get(
    `/jobApplication/listJobApplications/${_id}`,
    updatedData
  );
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Lỗi ${response.status}: ${text}`);
  }
  return JSON.parse(text);
};

const patchJobApplication = async (_id) => {
  const response = await _patch(`/jobApplication/patchJobApplications/${_id}`);
  const result = await response.json();
  return result;
};
const deleteJobApplication = async (_id) => {
  const response = await _delete(
    `/jobApplication/deleteJobApplications/${_id}`
  );
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Lỗi ${response.status}: ${errorText}`);
  }
  return await response.json();
};

const postJobApplication = async (jobApplication) => {
  try {
    const res = await _post(
      `/jobApplication/postJobApplications`,
      jobApplication
    );
    const result = await res.json();
    if (res.ok) {
      return {
        success: true,
        user: result.user,
      };
    } else {
      return {
        success: false,
        message: result.message || "Tạo jobApplication thành công ! ",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.message || "lỗi kết nối máy chủ",
    };
  }
};

const getJobApplication1 = async (page = 1, limit = 8) => {
  try {
    const res = await _get(
      `/jobApplication/getJobApplications?_page=${page}&_limit=${limit}`
    );
    const data = await res.json();
    return data; // trả y nguyên response từ backend
  } catch (err) {
    console.error("Lỗi khi gọi API jobApplication:", err);
    return { success: false, data: [] };
  }
};

export {
  postJobApplication,
  deleteJobApplication,
  getJobApplication,
  patchJobApplication,
  listJobApplication,
  getJobApplication1,
};
