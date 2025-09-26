import "./companyRegistration.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { postRegister } from "../../../services/user";
function CompanyRegistration({ title }) {
  // User
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // Company
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [size, setSize] = useState("");
  const [foundedYear, setFoundedYear] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [phone, setPhone] = useState("");
  // Others
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (!fullName || !email || !password || !confirmPassword || !companyName) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp.");
      return;
    }
    setLoading(true);
    const result = await postRegister({
      fullName,
      email,
      password,
      phone,
      company: {
        name: companyName,
        website,
        location,
        size,
        founded_year: foundedYear,
        description,
        logo_url: logoUrl,
      },
    });
    setLoading(false);
    if (result.success) {
      navigate("/userLogin");
    } else {
      setError(result.message || "Đăng ký thất bại, thử lại sau!");
    }
  };
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className="companyRegister">
        <h1 className="title">Đăng Ký Công Ty</h1>
        <form className="companyRegister-form" onSubmit={handleRegister}>
          <div className="form-columns">
            {/* Cột trái - User */}
            <div className="form-column">
              <h2 className="sub-title">Thông tin tài khoản</h2>
              <label>Họ và tên</label>
              <input
                className="userInputRegister"
                placeholder="Nhập họ tên"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <label>Email</label>
              <input
                className="userInputRegister"
                type="email"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label>Mật khẩu</label>
              <input
                className="userInputRegister"
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label>Nhập lại mật khẩu</label>
              <input
                className="userInputRegister"
                type="password"
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {/* Cột phải - Company */}
            <div className="form-column">
              <h2 className="sub-title">Thông tin công ty</h2>
              <label>Tên công ty</label>
              <input
                className="userInputRegister"
                placeholder="Nhập tên công ty"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
              <label>Website</label>
              <input
                className="userInputRegister"
                placeholder="https://yourcompany.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
              <label>Địa chỉ</label>
              <input
                className="userInputRegister"
                placeholder="Địa chỉ công ty"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <label>Quy mô</label>
              <input
                className="userInputRegister"
                placeholder="Ví dụ: 11-50 nhân sự"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              />
              <label>Phone</label>
              <input
                className="userInputRegister"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <label>Năm thành lập</label>
              <input
                className="userInputRegister"
                placeholder="VD: 2015"
                value={foundedYear}
                onChange={(e) => setFoundedYear(e.target.value)}
              />
              <label>Logo URL</label>
              <input
                className="userInputRegister"
                placeholder="Link logo công ty"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
              />
              <label>Giới thiệu</label>
              <textarea
                className="userInputRegister"
                placeholder="Mô tả ngắn về công ty..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="error-text">{error}</p>}
          <div className="companyRegister-button">
            <button type="submit" disabled={loading}>
              {loading ? "Đang xử lý..." : "Đăng Ký Công Ty"}
            </button>
            <span>
              Đã có tài khoản? <Link to={`/userLogin`}>Đăng Nhập</Link>
            </span>
          </div>
        </form>
      </div>
    </>
  );
}

export default CompanyRegistration;
