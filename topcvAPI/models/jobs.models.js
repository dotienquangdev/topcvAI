const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
// Thông tin bài đăng tuyển dụng
const jobsSchema = new mongoose.Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Companies",
    required: true,
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobCategories",
    required: true,
  },
  // ✅ Thay vì ref, ta nhúng trực tiếp formWork
  formWork: {
    formWorkName: {
      type: String,
      enum: ["Toàn thời gian", "Bán thời gian"],
      default: "Toàn thời gian",
    },
    formWorkSlug: {
      type: String,
      enum: ["full-time", "part-time"],
      default: "full-time",
    },
  },
  // ✅ Thay vì ref, ta nhúng trực tiếp formWork
  experience_level: {
    experienceName: {
      type: String,
      enum: ["Giám độc", "Trưởng phòng", "Nhân viên", "Thực tập sinh"],
      default: "Nhân viên",
    },
    experienceLabel: {
      type: String,
      enum: ["full-time", "part-time", "internship", "Remote"],
      default: "full-time",
    },
  },
  workExperience: {
    years: Number,
    label: String,
  },
  title: String, // tiêu đề công việc
  description: String, // mô tả công việc
  requirements: String, // yêu cầu công việc
  salary_min: Number, // lương tối thiểu
  salary_max: Number, // lương tối đa
  location: String, // địa điểm làm việc
  deadline: Date, // hạn nộp hồ sơ
  job_benefits: String, // phúc lợi bổ sung
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  outstanding: {
    type: String,
    default: "normal",
  },
  status: {
    type: String,
    default: "active",
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});
jobsSchema.plugin(mongoosePaginate);
const Jobs = mongoose.model("Jobs", jobsSchema, "jobs");
module.exports = Jobs;
