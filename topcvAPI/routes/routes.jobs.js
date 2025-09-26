const express = require("express");
const router = express.Router();
const controller = require("../controllers/controllers.jobs");

router.get("/getJobs", controller.getJobs); // Danh sách việc làm (có hỗ trợ tìm kiếm, lọc)
router.get("/listJobs/:id", controller.listJobs); // Chi tiết công việc

router.post("/applyJobs", controller.postJobsApply); // Ứng tuyển

router.patch("/editJobs/:id", controller.editJobsApply); // Ứng tuyển
router.delete("/deleteJobs/:id", controller.deleteJobs); // Xóa công việc
router.post("/save/:id", controller.saveJob); // Lưu công việc
router.get("/saved", controller.savedJobs); // Lấy danh sách công việc đã lưu
router.get("/suggestions", controller.suggestionsJobs); // Gợi ý công việc
router.put("/normalizeSalaryFields", controller.normalizeSalaryFields); // Gợi ý công việc

router.patch("/updateAllJobsStatus", controller.updateAllJobsStatus);

module.exports = router;
