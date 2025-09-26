import { Outlet } from "react-router-dom";
import Footer from "../footer/footer";
import Header from "../Header/header";
import "./admin.css";

function Admin() {
  return (
    <>
      <Header />
      <div className="admin-wrapper">
        <aside className="admin-sidebar">
          <ul className="sidebar-menu">
            <a href="/admin">
              <li className="sidebar-item">📄 Tổng quan</li>
            </a>
            <a href="/admin/jobs">
              <li className="sidebar-item">📄 Jobs</li>
            </a>
            <a href="/admin/companies">
              <li className="sidebar-item">🏢 Companies</li>
            </a>
            <a href="/admin/categories">
              <li className="sidebar-item">📁 Categories</li>
            </a>
            <a href="/admin/user">
              <li className="sidebar-item">👤 Users</li>
            </a>
            <a href="/admin/report">
              <li className="sidebar-item">📊 Reports</li>
            </a>

            {/* ////////////////////////////////// */}
            <a href="/admin/report1">
              <li className="sidebar-item">📊 Đồ thị</li>
              {/* Đồ thị Doanh thu bài viết
              Đồ thị Doangh thu gói xem ứng viên */}
            </a>
            <a href="/admin/report2">
              <li className="sidebar-item">📊 Quản lý User</li>
              {/* Danh sách người dùng(sửa , chặn)
              Thêmm người dùng */}
            </a>
            <a href="/admin/report3">
              <li className="sidebar-item">📊 Quản lý loại công việc</li>
              {/* Danh sách loại công việc(Name, mã code(slug), hình ảnh, thao tác, sửa xóa)
              Thêm loại công việc */}
            </a>
            <a href="/admin/report4">
              <li className="sidebar-item">📊 Quản lý kỹ năng</li>
              {/* Danh sác kỹ năng(Công nghệ thông tin :ReactJS,NodeJs, C++,Giáo Viên:Lý, Hóa Toán,) Thêm sửa xóa */}
            </a>
            <a href="/admin/report5">
              <li className="sidebar-item">📊 Quản lý cấp bậc</li>
              {/* Danh sách cấp bậc:Giám đốc,Nhân viên, Trưởng phòng */}
            </a>
            <a href="/admin/report6">
              <li className="sidebar-item">📊 Quản lý hình thức làm việc</li>
              {/* Danh sách hình thức:Toàn thời gian, bán thời gian, Remote, Thực tập */}
            </a>
            <a href="/admin/report71">
              <li className="sidebar-item">📊 Quản lý Khoản lương</li>
              {/* Tên khoản lương, mã code  */}
            </a>
            <a href="/admin/report27">
              <li className="sidebar-item">📊 Quản lý kinh nghiệm việc làm</li>
              {/* tên kinh nghiệm việc làm: 1 năm,2 năm */}
            </a>
            <a href="/admin/report7">
              <li className="sidebar-item">📊 Quản lý các gói bài đăng</li>
              {/* Tên gói , giá trị (5 lượt đăng), Giá tiền, Loại(bình thường, nội bật), trạng thái, Thao tác(thêm sửa xóa) */}
            </a>
            <a href="/admin/report8">
              <li className="sidebar-item">📊 Quản lý các gói ứng viên</li>
              {/* Tên gói, Giá trị, Giá tiền, Trạngthasi, Thêm sửa xóa */}
            </a>
            <a href="/admin/report9">
              <li className="sidebar-item">📊 Quản lý các công ty</li>
              {/* mã cong ty, tên công ty, sdt, mã số thuế, trạng thái, kiểm duyển, ngyaf khởi tạo, Thao tác(Dừng kích hoạt, Xem chi tiết, Quay lại trạng thái chờ) */}
            </a>
            <a href="/admin/report6">
              <li className="sidebar-item">📊 Quản lý bài đăng</li>
              {/* Mã bài đăng, name, tên côpng ty, tên người đăng, ngày kết thúcm trạng thái, Thao tác(chú thích, xem chi tiếtm Duyệt, từ chối) */}
            </a>
          </ul>
        </aside>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
      <Footer />
    </>
  );
}

export default Admin;
