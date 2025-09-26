import { _delete, _get, _patch, _post } from "../utils/request";

const createCompanies = async (page = 1, limit = 8) => {
  try {
    const res = await _get(
      `/companies/getCompanies?_page=${page}&_limit=${limit}`
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
const updateCompanies = async (_id, updatedData) => {
  const response = await _patch(`/companies/putCompanies/${_id}`, updatedData);
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Lỗi ${response.status}: ${text}`);
  }
  return JSON.parse(text);
};

const createCompaniesId = async (_id) => {
  const response = await _get(`/companies/detail/${_id}`);
  const result = await response.json();
  return result;
};

const deleteCompanyId = async (_id) => {
  const response = await _delete(`/companies/deleteCompanies/${_id}`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Lỗi ${response.status}: ${errorText}`);
  }
  return await response.json();
};
const postCompanies = async (categories) => {
  try {
    const res = await _post(`/companies/postCompanies`, categories);
    const result = await res.json();
    if (res.ok) {
      return {
        success: true,
        user: result.user,
      };
    } else {
      return {
        success: false,
        message: result.message || "Tạo Categories thành công ! ",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.message || "lỗi kết nối máy chủ",
    };
  }
};

export {
  createCompanies,
  createCompaniesId,
  updateCompanies,
  postCompanies,
  deleteCompanyId,
};
