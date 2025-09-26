const express = require("express");
const router = express.Router();
const controller = require("../controllers/system.controllers");

router.get("/system", controller.system);

module.exports = router;