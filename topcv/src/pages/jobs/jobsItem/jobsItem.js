import { useEffect, useState } from "react";
import "./jobsItem.css";
import { useParams, useNavigate } from "react-router-dom";
import { createJobsId } from "../../../services/jobs";
import { Helmet } from "react-helmet-async";
import { postJobApplication } from "../../../services/jobApplication";
import NotificationBox from "../../../Notification/admin/Notification";

function JobsItemId({ title }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [userApply, setUserApply] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showLoginNotice, setShowLoginNotice] = useState(false);

  // State cho form ứng tuyển
  const [cvFile, setCvFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");

  const [notif, setNotif] = useState({ show: false, type: "", content: "" });
  //hiện thông báo
  const showNotification = (content, type = "success") => {
    setNotif({ show: true, type, content });
    setTimeout(() => setNotif({ show: false, type: "", content: "" }), 3000);
  };
  useEffect(() => {
    const fetchJobsId = async () => {
      try {
        // Lấy dữ liệu job
        const dataJobsItem = await createJobsId(id);
        setJob(dataJobsItem.data);
        // Lấy user từ localStorage
        const userData = localStorage.getItem("user");
        if (userData) {
          setUserApply(JSON.parse(userData));
        } else {
          setUserApply(null);
        }
      } catch (error) {
        console.error("Lỗi khi tải công việc:", error);
      }
    };
    if (id) fetchJobsId();
  }, [id]);

  // Hàm nộp đơn
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userApply || !job) return;
    // ✅ Kiểm tra coverLetter
    if (!coverLetter || coverLetter.trim() === "") {
      alert("Giới thiệu ngắn gọn về bẩn thân!");
      return;
    }
    // ✅ Kiểm tra file CV
    if (!cvFile) {
      alert("Vui lòng chọn file CV!");
      return;
    }
    const formData = new FormData();
    formData.append("user_id", userApply._id);
    formData.append("job_id", job._id);
    formData.append("cover_letter", coverLetter);

    if (cvFile) {
      formData.append("cv_file", cvFile);
    }

    try {
      const result = await postJobApplication(formData);
      if (result.success) {
        showNotification("Đã ứng tuyển thành công", "success");
        // alert("Ứng tuyển thành công!");
        setShowApplyModal(false);
      } else {
        alert(result.message || "Ứng tuyển thất bại!");
      }
      console.log("Kết quả:", result);
    } catch (error) {
      console.error("Lỗi thêm jobApplication:", error);
      alert("Đã xảy ra lỗi khi ứng tuyển.");
    }
  };

  // Khi bấm ứng tuyển
  const handleApplyClick = () => {
    if (!userApply) {
      setShowLoginNotice(true); // Nếu chưa login → hiện thông báo
      return;
    }
    setShowApplyModal(true);
  };

  if (!job) return <p>Đang tải dữ liệu...</p>;

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      {notif.show && (
        <NotificationBox
          type={notif.type}
          onClose={() => setNotif({ show: false, type: "", content: "" })}
        >
          {notif.content}
        </NotificationBox>
      )}
      <div className="job-details-container">
        <div className="job-summary-card">
          <div className="job-header">
            <img
              className="job-logo"
              src={job?.company_id.logo_url}
              alt={job.title}
            />
            <div className="job-header-text">
              <h2 className="job-title">{job.title || []}</h2>
              <p className="company-name">{job?.company_id.name || []}</p>
            </div>
          </div>

          <div className="job-meta">
            <div className="meta-item">
              Vị trí tuyển dụng: {job.experience_level_id.experienceName || []}
            </div>
            <div className="meta-item">📍 Địa chỉ: {job.location || []}</div>
            <div className="meta-item">
              Lương: {job.salary_min}-{job.salary_max} triệu
            </div>
            <div className="meta-item">
              ⌛Hạn nộp hồ sơ: {new Date(job.deadline).toLocaleDateString()}
            </div>
            <div className="meta-item">
              🕒Ngày tạo {new Date(job.created_at).toLocaleDateString()}
            </div>
          </div>

          <div className="job-meta job-metas">
            <h3>Thông tin công việc:</h3>
            <div className="meta-item">
              Lĩnh vực: {job.category_id.name || []} ({job.skills || []})
            </div>
            <div className="meta-item">Nơi làm việc: {job.location || []}</div>
            <div className="meta-item">
              Hình thức làm việc:
              {job.formWork_id
                ? job.formWork_id.formWorkName
                : "Không xác định"}
            </div>
            <div className="meta-item">
              Kinh nghiệm: {job.workExperience_id.label || []}
            </div>
            <div className="meta-item">
              Lương: {job.salary_min}-{job.salary_max} triệu
            </div>
            <div className="meta-item">
              Vị trí tuyển dụng: {job.experience_level_id.experienceName || []}
            </div>
            <div className="meta-item">
              🗓️ Hạn nộp hồ sơ: {new Date(job.deadline).toLocaleDateString()}
            </div>
          </div>

          <div className="job-meta job-metas">
            <h3>Thông tin công ty:</h3>
            <div className="meta-item">
              Tên công ty: {job.company_id.name || []}
            </div>
            <div className="meta-item">
              Website: {job.company_id.website || []}
            </div>
            <div className="meta-item">
              Địa chỉ:{job.company_id.location || []}
            </div>
            <div className="meta-item">
              SDT: {job.company_id.companies_Phone || []}
            </div>
            <div className="meta-item">
              Mã số thuế: {job.company_id.tax_code || []}
            </div>
            <div className="meta-item">
              Số nhân viên: {job.company_id.size || []}
            </div>
          </div>

          <div className="job-meta job-metas">
            <h3>Mô tả công việc :</h3>
            <div className="meta-item">
              Mô tả công việc: {job.description || []}
            </div>
            <div className="meta-item">
              Yêu cầu ứng viên: {job.requirements || []}
            </div>
            <div className="meta-item">Quyền lợi: {job.job_benefits || []}</div>
          </div>

          <div className="job-buttons">
            <button className="btn-apply" onClick={handleApplyClick}>
              Ứng tuyển ngay
            </button>
            <button className="btn-save">Lưu tin</button>
          </div>
        </div>
      </div>

      {/* Modal Apply (khi đã login) */}
      {showApplyModal && userApply && (
        <div className="modal-overlay">
          <form
            className="modal-content"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <h2>Ứng tuyển {job.title}</h2>
            <div className="apply-section-information">
              <h4>Thông tin ứng viên</h4>
              <p>
                Họ và tên: <strong>{userApply.fullName}</strong>
              </p>
              <p>
                Email: <strong>{userApply.email}</strong>
              </p>
              <p>
                Số điện thoại: <strong>{userApply.phone}</strong>
              </p>
            </div>
            <div className="apply-section apload-file-container">
              <label>Chọn CV để ứng tuyển</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.mp3"
                onChange={(e) => setCvFile(e.target.files[0])}
              />
            </div>
            CV tự chọn CV online (Nhấn vào đây để xem lại CV của bạn)
            <div className="apply-section">
              <label>Giới thiệu về bản thân</label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Viết thư giới thiệu ngắn gọn..."
              ></textarea>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowApplyModal(false)}
              >
                Hủy
              </button>
              <button type="submit" className="btn-submit">
                Nộp hồ sơ ứng tuyển
              </button>

              <button
                type="button"
                className="btn-submits"
                onClick={() => navigate("/tao-cv")}
              >
                Chưa có CV? Tạo CV
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Thông báo login (khi chưa login) */}
      {showLoginNotice && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Bạn chưa đăng nhập</h3>
            <p>Vui lòng đăng nhập để tiếp tục ứng tuyển công việc này.</p>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowLoginNotice(false)}
              >
                Hủy
              </button>
              <button
                className="btn-submit"
                onClick={() => navigate("/userLogin")}
              >
                Đăng nhập
              </button>
              <button
                className="btn-submit"
                onClick={() => navigate("/userRegister")}
              >
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default JobsItemId;
