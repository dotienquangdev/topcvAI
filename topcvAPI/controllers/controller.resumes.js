const CandidateProfiles = require("../models/candidate_profiles.models");
const JobsApplications = require("../models/job_applications.models");
const JobsCategories = require("../models/job_categories.models");
const JobsView = require("../models/job_views.models");
const Resumes = require("../models/resumes.models");

const postResumes = async (req, res) => {
  try {
    const file_url = req.body.file_url;
    const title = req.body.title;
    if (file_url == "" || title == "") {
      return res.status(401).json({ message: "Nhập đủ thông tin" });
    }
    const resumes = new Resumes({
      ...req.body,
      title: title,
      file_url: file_url,
      created_at: new Date(),
    });
    await resumes.save();
    res.status(200).json({
      success: true,
      message: `Tạo mới CV thành công : ${resumes.title}`,
      resumes: {
        _id: resumes._id,
        file_url: resumes.file_url,
        title: resumes.title,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi sever!" });
  }
};
const getResumes = async (req, res) => {
  const resumes = await Resumes.find({
    deleted: false,
  });
  res.json({
    resumes: resumes,
  });
};
const putResumes = async (req, res) => {
  const id = req.params.id;
  if (req.file_url) {
    req.body.file_url = `/upload/${req.file_url.filename}`;
  }
  try {
    const updatedBy = {
      account_id: res.locals.user.id,
      updated_at: new Date(),
    };
    await Resumes.updateOne(
      { _id: id },
      {
        ...req.body,
        $push: {
          updatedBy: updatedBy,
        },
      }
    );
    res.flash("success", "Cập nhật CV thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật thất bại!");
  }
  res.redirect("back");
};
const deleteResumes = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("req.params 123 :", req.params.id);
    if (!id) {
      req.flash("error", "Không có id ");
    }
    const updated = await Resumes.updateOne(
      { _id: id },
      { deleted: true, updated_at: new Date() }
    );
    if (updated.modifiedCount === 0) {
      return res.status(404).json({ message: "Không tìm thấy CV để xóa!" });
    }
    return res.status(404).json({ message: "Xóa CV thành công!" });
  } catch (error) {
    console.log(`Lỗi khi xóa CV : `, error);
  }
};

module.exports = { postResumes, getResumes, putResumes, deleteResumes };
