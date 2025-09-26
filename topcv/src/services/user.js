import { _get, _post, _delete } from "../utils/request";

const postRegister = async ({ fullName, email, phone, password }) => {
  try {
    const res = await _post(`/user/register`, {
      fullName,
      phone,
      email,
      password,
    });
    const result = await res.json();

    if (res.ok) {
      return {
        success: true,
        user: result.user,
      };
    } else {
      return {
        success: false,
        message: result.message || "Đăng ký không thành công",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.message || "lỗi",
    };
  }
};

const getUser = async (page = 1, limit = 8, sort = "title", order = "asc") => {
  try {
    const res = await _get(
      `/user/getLogin?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`
    );
    const data = (await res.json) ? await res.json() : res.data; // fallback nếu dùng fetch hoặc axios
    const result = data.user;
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
    return { docs: [], totalPages: 1, currentPages: 1 };
  } catch (error) {
    console.error("Lỗi khi gọi API user:", error);
    return { docs: [], totalPages: 1, currentPages: 1 };
  }
};

const loginUsers = async ({ email, password }) => {
  try {
    const res = await _post(`/user/login`, { email, password });

    const result = await res.json();

    if (res.ok) {
      return { success: true, user: result.user };
    } else {
      return {
        success: false,
        message: result.message || "Email hoặc mật khẩu không đúng",
      };
    }
  } catch (err) {
    return {
      success: false,
      message: err.message || "Lỗi kết nối đến máy chủ",
    };
  }
};
const deleteUser = async (id) => {
  const response = await _delete(`/user/deleteLogin/${id}`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Lỗi ${response.status}: ${errorText}`);
  }
  return await response.json();
};
const deleteUserDelete = async (id) => {
  const response = await _delete(`/user/deleted/${id}`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Lỗi ${response.status}: ${errorText}`);
  }
  return await response.json();
};
const forgotPasswordPost = async (email) => {
  try {
    const res = await _post(`/user/forgot`, { email });
    const result = await res.json();

    if (result.success) {
      alert("Vui lòng kiểm tra email để nhập OTP.");
    } else {
      alert(result.message || "Đã xảy ra lỗi.");
    }

    return result;
  } catch (error) {
    alert(error.message || "Lỗi kết nối máy chủ.");
    return {
      success: false,
      message: error.message || "Lỗi kết nối máy chủ.",
    };
  }
};
const otpPasswordPost = async ({ email, otp }) => {
  try {
    const res = await _post(`/user/otp`, { email, otp });
    const result = await res.json();

    if (result.success) {
      alert("OTP hợp lệ. Đang chuyển đến trang đặt lại mật khẩu...");
      localStorage.setItem("tokenUser", result.tokenUser);
    } else {
      alert(result.message || "Mã OTP không hợp lệ.");
    }
    console.log(result);

    return result;
  } catch (error) {
    alert(error.message || "Lỗi xác minh OTP.");
    return { success: false };
  }
};
const resetPasswordPost = async ({ email, password }) => {
  const tokenUser = localStorage.getItem("tokenUser");

  try {
    const res = await _post(`/user/resetPassword`, {
      email,
      password,
      tokenUser,
    });

    const rawText = await res.text(); // luôn đọc dưới dạng text để debug lỗi JSON
    console.log("Raw response text:", rawText);

    let result;
    try {
      result = JSON.parse(rawText);
    } catch (err) {
      console.error("Lỗi parse JSON:", err);
      return { success: false, message: "Server không trả về JSON." };
    }

    // console.log("resulttttt:", result);

    if (result.success) {
      alert("Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.");
      window.location.href = "/login";
    } else {
      alert(result.message || "Không thể đặt lại mật khẩu.");
    }

    return result;
  } catch (error) {
    alert(error.message || "Lỗi kết nối khi đặt lại mật khẩu.");
    return { success: false };
  }
};

export {
  getUser,
  postRegister,
  loginUsers,
  deleteUser,
  deleteUserDelete,
  forgotPasswordPost,
  otpPasswordPost,
  resetPasswordPost,
};
