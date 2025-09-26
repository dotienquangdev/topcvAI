import { _delete, _get, _patch, _post } from "../utils/request";

const getCategories = async (
  page = 1,
  limit = 8,
  sort = "title",
  order = "asc"
) => {
  try {
    const res = await _get(
      `/categories/getCategories?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`
    );

    const data = (await res.json) ? await res.json() : res.data; // fallback nếu dùng fetch hoặc axios

    const result = data.categories;

    if (data && data.docs) {
      return {
        docs: data.docs,
        totalPages: data.totalPages || 1,
        currentPages: data.currentPages || 1,
      };
    }

    if (Array.isArray(result)) {
      return {
        docs: result,
        totalPages: 1,
        currentPages: 1,
      };
    }
    console.log("result:1234567 ", result);
    return { docs: [], totalPages: 1, currentPages: 1 };
  } catch (error) {
    console.error("Lỗi khi gọi API getCategories:", error);
    return { docs: [], totalPages: 1, currentPages: 1 };
  }
};
const updateCategories = async (_id, updatedData) => {
  const response = await _patch(
    `/categories/putCategories/${_id}`,
    updatedData
  );
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Lỗi ${response.status}: ${text}`);
  }
  return JSON.parse(text);
};
const createCategoriesId = async (_id) => {
  const response = await _get(`/categories/listCategories/${_id}`);
  const result = await response.json();
  return result;
};
const deleteCategoriesId = async (_id) => {
  const response = await _delete(`/categories/deleteCategories/${_id}`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Lỗi ${response.status}: ${errorText}`);
  }
  return await response.json();
};
const createCategories = async (categories) => {
  try {
    const res = await _post(`/categories/postCategories`, categories);
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

const getCategories1 = async () => {
  try {
    const res = await _get("/categories/getCategories");
    return res.json();
  } catch (err) {
    console.error("Lỗi getCategories:", err);
    return { categories: [] };
  }
};
export {
  getCategories,
  updateCategories,
  deleteCategoriesId,
  createCategoriesId,
  createCategories,
  getCategories1,
};
