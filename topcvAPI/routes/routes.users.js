const express = require("express");
const router = express.Router();
const controllerUsers = require("../controllers/controller.users");

router.get("/getLogin", controllerUsers.getLogin); //Danh sách user
router.post("/login", controllerUsers.postLogin); //Đăng nhập
router.post("/register", controllerUsers.register); //Đăng ký
router.delete("/deleteLogin/:id", controllerUsers.deleteLogin); //Cập nhật hồ sơ
router.get("/profile ", controllerUsers.userProfile); //Lấy thông tin người dùng
router.put("/profile ", controllerUsers.updateLogin); //Cập nhật hồ sơ
router.post("/forgot", controllerUsers.userForgot);
router.post("/otp", controllerUsers.userOtp);
router.post("/resetPassword", controllerUsers.userResetPassword);
router.patch("/updateUserMoney", controllerUsers.updateUserMoney);
module.exports = router;
