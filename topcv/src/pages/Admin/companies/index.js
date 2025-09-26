import { Helmet } from "react-helmet-async";
import "./companies.css";
import "./companiesView.css";
import { useEffect, useState } from "react";
import {
  createCompanies,
  deleteCompanyId,
  postCompanies,
  updateCompanies,
} from "../../../services/companies";
import NotificationBox from "../../../Notification/admin/Notification";

function CompaniesAdmin({ title }) {
  const [notif, setNotif] = useState({ show: false, type: "", content: "" });
  const [page, setPage] = useState(1);
  const [companies, setCompanies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const [viewingCompany, setViewingCompany] = useState(null);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [editCompany, setEditCompany] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompanies, setNewCompanies] = useState({
    user_id: "",
    name: "",
    logo_url: "",
    description: "",
    website: "",
    location: "",
    size: "",
    founded_year: "",
    status: "active",
    deleted: false,
    created_at: new Date(),
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await createCompanies(page);
        if (typeof data !== "object" || !data.docs) {
          console.error("API trả dữ liệu không hợp lệ:", data);
          setCompanies([]);
          return;
        }
        setCompanies(data.docs || []);
        setTotalPages(data.totalPages || 1);
        if (data.limit) setPageSize(data.limit);
      } catch (error) {
        console.error("Lỗi khi tải companies:", error);
        setCompanies([]);
      }
    };
    fetchCompanies();
  }, [page]);

  const showNotification = (content, type = "success") => {
    setNotif({ show: true, type, content });
    setTimeout(() => setNotif({ show: false, type: "", content: "" }), 3000);
  };

  const handleViewDetails = (company) => {
    setViewingCompany(company);
    setShowDetailPopup(true);
  };

  const handleEdit = (company) => {
    setEditCompany(company);
    setShowEditPopup(true);
    handleViewDetails(false);
  };

  const handleUpdate = async () => {
    try {
      await updateCompanies(editCompany._id, editCompany);
      setShowEditPopup(false);
      const data = await createCompanies(page);
      setCompanies(data.docs || []);
      setTotalPages(data.totalPages);
      showNotification("Đã sửa công ty thành công!", "warning");
    } catch (error) {
      console.error("Lỗi khi cập nhật công ty", error);
    }
  };

  const handleDelete = async (companyId) => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa không?");
    if (!confirmed) return;
    try {
      await deleteCompanyId(companyId);
      const data = await createCompanies(page);
      setCompanies(data.docs || []);
      setTotalPages(data.totalPages);
      showNotification("Đã xóa công ty thành công!", "error");
    } catch (error) {
      console.error("Lỗi khi xóa công ty:", error);
    }
  };

  const handleAddCompanies = async () => {
    try {
      await postCompanies(newCompanies);
      setShowAddModal(false);
      setNewCompanies({
        user_id: "",
        name: "",
        logo_url: "",
        description: "",
        website: "",
        location: "",
        size: "",
        founded_year: "",
        status: "active",
        deleted: false,
        created_at: new Date(),
      });
      const data = await createCompanies(page);
      setCompanies(data.docs || []);
      setTotalPages(data.totalPages);
      showNotification("Đã thêm công ty mới!", "success");
    } catch (error) {
      console.error("Lỗi khi thêm công ty:", error);
      showNotification("Thêm công ty thất bại!", "error");
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

      <button className="btn-add" onClick={() => setShowAddModal(true)}>
        + Thêm mới
      </button>

      {/* Modal thêm mới */}
      {showAddModal && (
        <div className="edit-overlay">
          <div className="edit-popup">
            <h2>Thêm Công Ty Mới</h2>
            <form>
              <div className="companies-item">
                <label>Tên công ty</label>
                <input
                  type="text"
                  value={newCompanies.name}
                  onChange={(e) =>
                    setNewCompanies({ ...newCompanies, name: e.target.value })
                  }
                />
              </div>
              <div className="companies-item">
                <label>Logo</label>
                <input
                  type="text"
                  value={newCompanies.logo_url}
                  onChange={(e) =>
                    setNewCompanies({
                      ...newCompanies,
                      logo_url: e.target.value,
                    })
                  }
                />
              </div>
              <div className="companies-item">
                <label>Mô tả</label>
                <input
                  type="text"
                  value={newCompanies.description}
                  onChange={(e) =>
                    setNewCompanies({
                      ...newCompanies,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="companies-item">
                <label>Website</label>
                <input
                  type="text"
                  value={newCompanies.website}
                  onChange={(e) =>
                    setNewCompanies({
                      ...newCompanies,
                      website: e.target.value,
                    })
                  }
                />
              </div>
              <div className="companies-item">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  value={newCompanies.location}
                  onChange={(e) =>
                    setNewCompanies({
                      ...newCompanies,
                      location: e.target.value,
                    })
                  }
                />
              </div>
              <div className="companies-item">
                <label>Số lượng</label>
                <input
                  type="text"
                  value={newCompanies.size}
                  onChange={(e) =>
                    setNewCompanies({
                      ...newCompanies,
                      size: e.target.value,
                    })
                  }
                />
              </div>
              <div className="companies-item">
                <label>Năm thành lập</label>
                <input
                  type="text"
                  value={newCompanies.founded_year}
                  onChange={(e) =>
                    setNewCompanies({
                      ...newCompanies,
                      founded_year: e.target.value,
                    })
                  }
                />
              </div>
            </form>
            <div className="popup-actions">
              <button onClick={() => setShowAddModal(false)}>Hủy</button>
              <button onClick={handleAddCompanies}>Thêm</button>
            </div>
          </div>
        </div>
      )}

      <div className="companiesAdmin">
        {companies.map((company, index) => (
          <div key={company._id} className="companiesAdmin-item item">
            <p>STT: {(page - 1) * pageSize + index + 1}</p>
            <img
              className="companiesAdmin-img item"
              src={company.logo_url}
              alt={company.name}
            />
            <p className="item item-title">{company.name}</p>
            <p className="item item-title">{company.status}</p>
            {/* <p className="item item-title">{company.deleted}</p> */}
            <div className="item btn-item">
              <button onClick={() => handleViewDetails(company)}>
                Chi tiết
              </button>
              <button onClick={() => handleEdit(company)}>Sửa</button>
              <button onClick={() => handleDelete(company._id)}>Xóa</button>
            </div>
          </div>
        ))}
      </div>

      {/* Sửa công ty */}
      {showEditPopup && editCompany && (
        <div className="edit-overlay">
          <div className="edit-popup">
            <h2>Chỉnh sửa công việc</h2>
            <form>
              <div className="companies-item">
                <label>Tiêu đề</label>
                <input
                  type="text"
                  value={editCompany.name}
                  onChange={(e) => {
                    setEditCompany({ ...editCompany, name: e.target.value });
                  }}
                />
              </div>
              <div className="companies-item">
                <label>Logo</label>
                <input
                  type="text"
                  value={editCompany.logo_url}
                  onChange={(e) => {
                    setEditCompany({
                      ...editCompany,
                      logo_url: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="companies-item">
                <label>description</label>
                <input
                  type="text"
                  value={editCompany.description}
                  onChange={(e) => {
                    setEditCompany({
                      ...editCompany,
                      description: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="companies-item">
                <label>website</label>
                <input
                  type="text"
                  value={editCompany.website}
                  onChange={(e) => {
                    setEditCompany({ ...editCompany, website: e.target.value });
                  }}
                />
              </div>
              <div className="companies-item">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  value={editCompany.location}
                  onChange={(e) => {
                    setEditCompany({
                      ...editCompany,
                      location: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="companies-item">
                <label>Số lượng</label>
                <input
                  type="text"
                  value={editCompany.size}
                  onChange={(e) => {
                    setEditCompany({ ...editCompany, size: e.target.value });
                  }}
                />
              </div>
              <div className="companies-item">
                <label>Năm thành lập</label>
                <input
                  type="text"
                  value={editCompany.founded_year}
                  onChange={(e) => {
                    setEditCompany({
                      ...editCompany,
                      founded_year: e.target.value,
                    });
                  }}
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

      {/* Chi tiết công ty */}
      {showDetailPopup && viewingCompany && (
        <div
          className="detail-overlay"
          onClick={() => setShowDetailPopup(false)}
        >
          <div className="detail-popup" onClick={(e) => e.stopPropagation()}>
            <h2>Chi tiết Công Ty</h2>
            <div className="popup-detail">
              <p>
                <strong>Tên công ty:</strong> {viewingCompany.name}
              </p>
              <p>
                <strong>Logo:</strong>{" "}
                <img src={viewingCompany.logo_url} alt={viewingCompany.name} />
              </p>
              <p>
                <strong>Mô tả:</strong> {viewingCompany.description}
              </p>
              <p>
                <strong>Website:</strong>{" "}
                <a
                  href={viewingCompany.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  {viewingCompany.website}
                </a>
              </p>
              <p>
                <strong>Địa chỉ:</strong> {viewingCompany.location}
              </p>
              <p>
                <strong>Số lượng nhân viên:</strong> {viewingCompany.size}
              </p>
              <p>
                <strong>Năm thành lập:</strong> {viewingCompany.founded_year}
              </p>
            </div>
            <div className="popup-actions">
              <button onClick={() => handleEdit(viewingCompany)}>Sửa</button>
              <button onClick={() => setShowDetailPopup(false)}>Đóng</button>
            </div>
          </div>
        </div>
      )}

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
    </>
  );
}

export default CompaniesAdmin;
