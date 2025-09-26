const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller.employer");

router.post("/employer", controller.postEmployer); // Tạo bài đăng
router.put("/employer/:id", controller.getEmployer); // Cập nhật bài đăng
router.delete("/employer/:id", controller.deleteEmployer); // Xóa bài đăng
router.delete("/employer/applications", controller.deleteEmployerApplications); // Danh sách ứng viên đã ứng tuyển
router.delete("/employer/jobs", controller.deleteEmployerJobs); // Danh sách bài đăng của nhà tuyển dụng

module.exports = router;
