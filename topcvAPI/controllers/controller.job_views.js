const JobViews = require("../models/job_views.models");

const getJobViews = async (req, res) => {
  const jobViews = await JobViews.find({
    deleted: false,
  });
  res.json({
    jobViews: jobViews,
  });
};
const putJobViews = async (req, res) => {};

const postJobViews = async (req, res) => {
  try {
    const { job_id, ip_address } = req.body;
    const jobViews = await JobViews({
      ...req.body,
    });

    await jobViews.save();
    res.status(200).json({
      success: true,
      message: "Lưu lượt xem thành công!",
      view: {
        _id: jobViews._id,
        job_id: jobViews.job_id,
        ip_address: jobViews.ip_address,
        viewed_at: jobViews.viewed_at,
        created_at: jobViews.created_at,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi sever!" });
  }
};
const deleteJobViews = async (req, res) => {};

module.exports = {
  getJobViews,
  putJobViews,
  postJobViews,
  deleteJobViews,
};
