import "./companie.css";
import { useEffect, useState } from "react";
import { createCompanies } from "../../../services/companies";
import Companie from "../../../pages/companies/companies";

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // ✅ thêm state
  const limit = 12;
  useEffect(() => {
    const fetchData = async () => {
      const data = await createCompanies(page, limit);
      // console.log("data:", data);
      if (data && Array.isArray(data.docs)) {
        setCompanies(data.docs); // ✅ lấy đúng mảng công ty
        setTotalPages(data.totalPages); // ✅ lưu số trang từ backend
        setError(null);
      } else {
        setCompanies([]);
        setError("Không có dữ liệu công ty !");
      }
    };
    fetchData();
  }, [page]);
  return (
    <>
      {error && <p>{error}</p>}

      <h2>Việc làm tốt nhất</h2>
      <ul className="companies">
        {companies.length > 0 ? (
          companies.map((companie) => (
            <Companie key={companie._id} item={companie} />
          ))
        ) : (
          <h2>Không có dữ liệu công ty !</h2>
        )}
      </ul>

      {/* ✅ Nút phân trang chính xác theo tổng số trang */}
      <div className="pagination">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <span>
          Trang {page} / {totalPages}
        </span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
          <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </>
  );
}

export default Companies;
