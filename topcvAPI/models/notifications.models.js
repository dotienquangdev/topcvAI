const mongoose = require("mongoose");
//Thông báo (ví dụ: được mời phỏng vấn, được nhận việc, ...)
const notificationsSchema = new mongoose.Schema({
  user_id: String, // id của người nhận
  content: String, // Nội dung
  is_read: Boolean,
  status: {
    // Trạng thái
    type: String,
    default: "active",
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  created_at: Date, // ngày tạo
  updated_at: Date, // ngày cập nhật
});

const Notifications = mongoose.model(
  "Notifications",
  notificationsSchema,
  "notifications"
);

module.exports = Notifications;
