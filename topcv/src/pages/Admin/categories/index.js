import { Helmet } from "react-helmet-async";
import "./categories.css";
import { useEffect, useState } from "react";
import {
  deleteCategoriesId,
  getCategories,
  updateCategories,
  createCategories, // thêm API create
} from "../../../services/categories";
import NotificationBox from "../../../Notification/admin/Notification";

function CategoriesAdmin({ title }) {
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notif, setNotif] = useState({ show: false, type: "", content: "" });

  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [viewingCategory, setViewingCategory] = useState(null);

  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategories, setNewCategories] = useState({
    name: "",
    slug: "",
    status: "active",
    deleted: false,
    created_at: new Date(),
  });

  const showNotification = (content, type = "success") => {
    setNotif({ show: true, type, content });
    setTimeout(() => setNotif({ show: false, type: "", content: "" }), 3000);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getCategories(page);
        setCategories(data.docs || []);
        setTotalPages(data.totalPages || 1);
        if (data.limit) setPageSize(data.limit);
      } catch (err) {
        console.error("Lỗi khi tải categories:", err);
        setError("Không thể tải danh sách.");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [page]);

  const handleViewDetails = (category) => {
    setViewingCategory(category);
    setShowDetailPopup(true);
  };

  const handleEdit = (category) => {
    setEditCategory(category);
    setShowEditPopup(true);
    setShowDetailPopup(false); // đóng chi tiết khi mở sửa
  };

  const handleUpdate = async () => {
    try {
      await updateCategories(editCategory._id, editCategory);
      setShowEditPopup(false);
      const data = await getCategories(page);
      setCategories(data.docs || []);
      setTotalPages(data.totalPages);
      showNotification("Đã sửa danh mục thành công!", "warning");
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục", error);
    }
  };

  const handleDelete = async (categoryId) => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa không?");
    if (!confirmed) return;
    try {
      await deleteCategoriesId(categoryId);
      const data = await getCategories(page);
      setCategories(data.docs || []);
      setTotalPages(data.totalPages);
      showNotification("Đã xóa danh mục thành công!", "error");
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
    }
  };

  const handleAddCategories = async () => {
    try {
      await createCategories(newCategories);
      setShowAddModal(false);
      setNewCategories({
        name: "",
        slug: "",
        status: "active",
        deleted: false,
        created_at: new Date(),
      });
      const data = await getCategories(page);
      setCategories(data.docs || []);
      setTotalPages(data.totalPages);

      showNotification("Đã thêm danh mục mới!", "success");
    } catch (error) {
      console.error("Lỗi khi thêm danh mục:", error);
    }
  };

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
      <button onClick={() => setShowAddModal(true)}>Thêm mới</button>

      <div className="categoriesAdmin">
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : categories.length === 0 ? (
          <p>Không có danh mục nào.</p>
        ) : (
          categories.map((category, index) => (
            <div
              key={category._id || index}
              className="categoriesAdmin-item item"
            >
              <p className="item-stt">
                STT: {(page - 1) * pageSize + index + 1}
              </p>
              <p className="item-title">{category.name}</p>
              <p className="item-title">{category.status}</p>
              {/* <p className="item-title">{category.deleted}</p> */}
              <div className="btn-item">
                <button onClick={() => handleViewDetails(category)}>
                  Chi tiết
                </button>
                <button onClick={() => handleEdit(category)}>Sửa</button>
                <button onClick={() => handleDelete(category._id)}>Xóa</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Popup chi tiết */}
      {showDetailPopup && viewingCategory && (
        <div
          className="detail-overlay"
          onClick={() => setShowDetailPopup(false)}
        >
          <div className="detail-popup" onClick={(e) => e.stopPropagation()}>
            <h2>Chi tiết nhóm nghề</h2>
            <p>
              <strong>Tên nhóm nghề:</strong> {viewingCategory.name}
            </p>
            <p>
              <strong>Mô tả:</strong> {viewingCategory.slug}
            </p>
            <div className="popup-actions">
              <button onClick={() => handleEdit(viewingCategory)}>Sửa</button>
              <button onClick={() => setShowDetailPopup(false)}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* Popup sửa */}
      {showEditPopup && editCategory && (
        <div className="edit-overlay">
          <div className="edit-popup">
            <h2>Chỉnh sửa danh mục</h2>
            <form>
              <div className="companies-item">
                <label>Tên</label>
                <input
                  type="text"
                  value={editCategory.name}
                  onChange={(e) =>
                    setEditCategory({ ...editCategory, name: e.target.value })
                  }
                />
              </div>
              <div className="companies-item">
                <label>Slug</label>
                <input
                  type="text"
                  value={editCategory.slug}
                  onChange={(e) =>
                    setEditCategory({ ...editCategory, slug: e.target.value })
                  }
                />
              </div>
            </form>
            <div className="popup-actions">
              <button onClick={() => setShowEditPopup(false)}>Đóng</button>
              <button onClick={handleUpdate}>Lưu</button>
            </div>
          </div>
        </div>
      )}

      {/* Popup thêm mới */}
      {showAddModal && (
        <div className="edit-overlay">
          <div className="edit-popup">
            <h2>Thêm danh mục mới</h2>
            <form>
              <div className="companies-item">
                <label>Tên</label>
                <input
                  type="text"
                  value={newCategories.name}
                  onChange={(e) =>
                    setNewCategories({ ...newCategories, name: e.target.value })
                  }
                />
              </div>
              <div className="companies-item">
                <label>Slug</label>
                <input
                  type="text"
                  value={newCategories.slug}
                  onChange={(e) =>
                    setNewCategories({ ...newCategories, slug: e.target.value })
                  }
                />
              </div>
            </form>
            <div className="popup-actions">
              <button onClick={() => setShowAddModal(false)}>Đóng</button>
              <button onClick={handleAddCategories}>Thêm</button>
            </div>
          </div>
        </div>
      )}

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

export default CategoriesAdmin;
