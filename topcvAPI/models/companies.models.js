const mongoosePaginate = require("mongoose-paginate-v2");
const mongoose = require("mongoose");
// import mongoose from 'mongoose';

const companiesSchema = new mongoose.Schema({
  // công ty
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // tên công ty
  name: {
    type: String,
    required: true,
    trim: true,
  },
  // logo công ty
  logo_url: {
    type: String,
    default: "", // hoặc null nếu bạn muốn cho phép không có logo
  },
  // Mô tả về công ty
  description: {
    type: String,
    default: "",
  },
  // Website công ty
  website: {
    type: String,
    default: "",
  },
  // Mã số thuế
  tax_code: String, // mã số thuế
  companies_Phone: String, // sdt
  // vị trí công ty, địa chỉ
  location: {
    type: String,
    default: "",
  },
  // số lương nhân viên công ty
  size: {
    type: String, // hoặc bạn có thể dùng enum nếu muốn giới hạn số lựa chọn
    default: "",
  },
  // năm thành lập
  founded_year: {
    type: String, // hoặc Number nếu bạn muốn xử lý là số
    default: "",
  },
  //ngày tạo công ty
  created_at: {
    type: Date,
    default: Date.now,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  status: {
    // Trạng thái
    type: String,
    default: "active",
  },
  //Ngày cập nhật
  update_at: {
    type: Date,
    default: Date.now,
  },
});
companiesSchema.plugin(mongoosePaginate);
const Companies = mongoose.model("Companies", companiesSchema, "companies");
module.exports = Companies;
