import { useParams } from "react-router-dom";
import "./companiesItem.css";
import { useEffect, useState } from "react";
import { createCompaniesId } from "../../../services/companies";
import { Helmet } from "react-helmet-async";

function CompaniesItem({ title }) {
  const { id } = useParams();
  const [companies, setCompanies] = useState(null);

  useEffect(() => {
    const fetchCompaniesId = async () => {
      try {
        const dataCompaniesItem = await createCompaniesId(id);
        setCompanies(dataCompaniesItem.data);
        // console.log("dataCompaniesItem : ", dataCompaniesItem);
      } catch (error) {
        console.error("lỗi khi tải công ty", error);
      }
    };
    if (id) fetchCompaniesId();
  }, [id]);

  if (!companies) return <p className="loading">Đang tải dữ liệu...</p>;

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className="company-container">
        <h1 className="company-name">{companies.name}</h1>
        <img
          className="company-logo"
          src={companies.logo_url}
          alt={companies.name}
        />
        <p className="company-description">{companies.description}</p>
        <p className="company-website">
          <strong>Website:</strong> {companies.website}
        </p>
        <p className="company-location">
          <strong>Địa điểm:</strong> {companies.location}
        </p>
        <p className="company-size">
          <strong>Quy mô:</strong> {companies.size}
        </p>
        <p className="company-founded">
          <strong>Năm thành lập:</strong> {companies.founded_year}
        </p>
        <p className="company-created">
          <strong>Ngày tạo:</strong> {companies.created_at}
        </p>
      </div>
    </>
  );
}
export default CompaniesItem;
