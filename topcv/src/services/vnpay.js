import { _post, _get } from "../utils/request";

// Tạo link thanh toán VNPAY
const createPayment = (user_id, amount) =>
  _post("/vnpay/create-qr", { user_id, amount });

// Kiểm tra kết quả thanh toán
const checkPayment = (query) => _get(`/vnpay/check-payment-vnpay?${query}`);

export { createPayment, checkPayment };
