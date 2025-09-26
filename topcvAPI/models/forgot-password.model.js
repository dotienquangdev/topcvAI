const mongoose = require("mongoose");
const generate = require("../helper/generate");
const forgotPasswordSchema = new mongoose.Schema(
  {
    email: String, // email
    otp: String, // Mã OTP
    expiresAt: {
      // thời hạn có giá trị của mã
      type: Date,
      expires: 180,
      // expires: 180, 180 giay gui lai OTP
    },
  },
  {
    timestamps: true,
  }
);
const ForgotPassword = mongoose.model(
  "ForgotPassword",
  forgotPasswordSchema,
  "forgot-password"
);

module.exports = ForgotPassword;
