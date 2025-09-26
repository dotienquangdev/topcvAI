const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller.job_views");

router.get("/getJobViews", controller.getJobViews); // Lấy thông tin hồ sơ ứng viên
router.post("/putJobViews", controller.putJobViews); // Cập nhật hồ sơ ứng viên
router.post("/postJobViews", controller.postJobViews); // Tạo CV mới
router.delete("/deleteJobViews/:id", controller.deleteJobViews); // Xoá CV

module.exports = router;
