const Candidate = require("../models/candidate_profiles.models");

const getCandidate = async (req, res) => {
  const candidate = await Candidate.find({
    deleted: false,
  });
  res.json({
    candidate: candidate,
  });
};
const putCandidate = async (req, res) => {
  const id = req.params.id;
  try {
    await Candidate.updateOne(
      { _id: id },
      {
        ...req.body,
        $push: {
          updatedBy: updatedBy,
        },
      }
    );
  } catch (error) {
    req.flash("error", "Cập nhật thành công!");
  }
};
const listCandidate = async (req, res) => {
  try {
    const candidateId = req.body._id;
    // console.log(candidate);
    if (!candidate) {
      return res.status(400).json({
        success: false,
        message: "Thiếu ID công ty!",
      });
    }
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy",
      });
    }
    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin công ty:", error);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
};
const applyCandidate = async (req, res) => {
  const candidate = new Candidate({
    ...req.body,
    created_at: new Date(),
  });
  await candidate.save();
  res.status(200).json({
    success: true,
    message: `Tạo mới CV thành công : ${candidate.headline}`,
    candidate: {
      _id: candidate._id,
      headline: candidate.headline,
      summary: candidate.summary,
      dob: candidate.dob,
      address: candidate.address,
      gender: candidate.gender,
    },
  });
};
const deleteCandidate = async (req, res) => {
  try {
    const id = req.params.id;
    // console.log("req params: ", id);
    const updated = await Candidate.updateOne(
      { _id: id },
      {
        deleted: true,
        updated_at: new Date(),
      }
    );
    if (updated.modifiedCount === 0) P;
    return res.status(404).json({ message: "Không tim thấy công ty để xóa" });
  } catch (error) {
    console.log("Lỗi xóa!", error);
  }
};
module.exports = {
  getCandidate,
  putCandidate,
  listCandidate,
  applyCandidate,
  deleteCandidate,
};
