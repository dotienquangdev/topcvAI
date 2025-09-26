import "./header.css";
import "./headerUser.css";
import "./header2.css";
import dataHeader from "../../data/dataHeader";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getJobApplication1 } from "../../services/jobApplication";
import { getCategories1 } from "../../services/categories";

function Header() {
  const [dataCategories, setDataCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // menu người dùng
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // popup cài đặt
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [userJobs, setUserJobs] = useState([]);

  // toggle theme
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories1();
        setDataCategories(data.categories || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);
  // lấy thông tin user từ localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) setUser(userData);
  }, []);

  // toggle menu user
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsMenuOpen(false);
  };

  // mở popup cài đặt
  const handleOpenSettings = async () => {
    if (!user) {
      alert("Bạn cần đăng nhập để xem công việc đã ứng tuyển");
      return;
    }
    try {
      const data = await getJobApplication1();
      if (data.success) {
        const userApplications = data.data.filter(
          (jobApp) => jobApp.user_id._id === user._id
        );
        setUserJobs(userApplications);
      }
      console.log("setUserJobs", setUserJobs);
      setIsSettingsOpen(true);
    } catch (err) {
      console.error("Lỗi lấy job ứng tuyển:", err);
    }
  };

  return (
    <>
      <div className="header">
        <div className="header-topcv">
          <div className="topCV_img">
            <a href="/">
              <img
                src="https://static.topcv.vn/v4/image/logo/topcv-logo-6.png"
                alt="logo_company"
              />
            </a>
          </div>
          {/* menu jobs */}
          <div className="topCV_jobs">
            {dataHeader.map((item, index) => (
              <div className="topcv_jobs-item" key={item.id || index}>
                <span>{item.title}</span>

                <div className="topcv_jobs-dropdown">
                  {item.child?.map((childItem, idx) => (
                    <div
                      key={childItem.id || idx}
                      className={childItem.className}
                    >
                      {childItem.title && <p>{childItem.title}</p>}
                      {childItem.id === "jobs_location" ? (
                        <div className="nav-subs dataCategories">
                          {dataCategories
                            .filter(
                              (cat) =>
                                cat.status === "active" ||
                                cat.status === "inactive"
                            )
                            .map((cat) => (
                              <div
                                key={cat._id}
                                className="dataCategoriesText nav-icon nav-iconItems"
                              >
                                <a
                                  href={`/viec-lam/${cat.slug}`}
                                  className="nav-category-item"
                                >
                                  {cat.name}
                                </a>
                                <p className="nav-icont_textP">
                                  <i className="fa-solid fa-arrow-right"></i>
                                </p>
                              </div>
                            ))}
                        </div>
                      ) : (
                        childItem.childJobs?.map((job, jobIdx) => (
                          <div
                            key={jobIdx}
                            className={job.className && "nav-sub"}
                          >
                            {job.title && <h3>{job.title}</h3>}
                            {job.childText?.map((text, textIdx) => (
                              <div
                                key={textIdx}
                                className={
                                  text.className && "nav-icon nav-iconItems"
                                }
                              >
                                <div className="nav-icont_text">
                                  {text.icon && (
                                    <img
                                      src={text.icon}
                                      alt={text.title}
                                      width={20}
                                    />
                                  )}
                                  <span>{text.title}</span>
                                </div>
                                <p className="nav-icont_textP">
                                  <i className="fa-solid fa-arrow-right"></i>
                                </p>
                              </div>
                            ))}
                            {job.childNewCVItem?.map((cv, cvIdx) => (
                              <div key={cvIdx} className="cv-item">
                                {cv.icon && (
                                  <img
                                    src={cv.icon}
                                    alt={cv.title}
                                    width={20}
                                  />
                                )}
                                <span>{cv.title}</span>
                              </div>
                            ))}
                            {job.link && (
                              <a
                                href={job.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={job}
                              >
                                {job.link}
                              </a>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* user section */}
          <div className="topCV_user">
            <div className="header-user">
              {/* theme switch */}
              <div className="switch-container">
                <input
                  type="checkbox"
                  className="switch"
                  id="themeSwitch"
                  onChange={toggleTheme}
                  checked={theme === "dark"}
                />
                <label htmlFor="themeSwitch">
                  {theme === "dark" ? (
                    <i className="fa-solid fa-sun light"></i>
                  ) : (
                    <i className="fa-solid fa-moon dark"></i>
                  )}
                </label>
              </div>

              {/* settings icon */}
              <div className="headerUser-setting" onClick={handleOpenSettings}>
                <i className="fa-solid fa-gear"></i>
              </div>

              {/* popup settings hiển thị job ứng tuyển */}
              {isSettingsOpen && (
                <div className="user-settings">
                  <h4>Lịch sử nạp tiền:</h4>
                  <h4>Công việc đã ứng tuyển:</h4>
                  {userJobs.length > 0 ? (
                    userJobs.map((job) => (
                      <div key={job._id} className="user-job-item">
                        <p className="job-title">
                          {job.job_id.title || "Chưa có tiêu đề"}-applied
                        </p>
                        <a
                          href={`/userCVApply/${job._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="job-cv-link"
                        >
                          Chi tiết
                        </a>
                        <a
                          href={job.cv_file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="job-cv-link"
                        >
                          Xem CV
                        </a>
                      </div>
                    ))
                  ) : (
                    <p className="job-empty">Chưa ứng tuyển công việc nào</p>
                  )}
                  <button onClick={() => setIsSettingsOpen(false)}>Đóng</button>
                </div>
              )}

              {/* user menu */}
              {isMenuOpen && (
                <div className="user-menu">
                  {user ? (
                    <div className="user-menu-title">
                      <img src={user.avatar_url} alt={user.fullName} />
                      <span>{user.fullName}</span>
                      <button onClick={handleLogout}>Đăng xuất</button>
                    </div>
                  ) : (
                    <div className="user-menu-titleNone">
                      <p>Tài khoản: Chưa đăng nhập</p>
                      <Link to="/userLogin">
                        <button>Đăng nhập</button>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* avatar / login */}
              <div className="headerUser-id" onClick={toggleMenu}>
                <span>
                  {user ? (
                    <img
                      className="user-menuImg"
                      src={user.avatar_url}
                      alt={user.fullName}
                    />
                  ) : (
                    "Đăng nhập"
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
