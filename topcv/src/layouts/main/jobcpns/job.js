import "./job.css";
import { useEffect, useState } from "react";
import { createJobs } from "../../../services/jobs";
import JobItem from "../../../pages/jobs/jobs";
function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hoveredJob, setHoveredJob] = useState(null); // ✅ Job đang hover
  const [popupPosition, setPopupPosition] = useState(""); // 👈 Thêm dòng này
  const [sortField, setSortField] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("asc");
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const limit = 12;
  const handleSortChange = (value) => {
    if (value.startsWith("category-")) {
      const categoryName = value.replace("category-", "");
      const filtered = jobs.filter(
        (job) => job.category_id?.name === categoryName
      );
      setJobs(filtered);
      setTotalPages(1);
      setPage(1);
    } else if (value.includes("-")) {
      const [field, order] = value.split("-");
      setSortField(field);
      setSortOrder(order);
      setPage(1);
    } else {
      setSortField("created_at");
      setSortOrder("asc");
    }
  };
  const handleHover = (event, job) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = window.innerWidth / 2;

    let positionClass = "";
    if (rect.left > centerX + 100) {
      positionClass = "popup-left"; // nếu ở phải màn hình => hiện qua trái
    } else if (rect.right < centerX - 100) {
      positionClass = "popup-right"; // nếu ở trái => hiện qua phải
    } else {
      positionClass = "popup-shift-left"; // nếu ở giữa => hiện qua trái
    }
    setPopupPosition(positionClass); // state popup class
    setHoveredJob(job);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await createJobs(page, limit, sortField, sortOrder);
      if (data && Array.isArray(data.docs)) {
        setJobs(data.docs);
        setTotalPages(data.totalPages);
        setError(null);

        const categoryNames = [
          ...new Set(
            data.docs.map((job) => job.category_id?.name).filter(Boolean)
          ),
        ];
        setCategories(categoryNames);
        const locs = [...new Set(data.docs.map((job) => job.location))];
        setLocations(locs);
      } else {
        setJobs([]);
        setError("Không có dữ liệu công ty !");
      }
    };
    fetchData();
  }, [page, sortField, sortOrder]);

  return (
    <div className="">
      <a href="/admin">
        <button>Admin</button>
      </a>
      <a href="/userLogin">
        <button>userLogin</button>
      </a>
      <a href="/vnpay">
        <button>Nạp tiền</button>
      </a>
      {error && <p>{error}</p>}

      <h2>Việc làm tốt nhất</h2>
      <select
        className="form-control"
        onChange={(e) => handleSortChange(e.target.value)}
      >
        <option value="created_at">--- Sắp xếp ---</option>

        <optgroup label="Địa điểm">
          {locations.map((loc, idx) => (
            <option key={idx} value={`location-${loc}`}>
              {loc}
            </option>
          ))}
        </optgroup>

        <optgroup label="Công việc">
          {categories.map((cat, idx) => (
            <option key={idx} value={`category-${cat}`}>
              {cat}
            </option>
          ))}
        </optgroup>

        <option value="title-asc">Tên A - Z</option>
        <option value="title-desc">Tên Z - A</option>
      </select>

      <ul className="jobs">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <JobItem
              key={job._id}
              item={job}
              hoveredJob={hoveredJob}
              popupPosition={popupPosition}
              handleHover={handleHover}
              clearHover={() => setHoveredJob(null)}
            />
          ))
        ) : (
          <h2>Không có dữ liệu công ty !</h2>
        )}
      </ul>

      {/* ✅ Phân trang */}
      <div className="pagination">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <span>
          Trang {page} / {totalPages}
        </span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
          <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>

      {/* ✅ Popup chi tiết job */}
      {hoveredJob && (
        <div
          className={`job-popup ${popupPosition}`}
          onMouseEnter={() => setHoveredJob(hoveredJob)}
          onMouseLeave={() => setHoveredJob(null)}
        >
          <img
            className="hovercompanie-img"
            src={hoveredJob?.company_id?.logo_url}
            alt={hoveredJob?.company_id?.name}
          />
          <div className="hoveredJob-text">
            <h3 className="">
              <span className="hovered-title">Tên công việc:</span>{" "}
              <span className="hoveredJob-title">{hoveredJob.title}</span>
            </h3>
            <p className="">
              <strong>Lương:</strong>{" "}
              {hoveredJob.salary_min > 100
                ? `${hoveredJob.salary_min} - ${hoveredJob.salary_max} $`
                : `${hoveredJob.salary_min} - ${hoveredJob.salary_max} triệu`}
            </p>
            <p>
              <strong>Công ty:</strong> {hoveredJob?.company_id?.name}
            </p>
          </div>
          <p
            className="locationJobs"
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <strong>Địa điểm:</strong>
            <strong className="job-location">{hoveredJob.location}</strong>
          </p>
          <div className="job-requirements">
            <p
              style={{
                fontWeight: "600",
              }}
            >
              Mô tả công việc:{" "}
            </p>
            <p>{hoveredJob?.requirements}</p>
            <p>{hoveredJob?.company_id?.description}</p>
          </div>

          <p>
            <strong>Danh mục:</strong> {hoveredJob?.category_id?.name}
          </p>
          <div className="buttonApply">
            <div className="apply">Ứng tuyển</div>
            <a href={`/jobs/${hoveredJob._id}`}>
              <div className="detail">Xem chi tiết</div>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default Jobs;
