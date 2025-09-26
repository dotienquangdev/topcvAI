import { Outlet } from "react-router-dom";
import Footer from "../footer/footer";
import Header from "../Header/header";
import "./employer.css";

function Employer() {
  return (
    <>
      <Header />
      <div className="employer-wrapper">
        <aside className="employer-sidebar">
          <ul className="sidebar-menu">
            <a href="/employer">
              <li className="sidebar-item">📄 Trang chủ</li>
              {/* 
              Quản lý công ty, 
              tuyển dụng vào công ty
              Danh sách nhân viên(Ho Tên , Sdt , Giới tính, ngày sinh, Quyền, Trang thái,Thao tác)
              thêm nhân viên
              
              */}
            </a>
            <a href="/employer/jobs">
              <li className="sidebar-item">📄 Quản lý bài đăng</li>
            </a>
            <a href="/employer/companies">
              <li className="sidebar-item">🏢 Tìm kiếm ứng viên</li>
            </a>
            <a href="/employer/categories">
              <li className="sidebar-item">📁 Lịch sử giao dịch</li>
            </a>
          </ul>
        </aside>
        <main className="employer-content">
          <Outlet />
        </main>
      </div>
      <Footer />
    </>
  );
}

export default Employer;
