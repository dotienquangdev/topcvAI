const Jobs = require("../models/jobs.models");
const mongoose = require("mongoose");

const getJobs = async (req, res) => {
  try {
    const {
      _page = 1,
      _limit = 100,
      _sort = "title",
      _order = "asc",
    } = req.query;
    let params = [];
    params.sortField = "title";
    params.sortType = "asc";

    const page = parseInt(_page);
    const limit = parseInt(_limit);
    const skip = (page - 1) * limit;
    const sortOrder = _order === "asc" ? 1 : -1;

    // Lấy jobs có phân trang + populate company & category
    let jobs = await Jobs.find({
      deleted: false,
      status: "active",
    })
      .populate({
        path: "company_id",
        match: {
          deleted: false,
          status: "active",
        }, // chỉ lấy công ty active
      })
      .populate({
        path: "category_id",
        match: {
          deleted: false,
          status: "active",
        },
      })
      .sort({ [_sort]: sortOrder })
      .skip(skip)
      .limit(limit);

    // Lọc bỏ job không có company hợp lệ
    jobs = jobs.filter((job) => job.company_id);

    // console.log(job);

    // Lấy tổng số lượng job (công ty phải active)
    const total = await Jobs.countDocuments({
      deleted: false,
      status: "active",
    });
    res.status(200).json({
      success: true,
      message: "Lấy danh sách công việc thành công!",
      docs: jobs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Lỗi getJobs:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ!",
    });
  }
};

const listJobs = async (req, res) => {
  try {
    const jobsId = req.params.id;
    // console.log("ID nhận được:", jobsId);
    if (!jobsId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu ID jobs",
      });
    }
    const jobs = await Jobs.findById(jobsId)
      .populate("company_id")
      .populate("category_id");
    if (!jobs) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy jobs!",
      });
    }

    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin Jobs", error);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
};

const postJobsApply = async (req, res) => {
  try {
    const {
      title,
      description, // 👈 thêm vào
      requirements,
      salary_min,
      salary_max,
      formWork,
      workExperience,
      experience_level,
      location,
      company_id,
      category_id,
      deadline,
      skills,
      job_benefits,
    } = req.body;

    // Validation
    if (
      !title?.trim() ||
      !description?.trim() || // 👈 check luôn description
      !requirements?.trim() ||
      salary_min === undefined ||
      salary_max === undefined ||
      !formWork ||
      !workExperience ||
      !experience_level ||
      !location?.trim() ||
      !company_id ||
      !category_id ||
      !job_benefits
    ) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ thông tin!",
      });
    }

    if (salary_min < 0 || salary_max < 0) {
      return res.status(400).json({
        success: false,
        message: "Tiền lương phải lớn hơn hoặc bằng 0!",
      });
    }
    if (salary_min >= salary_max) {
      return res.status(400).json({
        success: false,
        message: "Tiền lương tối đa phải lớn hơn lương tối thiểu!",
      });
    }
    // Kiểm tra trùng lặp
    const existingJob = await Jobs.findOne({
      title,
      company_id,
      category_id,
      location,
      formWork,
      workExperience,
      experience_level,
      salary_min,
      salary_max,
    });

    if (existingJob) {
      return res.status(409).json({
        success: false,
        message: "Công việc này đã tồn tại!",
      });
    }
    // Tạo job mới
    const newJob = new Jobs({
      title,
      description, // 👈 truyền vào DB
      requirements,
      salary_min: parseInt(salary_min),
      salary_max: parseInt(salary_max),
      formWork,
      workExperience,
      experience_level,
      location,
      company_id,
      category_id,
      deadline,
      job_benefits,
      skills: skills || [],
      status: "active",
      deleted: false,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await newJob.save();

    return res.status(201).json({
      success: true,
      message: "Tạo công việc mới thành công!",
      job: {
        _id: newJob._id,
        title: newJob.title,
        description: newJob.description,
        requirements: newJob.requirements,
        salary_min: newJob.salary_min,
        salary_max: newJob.salary_max,
        formWork: newJob.formWork,
        workExperience: newJob.workExperience,
        experience_level: newJob.experience_level,
        location: newJob.location,
        company_id: newJob.company_id,
        category_id: newJob.category_id,
        skills: newJob.skills,
        deadline: newJob.deadline,
        job_benefits: newJob.job_benefits,
      },
    });
  } catch (error) {
    console.error("Lỗi postJobsApply:", error);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi phía server.",
    });
  }
};

const normalizeSalaryFields = async (req, res) => {
  try {
    const jobs = await Jobs.find({
      salary_min: { $gt: 1000000 },
    });

    let count = 0;

    for (const job of jobs) {
      job.salary_min = Math.round(job.salary_min / 1_000_000);
      job.salary_max = Math.round(job.salary_max / 1_000_000);
      await job.save();
      count++;
    }

    return res.status(200).json({
      success: true,
      message: `✅ Đã cập nhật ${count} job thành công.`,
    });
  } catch (error) {
    console.error("❌ Lỗi cập nhật lương:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật salary_min/salary_max",
    });
  }
};

const deleteJobs = async (req, res) => {
  try {
    const id = req.params.id;
    // console.log("req params : ", id);
    if (!id) {
      req.flash("error", "Không có id");
    }
    const deletedJobs = await Jobs.updateOne(
      { _id: id },
      {
        deleted: true,
        updated_at: new Date(),
      }
    );
    if (deletedJobs.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy người dùng để xóa ! " });
    }
    return res.status(404).json({ message: "Xóa Jobs thành công !" });
  } catch (error) {
    console.error("Lỗi khi xóa Jobs", error);
  }
};

const editJobsApply = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const updateData = { ...req.body };
    // Nếu company_id là object => chỉ lấy _id
    if (updateData.company_id?._id) {
      updateData.company_id = updateData.company_id._id;
    }
    if (updateData.category_id?._id) {
      updateData.category_id = updateData.category_id._id;
    }
    const updatedJob = await Jobs.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
      { updated_at: new Date() }
    );
    if (!updatedJob) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy công việc để cập nhật" });
    }
    res.json({ updatedJob });
    // console.log("Dữ liệu nhận được:", updatedJob);
  } catch (error) {
    console.error("Lỗi cập nhật công việc:", error);
    return res.status(500).json({ message: "Lỗi server." });
  }
};
const saveJob = async (req, res) => {};
const savedJobs = async (req, res) => {};
const suggestionsJobs = async (req, res) => {};

const updateAllJobsStatus = async () => {
  try {
    const result = await Jobs.updateMany(
      {}, // không điều kiện -> áp dụng cho tất cả
      {
        $set: {
          job_benefits: `
          Gói thu nhập đến 16 tháng lương/ năm.
          Xét tăng lương theo năng lực và kết quả công việc định kỳ 1 lần/ năm hoặc tăng lương đột xuất theo hiệu quả công việc
          Chế độ Bảo hiểm sức khỏe cho bản thân và người nhà
          Nghỉ thứ Bảy, Chủ nhật hàng tuần
          Du lịch, Teambuilding/ dã ngoại định kỳ hàng năm
          Chế độ mừng sinh con, quà nhân ngày Lễ/ Tết, quà ngày truyền thống và các chế độ phúc lợi khác
          Tham gia các khóa đào tạo chuyên môn, nâng cao kỹ năng thực hiện công việc, kỹ năng mềm và thi các chứng chỉ CNTT Quốc tế miễn phí tại Công ty
          Được tham gia các chương trình đào tạo trước khi bắt đầu công việc và trong quá trình làm việc theo yêu cầu công việc
          Chính sách phát triển, thăng tiến có lộ trình theo từng vị trí, từng phòng ban
            `,
        },
      }
    );
    console.log("Kết quả cập nhật:", result);
  } catch (error) {
    console.error("Lỗi cập nhật status:", error);
  }
};
module.exports = {
  getJobs,
  listJobs,
  postJobsApply,
  saveJob,
  savedJobs,
  suggestionsJobs,
  deleteJobs,
  normalizeSalaryFields,
  editJobsApply,
  updateAllJobsStatus,
};
