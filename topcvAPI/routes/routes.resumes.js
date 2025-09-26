const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller.resumes");

router.post("/resumes", controller.postResumes); // Tạo CV
router.get("/resumes", controller.getResumes); // Danh sách CV của người dùng
router.put("/resumes/:id", controller.putResumes); // Cập nhật CV
router.delete("/resumes/:id", controller.deleteResumes); // Xóa CV

module.exports = router;
