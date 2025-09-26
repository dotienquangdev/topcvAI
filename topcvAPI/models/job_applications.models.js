const mongoose = require("mongoose");
//Thông tin ứng tuyển của ứng viên vào các việc làm
const jobApplicationsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  }, // Ai nộp
  job_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Jobs",
    required: true,
  }, // Công việc nào, công ty nào,
  resume_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resumes",
    required: true,
  }, // CV nào (có thể null nếu nộp trực tiếp)

  cv_file: String, // File
  cv_file_url: String, //FIle Online

  cover_letter: String, // Thư xin việc
  viewed_at: { type: Date }, // Khi nhà tuyển dụng mở CV
  statusApplication: {
    // Tráng thái ứng tuyển
    type: String,
    enum: ["pending", "viewed", "interview", "hired", "rejected"],
    default: "pending",
  },
  status: {
    type: String,
    default: "active",
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const JobApplications = mongoose.model(
  "JobApplications",
  jobApplicationsSchema,
  "job_applications"
);
module.exports = JobApplications;
