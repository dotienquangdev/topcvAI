const express = require("express");
const router = express.Router();
const controller = require("../controllers/controllers.vnpay");

router.get("/check-payment-vnpay", controller.checkVnpays);
router.get("/getVnpay", controller.getVnpay);
router.post("/create-qr", controller.vnpays);
router.post("/updateUserMoneys", controller.updateUserMoney);

module.exports = router;
