const User = require("../models/users.model");
const md5 = require("md5");
const generateHelper = require("../helper/generate");
const sendMailHelper = require("../helper/sendMail");
const ForgotPassword = require("../models/forgot-password.model");

const register = async (req, res) => {
  const exitEmail = await User.findOne({
    email: req.body.email,
  });
  const exitPhone = await User.findOne({
    phone: req.body.phone,
  });

  if (!req.body.phone) {
    return res
      .status(400)
      .json({ success: false, message: "Phone không được để trống!" });
  }
  if (!req.body.email) {
    return res
      .status(400)
      .json({ success: false, message: "Email không được để trống!" });
  }
  if (exitEmail) {
    return res
      .status(400)
      .json({ success: false, message: "Email đã tồn tại!" });
  }

  if (exitPhone) {
    return res
      .status(400)
      .json({ success: false, message: "Phone đã tồn tại!" });
  }

  // Mã hóa mật khẩu trước khi lưu
  const hashedPassword = md5(req.body.password);
  const user = new User({
    ...req.body,
    password: hashedPassword,
    level: 1,
    created_at: new Date(),
  });
  await user.save();
  res.status(200).json({
    success: true,
    message: `Đăng ký thành công!` + `Chào mừng bạn mới : ${user.fullName}`,
    user: {
      _id: user._id,
      fullNameL: user.fullName,
      phone: user.phone,
      email: user.email,
      level: user.level,
      tokenUser: user.tokenUser,
    },
  });
};
const getLogin = async (req, res) => {
  const user = await User.find({
    deleted: false,
  });
  res.json({
    user: user,
  });
};
const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email,
      deleted: false,
      status: "active",
    });
    if (!user) {
      return res.status(401).json({ message: "Email không đúng." });
    }
    if (user.password !== md5(password)) {
      return res.status(401).json({ message: "Mật khẩu không chính xác!" });
    }
    return res.status(200).json({
      success: true,
      message: `Đăng nhập thành công! ` + `Xin chào : ${user.fullName}`,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        tokenUser: user.tokenUser,
        avatar_url: user.avatar_url,
        phone: user.phone,
        level: user.level,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi sever!" });
  }
};
const deleteLogin = async (req, res) => {
  try {
    const id = req.params.id;
    // console.log("req.params 123 :", req.params.id);
    if (!id) {
      req.flash("error", "Không có id ");
    }
    const updated = await User.updateOne(
      { _id: id },
      {
        deleted: true,
        updated_at: new Date(),
      }
    );
    if (updated.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy người dùng để xóa!" });
    }
    return res.status(404).json({ message: "Xóa người dùng thành công!" });
  } catch (error) {
    console.log(`Lỗi khi xóa người dùng : `, error);
  }
};
const userForgot = async (req, res) => {
  const email = req.body.email?.email || req.body.email;
  const user = await User.findOne({
    email,
    deleted: false,
  });
  if (!user)
    return res.status(404).json({
      success: false,
      message: "Email không tồn tại!",
    });
  const otp = generateHelper.generateRandomNumber(6);

  //Lưu OTP với thời hạn 3 phút
  const timeOtp = new ForgotPassword({
    email,
    otp,
    expiresAt: Date.now() + 3 * 60 * 10000,
  });

  await timeOtp.save;
  const subject = "Mã OTP xác minh lấy lại mật khẩu : ";
  const html = `Mã OTP là <b style="color:blue">${otp}</b>. Có hiệu lực 3 phút.`;
  sendMailHelper.sendMail(email, subject, html);

  return res.status(200).json({
    success: true,
    message: "Mã OTP đã được gửi qua email.",
  });
};
const userOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await ForgotPassword.findOne({
      email,
      otp,
    });
    if (!result) {
      return res.status(400).json({
        success: false,
        message: "Mã OTP không hợp lệ!",
      });
    }
    if (result.expiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Mã OTP đã hết hạn!",
      });
    }
    // Tạo ngẫu nhiên đơn giản hoặc dùng JWT nếu muốn
    const tokenUser = Math.random().toString(36).substring(2);
    await User.updateOne({ email }, { tokenUser });

    return res.status(200).json({
      success: true,
      message: "OTP hợp lệ!",
      tokenUser,
    });
  } catch (error) {
    console.error("OTP check error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi server khi xác minh OTP" });
  }
};
const userResetPassword = async (req, res) => {
  try {
    const { email, password, tokenUser } = req.body;
    if (!email || !password || !tokenUser) {
      return res.status(400).json({
        success: false,
        message: "Thiếu dữ liệu đầu vào!",
      });
    }
    const user = await User.findOne({
      email,
      tokenUser,
      deleted: false,
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token user không hợp lệ hoặc người dùng không tồn tại!",
      });
    }

    const handlePassword = md5(password);
    const result = await User.updateOne(
      { email, tokenUser },
      {
        $set: {
          password: handlePassword,
          tokenUser: tokenUser,
        },
      }
    );
    if (result.modifiedCount > 0) {
      return res.status(200).json({
        success: true,
        message: "Đặt lại mật khẩu thành công!",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Cập nhật mật khẩu thất bại!",
      });
    }
  } catch (error) {
    console.error("Error in userResetPassword : ", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ, vui lòng thử lại sau!",
    });
  }
};
const userProfile = async (req, res) => {
  try {
    const userID = req.session._id;
    if (!userID) {
      return res.status(401).json({
        message: "Chưa đăng nhập!",
      });
    }
    const user = await User.find(
      {
        _id: userID,
        deleted: false,
        status: "active",
      }.select("-password")
    );
    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng!",
      });
    }
    res.json({
      user: user,
    });
  } catch (error) {}
};
const updateLogin = async (req, res) => {
  const id = req.params.id;
  if (req.file) {
    req.body.avatar = `/upload/${req.file.filename}`;
  }
  try {
    const updatedBy = {
      account_id: res.locals.user.id,
      updated_at: new Date(),
    };
    await User.updateOne(
      { _id: id },
      {
        ...req.body,
        $push: {
          updatedBy: updatedBy,
        },
      }
    );
    res.flash("success", "Cập nhật sản phẩm thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật thất bại!");
  }
  res.redirect("back");
};

const updateUserMoney = async () => {
  try {
    const result = await User.updateMany(
      {}, // không có điều kiện => tất cả user
      {
        $set: { money: 2000 },
      }
    );
    console.log("Kết quả cập nhật:", result);
  } catch (error) {
    console.error("Lỗi cập nhật money:", error);
  }
};
module.exports = {
  register,
  postLogin,
  getLogin,
  userProfile,
  updateLogin,
  deleteLogin,
  userResetPassword,
  userOtp,
  userForgot,
  updateUserMoney,
};
