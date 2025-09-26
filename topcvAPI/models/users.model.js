const mongoose = require("mongoose");
//Thông tin người dùng (ứng viên, nhà tuyển dụng)
const usersSchema = new mongoose.Schema({
  fullName: String, // hộ têm
  email: String, // email
  tokenUser: String, // token
  password: String, // mật khẩu
  phone: String, // sdt
  level: Number, // cấp độ
  avatar_url: String, // ảnh
  money: {
    type: Number,
    default: 0,
  },
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
const Users = mongoose.model("Users", usersSchema, "users");
module.exports = Users;
