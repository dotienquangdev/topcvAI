import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./login.css";

import { useAuth } from "../../../helper/AuthContext";
import { loginUsers } from "../../../services/user";

function Login({ title }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { showSuccessMessage } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setEmailError("");
    setPasswordError("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let hasError = false;

    if (!email) {
      setEmailError("Vui lòng nhập email.");
      hasError = true;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Email không hợp lệ.");
      hasError = true;
    }
    if (!password) {
      setPasswordError("Vui lòng nhập mật khẩu.");
      hasError = true;
    }
    if (hasError) return;

    const result = await loginUsers({ email, password });

    if (result.success) {
      localStorage.setItem("user", JSON.stringify(result.user));
      showSuccessMessage("Đăng nhập thành công!");
      navigate("/");
    } else {
      if (result.message.includes("Email")) {
        setEmailError(result.message);
      } else if (result.message.includes("Mật khẩu")) {
        setPasswordError(result.message);
      } else {
        setEmailError(result.message);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <div className="loginPage">
        <div className="userLogin">
          <h1>Đăng Nhập</h1>
          <div className="userInput">
            <label>Email</label>
            <div className="inputWrapper">
              <i className="fa-solid fa-envelope"></i>
              <input
                type="text"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {emailError && <p className="errorMsg">{emailError}</p>}

            <label>Mật khẩu</label>
            <div className="inputWrapper">
              <i className="fa-solid fa-lock"></i>
              <input
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {passwordError && <p className="errorMsg">{passwordError}</p>}
          </div>

          <div className="userButton">
            <button onClick={handleLogin}>Đăng Nhập</button>
            <span className="links">
              <Link to={`/userForgotPassword`}>Quên mật khẩu</Link>
              <Link to={`/userRegister`}>Đăng ký tài khoản</Link>
              <Link to={`/companyRegistration`}>Đăng ký công ty</Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
