const express = require("express");
const controller = require("../controllers/controller.JobApplications");
const router = express.Router();
const upload = require("../middlewares/upload");

// Lấy chi tiết 1 ứng tuyển
router.get("/getJobApplications", controller.getJobApplication);

// Lấy danh sách tất cả ứng tuyển
router.get("/listJobApplications/:id", controller.listJobApplication);

// Cập nhật ứng tuyển
router.patch("/patchJobApplications/:id", controller.patchJobApplication);

// Xoá ứng tuyển (soft delete)
router.delete("/deleteJobApplications/:id", controller.deleteJobApplication);

router.post(
  "/upload-profile-pic",
  upload.single("cv_file"),
  controller.uploadfile
);

router.post(
  "/postJobApplications",
  upload.single("cv_file"),
  controller.postJobApplication
);

module.exports = router;
