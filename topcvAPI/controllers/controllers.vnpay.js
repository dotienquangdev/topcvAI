const mongoose = require("mongoose");
const Vnpay = require("../models/vnpay.models");
const Users = require("../models/users.model");
const {
  VNPay,
  ignoreLogger,
  ProductCode,
  VnpLocale,
  dateFormat,
} = require("vnpay");

const vnpays = async (req, res) => {
  try {
    const { user_id, amount } = req.body;

    console.log("vnpays - user_id:", req.body);
    console.log("vnpays - user_id:", amount);

    // await newvnpay.save();

    const vnpay = new VNPay({
      tmnCode: "X783MKOS",
      secureSecret: "YSOOD595SQM9RAFBDTS4K20FUH8ZTV0Z",
      vnpayHost: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
      testMode: true,
      hashAlgorithm: "SHA512",
      loggerFn: ignoreLogger,
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // build link thanh toán
    const url = vnpay.buildPaymentUrl({
      vnp_Amount: amount * 1000, // phải nhân 100
      vnp_IpAddr: req.ip,
      vnp_TxnRef: Date.now().toString(),
      vnp_OrderInfo: `${user_id}|NapTien`, // nhúng user_id vào orderInfo
      vnp_ReturnUrl: `http://localhost:9000/api/vnpay/check-payment-vnpay`,
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(new Date()),
      vnp_ExpireDate: dateFormat(tomorrow),
    });
    return res.status(200).json({
      success: true,
      message: "Tạo link thanh toán VNPAY thành công!",
      url, // gửi link cho FE
    });
  } catch (err) {
    console.error("❌ Lỗi tạo link VNPAY:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const checkVnpays = async (req, res) => {
  try {
    console.log("req.query", req.query);
    const query = req.query;
    let userId = query.vnp_OrderInfo || "";
    let orderInfo = query.vnp_OrderInfo || "";

    if (orderInfo.includes("|")) {
      const [uid, info] = orderInfo.split("|");
      userId = uid;
      orderInfo = info;
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("❌ userId không hợp lệ:", userId);
      return res.redirect("http://localhost:3002?status=fail");
    }

    const newvnpay = new Vnpay({
      user_id: userId,
      vnp_BankCode: query.vnp_BankCode,
      vnp_Amount: Number(query.vnp_Amount) / 100,
      vnp_BankTranNo: query.vnp_BankTranNo,
      vnp_CardType: query.vnp_CardType,
      vnp_OrderInfo: orderInfo,
      vnp_PayDate: query.vnp_PayDate,
      vnp_ResponseCode: query.vnp_ResponseCode,
      vnp_TmnCode: query.vnp_TmnCode,
      vnp_TransactionNo: query.vnp_TransactionNo,
      vnp_TransactionStatus: query.vnp_TransactionStatus,
      vnp_TxnRef: query.vnp_TxnRef,
      vnp_SecureHash: query.vnp_SecureHash,
      created_at: new Date(),
      updated_at: new Date(),
      status: "active",
      deleted: false,
    });
    await newvnpay.save();

    // ✅ Gọi updateUserMoney ngay sau khi lưu giao dịch
    await updateUserMoney();

    return res.redirect("http://localhost:3002");
  } catch (error) {
    console.error("❌ Lỗi lưu VNPAY:", error);
    return res.redirect("http://localhost:3002/admin");
  }
};

const getVnpay = async (req, res) => {
  try {
    const resumes = await Vnpay.find({
      deleted: false,
    });
    const payments = await Vnpay.find({ status: "active", deleted: false });
    res.json({
      resumes: resumes,
    });
    // payments: payments,
    console.log(`payments: `, payments);
  } catch (error) {
    console.log(`Lỗi : `, error);
  }
};

// const updateUserMoney = async (req, res) => {
//   try {
//     // 1. Lấy tất cả các giao dịch active và chưa bị xóa
//     const activePayments = await Vnpay.find({
//       status: "active",
//       deleted: false,
//     });
//     if (!activePayments.length) {
//       return res.status(200).json({
//         success: true,
//         message: "Không có giao dịch nào cần cập nhật.",
//       });
//     }
//     // 2. Duyệt qua từng giao dịch
//     for (const payment of activePayments) {
//       const userId = payment.user_id;
//       const amount = payment.vnp_Amount;
//       // Cập nhật tiền cho user
//       await Users.findByIdAndUpdate(
//         userId,
//         { $inc: { money: amount } },
//         { new: true }
//       );
//       // Cập nhật trạng thái giao dịch thành inactive
//       payment.status = "inactive";
//       await payment.save();
//     }
//     return res.status(200).json({
//       success: true,
//       message: "Cập nhật tiền cho người dùng thành công!",
//       updatedCount: activePayments.length,
//     });
//   } catch (error) {
//     console.error("❌ Lỗi updateUserMoney:", error);
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
const updateUserMoney = async () => {
  try {
    // Lấy các giao dịch active và chưa bị xóa
    const activePayments = await Vnpay.find({
      status: "active",
      deleted: false,
    });

    if (!activePayments.length) {
      console.log("Không có giao dịch nào cần cập nhật.");
      return;
    }

    for (const payment of activePayments) {
      const userId = payment.user_id;
      const amount = payment.vnp_Amount;

      // Cộng tiền cho user và lấy thông tin user sau khi update
      const user = await Users.findByIdAndUpdate(
        userId,
        { $inc: { money: amount } },
        { new: true }
      );

      if (user) {
        console.log(`✅ User vừa nạp tiền:`);
        console.log(`Tên: ${user.fullName}`);
        console.log(`Email: ${user.email}`);
        console.log(`Số tiền nạp: ${amount}`);
        console.log(`Tổng tiền hiện tại: ${user.money}`);
      }

      // Cập nhật trạng thái giao dịch thành inactive
      payment.status = "inactive";
      await payment.save();
    }
  } catch (error) {
    console.error("❌ Lỗi updateUserMoney:", error);
  }
};

module.exports = {
  vnpays,
  checkVnpays,
  getVnpay,
  updateUserMoney,
};

/*
// const vnpays = async (req, res) => {
//   const { user_id } = req.body;
//   const vnpay = new VNPay({
//     tmnCode: "X783MKOS",
//     secureSecret: "YSOOD595SQM9RAFBDTS4K20FUH8ZTV0Z",
//     vnpayHost: "https://sandbox.vnpayment.vn",
//     testMode: true,
//     hashAlgorithm: "SHA512",
//     loggerFn: ignoreLogger,
//   });
//   const tomorrow = new Date();
//   tomorrow.setDate(tomorrow.getDate() + 1);
//   const vnpayResponse = await vnpay.buildPaymentUrl({
//     vnp_Amount: 10000, // ✅ phải nhân 100
//     vnp_IpAddr: "127.0.0.1",
//     vnp_TxnRef: "1234567891",
//     vnp_OrderInfo: "1234567891",
//     vnp_ReturnUrl: `http://localhost:9000/api/vnpay/check-payment-vnpay`,
//     vnp_Locale: VnpLocale.VN,
//     vnp_CreateDate: dateFormat(new Date()), // ✅ sửa key
//     vnp_ExpireDate: dateFormat(tomorrow), // ✅ thêm format
//   });
//   const newVnpay = new Vnpay({
//     user_id, // ⚡ bắt buộc trong schema
//     vnp_BankCod: query.vnp_BankCode,
//     vnp_Amoun,
//     vnp_BankTranNo,
//     vnp_CardTyp,
//     vnp_OrderInfo,
//     vnp_PayDate,
//     vnp_ResponseCode,
//     vnp_TmnCode,
//     vnp_TransactionNo,
//     vnp_TransactionStatus,
//     vnp_TxnRef,
//     vnp_SecureHash,
//     created_at: new Date(),
//     updated_at: new Date(),
//   });
//   await newVnpay.save();
//   res.status(201).json({
//     success: true,
//     message: "Tạo link thanh toán VNPAY thành công!",
//     vnpayResponse,
//   });
//   // return res.status(201).json(vnpayResponse);
// };
// const checkVnpays = async (req, res) => {
//   try {
//     const query = req.query;
//     const { user_id } = req.body;
//     console.log("checkVnpays", query);
//     // 👉 lấy user_id từ OrderInfo (ví dụ "userid|orderId")
//     let userId = null;
//     let orderInfo = query.vnp_OrderInfo;
//     if (orderInfo.includes("|")) {
//       const [uid, info] = orderInfo.split("|");
//       userId = uid;
//       orderInfo = info;
//     }
//     // Lưu vào MongoDB
//     const newvnpay = new Vnpay({
//       user_id: userId, // ⚡ bắt buộc trong schema
//       vnp_BankCode: query.vnp_BankCode,
//       vnp_Amount: Number(query.vnp_Amount),
//       vnp_BankTranNo: query.vnp_BankTranNo,
//       vnp_CardType: query.vnp_CardType,
//       vnp_OrderInfo: orderInfo,
//       vnp_PayDate: query.vnp_PayDate,
//       vnp_ResponseCode: query.vnp_ResponseCode,
//       vnp_TmnCode: query.vnp_TmnCode,
//       vnp_TransactionNo: query.vnp_TransactionNo,
//       vnp_TransactionStatus: query.vnp_TransactionStatus,
//       vnp_TxnRef: query.vnp_TxnRef,
//       vnp_SecureHash: query.vnp_SecureHash,
//       created_at: new Date(),
//       updated_at: new Date(),
//     });
//     // Redirect về frontend sau khi lưu
//     return res.redirect("http://localhost:3002");
//   } catch (error) {
//     console.error("❌ Lỗi lưu VNPAY:", error);
//     return res.redirect("http://localhost:3002");
//   }
// };
*/
