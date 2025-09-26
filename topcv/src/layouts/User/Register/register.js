import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";
import { Helmet } from "react-helmet-async";
import {
  forgotPasswordPost,
  postRegister,
  otpPasswordPost,
} from "../../../services/user";

function Register({ title }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState(1); // 1: Nhập email, 2: Nhập OTP + mật khẩu

  const handleSendOTP = async () => {
    if (!email) {
      setError("Vui lòng nhập email.");
      return;
    }
    console.log(email);
    setError("");
    setLoading(true);
    try {
      const res = await forgotPasswordPost({ email });

      if (res.success) {
        setStep(2);
        setError("Đã gửi mã OTP đến email.");
      } else {
        setError(res.message || "Không gửi được mã OTP.");
      }
    } catch (err) {
      setError("Lỗi khi gửi mã OTP.");
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !password || !phone || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp.");
      return;
    }
    const result = await postRegister({ fullName, phone, email, password });
    if (result.success) {
      navigate("/userLogin");
    } else {
      setError(result.message || "Đăng ký thất bại, thử lại sau!");
    }
  };

  // Xác nhận OTP và đổi mật khẩu
  const handleResetPassword = async () => {
    if (!otp || !password || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const otpCheck = await otpPasswordPost({ email, otp });

      if (!otpCheck.success) {
        setError("OTP không chính xác.");
        setLoading(false);
        return;
      }
      handleRegister();
    } catch (err) {
      setError("Lỗi khi đặt lại mật khẩu.");
    }
    setLoading(false);
  };
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className="userRegister">
        <h1 className="title">Đăng Ký</h1>
        <form className="userRegister-form" onSubmit={handleRegister}>
          <label>Tài khoản</label>
          <input
            className="userInputRegister"
            placeholder="Nhập tài khoản"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <label>Email</label>
          <input
            className="userInputRegister"
            placeholder="Nhập email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Phone</label>
          <input
            className="userInputRegister"
            placeholder="Nhập phone"
            type="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <label>Mật khẩu</label>
          <input
            className="userInputRegister"
            placeholder="Nhập mật khẩu"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>Nhập lại mật khẩu</label>
          <input
            className="userInputRegister"
            placeholder="Nhập lại mật khẩu"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && <p className="error-text">{error}</p>}

          <div className="userRegister-button">
            <button type="submit">Đăng Ký</button>
            <span>
              Đã có tài khoản? <Link to={`/userLogin`}>Đăng Nhập</Link>
            </span>
          </div>
        </form>
      </div>
    </>
  );
}
export default Register;
