const express = require("express");
const router = express.Router();
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const controller = require("../controllers/images.js");
const cloudinary = require("../config/cloudinaryConfig.js");
const multer = require("multer");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "demoNodeJS",
    format: "jpg",
  },
});
const upload = multer({ storage: storage });
router.post("/upload", upload.array("images", 10), controller.uploadImages);
router.delete("/remove/:publicID", controller.removeImages);

module.exports = router;
