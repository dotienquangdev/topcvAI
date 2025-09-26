const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller.candidate");

router.get("/profile", controller.getCandidate); // Lấy thông tin hồ sơ ứng viên
router.put("/putProfile", controller.putCandidate); // Cập nhật hồ sơ ứng viên
router.get("/listResumes", controller.listCandidate); // Lấy danh sách CV
router.post("/postResumes", controller.applyCandidate); // Tạo CV mới
router.delete("/deleteResumes/:id", controller.deleteCandidate); // Xoá CV

module.exports = router;
