const uploadImages = async (req, res) => {
  try {
    const images = req.file.map((file) => file.path);
    const uploadImages = [];
    for (let image of images) {
      const results = await cloudinary.uploader.upload(image);
      // console.log(results);
      uploadImages.push({
        url: results.secure_url,
        publicId: results.public_id,
      });
    }
    return res.status(200).json({
      message: "Uploaded images successfully!",
      datas: uploadImages,
    });
  } catch (error) {
    return res.status(400).json({
      name: error.name,
      message: error.message,
    });
  }
};

const removeImages = async (req, res) => {
  try {
    const publicId = req.params.publicId;
    const results = await cloudinary.uploader.destroy(publicId);
    if (results.result === "not found") {
      throw new Error("Delete images failed!");
    }
    return res.status(200).json({
      message: "Delete image successfully!",
    });
  } catch (error) {
    return res.status(400).json({
      name: error.name,
      message: error.message,
    });
  }
};

module.exports = { uploadImages, removeImages };
