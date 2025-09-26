const Employer = require("../models/job_categories.models");
const getEmployer = async (req, res) => {
  const employer = await Employer.find({
    deleted: false,
  });
  res.json({
    employer: employer,
  });
};
const postEmployer = async (req, res) => {
  try {
    const { name, slug } = req.body;
    const employers = await Employer({
      ...req.body,
    });

    await employers.save();
    res.status(200).json({
      success: true,
      message: `Đăng ký thành công!`,
      user: {
        _id: employers._id,
        name: employers.name,
        slug: employers.slug,
        created_at: new Date(),
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi sever!" });
  }
};
const deleteEmployer = async (req, res) => {};
const deleteEmployerApplications = async (req, res) => {};
const deleteEmployerJobs = async (req, res) => {};
module.exports = {
  postEmployer,
  getEmployer,
  deleteEmployer,
  deleteEmployerApplications,
  deleteEmployerJobs,
};
