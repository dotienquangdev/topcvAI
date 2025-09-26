const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Giới hạn loại file (chỉ pdf/doc/docx)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [".pdf", ".doc", ".docx", ".mp3"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ cho phép file PDF/DOC/DOCX/MP3!"), false);
  }
};
// nơi lưu file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "uploads/others";

    if (file.fieldname === "cv_file") {
      folder = "uploads/cv";
    } else if (file.fieldname === "profile_pic") {
      folder = "uploads/profile";
    }

    // đảm bảo folder tồn tại
    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + file.fieldname + path.extname(file.originalname)
    );
  },
});

// Thêm fileFilter
const upload = multer({ storage, fileFilter });

module.exports = upload;
