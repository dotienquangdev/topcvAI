import { Helmet } from "react-helmet-async";
import "./user.css";
import { useEffect, useState } from "react";
import { getUser } from "../../../services/user"; // hàm fetch API

function UserAdmin({ title }) {
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getUser(page);
        setUsers(data.docs || []);
        setTotalPages(data.totalPages || 1);
        if (data.limit) setPageSize(data.limit);
        console.log("Fetched user:", data);
      } catch (err) {
        console.error("Lỗi khi tải user:", err);
        setError("Không thể tải danh sách.");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [page]);

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <div className="categoriesAdmin">
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : users.length === 0 ? (
          <p>Không có danh mục nào.</p>
        ) : (
          users.map((user, index) => (
            <div key={user._id || index} className="usersAdmin-item item">
              <p className="item-stt">
                STT: {(page - 1) * pageSize + index + 1}
              </p>
              <img
                className="user-img"
                src={user.avatar_url}
                alt={user.email}
              />
              <p className="item-title">{user.fullName}</p>
              <p className="item-title">{user.email}</p>
              <p className="item-title">{user.phone}</p>
              <div className="btn-item">
                <button>Chi tiết</button>
                <button>Sửa</button>
                <button>Xóa</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Phân trang */}
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
    </>
  );
}

export default UserAdmin;
