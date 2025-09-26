const mongoose = require("mongoose");
const { create } = require("./users.model");
//CV/hồ sơ của ứng viên
const resumesSchema = new mongoose.Schema({
  user_id: String,
  file_url: String, // Link tải file
  title: String, // tên ứng viên

  is_default: Boolean, // mặc định
  /////////////
  experience_level: String,
  formWork: String,
  workExperience: String,
  location: String,
  category: String,
  ////////////////////////
  status: {
    // trạng thái
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

const Resumes = mongoose.model("Resumes", resumesSchema, "resumes");
module.exports = Resumes;
