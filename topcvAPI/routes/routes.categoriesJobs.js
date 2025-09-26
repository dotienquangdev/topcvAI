const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller.categoriesJobs");

router.get("/getCategories", controller.getCategories);
router.get("/listCategories", controller.listCategories);
router.post("/postCategories", controller.postCategories);
router.patch("/putCategories/:id", controller.updateCategories);
router.delete("/deleteCategories", controller.deleteCategories);

module.exports = router;
