const mongoose = require("mongoose");
//Thông tin người dùng (ứng viên, nhà tuyển dụng)
const vnpaySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  vnp_BankCode: String, // Ngân hàng
  vnp_Amount: Number, // Số tiền
  vnp_BankTranNo: String, // Mã giao dịch tại ngân hàng
  vnp_CardType: String, // Loại thẻ
  vnp_OrderInfo: String, // Mô tả
  vnp_PayDate: String, // Ngày thanh toán
  vnp_ResponseCode: String, // Mã phản hồi (00: thành công)
  vnp_TmnCode: String, // Mã website tại VNPAY
  vnp_TransactionNo: String, // Mã giao dịch tại VNPAY
  vnp_TransactionStatus: String, // Trạng thái giao dịch
  vnp_TxnRef: String, // Mã đơn hàng
  vnp_SecureHash: String, // Mã băm
  status: {
    type: String,
    default: "active",
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  created_at: Date,
  updated_at: Date,
});
const Vnpay = mongoose.model("vnpay", vnpaySchema, "vnpay");
module.exports = Vnpay;
