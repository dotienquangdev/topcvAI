import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: "d8s614433a348cd4f258990056321f57697",
  api_key: "928968359113284",
  api_secret: "lp5AgY4gGEmKFsS9tGhWTNgn6F4",
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "demoNodeJS",
    format: async (req, file) => "jpg",
    public_id: (req, file) => file.originalname,
  },
});

const upload = multer({ storage });
export default upload;
