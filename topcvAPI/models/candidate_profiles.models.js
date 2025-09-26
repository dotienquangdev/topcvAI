const mongoose = require("mongoose");
const candidateProfilesSchema = new mongoose.Schema({
  // ứng vuên
  user_id: String, // userID ứng viên
  headline: String, // tiêu đề
  summary: String, // bản tóm tắt
  dob: Date, // ngày sinh
  address: String, // địa chỉ
  gender: String, // giới tính
  status: {
    // Trạng thái
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
const CandidateProfiles = mongoose.model(
  "CandidateProfiles",
  candidateProfilesSchema,
  "candidate_profiles" // optional: nếu bạn muốn fix tên collection
);
module.exports = CandidateProfiles;
