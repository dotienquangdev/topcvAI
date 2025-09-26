const mongoose = require("mongoose");
//Lượt xem bài đăng
const jobViewsSchema = new mongoose.Schema({
  job_id: String, // ID công việc
  ip_address: String,
  user_id: String, // ID người dùng (nếu có)
  viewed_at: Date,
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

const Jobviews = mongoose.model("Jobviews", jobViewsSchema, "job_views");
module.exports = Jobviews;
