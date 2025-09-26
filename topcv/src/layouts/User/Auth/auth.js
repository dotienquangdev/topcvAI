import { NavLink, Outlet } from "react-router-dom";
import "./auth.css";

function Auth() {
  return (
    <div className="account">
      <div className="authContainer">
        {/* Cột trái: Logo + slogan */}
        <div className="authLeft">
          <img
            src="https://static.topcv.vn/v4/image/auth/topcv_white.png"
            alt="topcv"
            className="authLogo"
          />
          <h3>Tiếp lợi thế</h3>
          <h3>Nối thành công</h3>
          <p>
            TopCV - Hệ sinh thái nhân sự tiên phong ứng dụng công nghệ tại Việt
            Nam
          </p>
          <NavLink className="authBtn" to={`/`}>
            CV tìm kiếm
          </NavLink>
        </div>

        {/* Cột phải: Form (Login/Register) */}
        <div className="authRight">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Auth;
