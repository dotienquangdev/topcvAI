const express = require("express");
const router = express.Router();
const controller = require("../controllers/controllers.companies");

router.get("/detail/:id", controller.listJobsCompanies); // Chi tiết công ty
router.post("/postCompanies", controller.applyCompanies); // Dành cho admin, nhà tuyển dụng tạo công ty
router.get("/getCompanies", controller.getCompanies); //Danh sách công ty
router.patch("/putCompanies/:id", controller.updateCompanies); // Dành cho admin, nhà tuyển dụng tạo công ty
router.delete("/deleteCompanies/:id", controller.deleteCompanies); // Xóa công việc
router.patch("/updateAllCompaniesStatus", controller.updateAllCompaniesStatus);

module.exports = router;
