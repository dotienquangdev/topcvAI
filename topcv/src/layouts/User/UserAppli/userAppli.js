import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { listJobApplication } from "../../../services/jobApplication";
import "./userApply.css";
function UserApply({ title }) {
  const { id } = useParams();
  const [jobApply, setJobApply] = useState(null);

  useEffect(() => {
    const fetchUserApply = async () => {
      try {
        const res = await listJobApplication(id);
        if (res.success && res.data.length > 0) {
          setJobApply(res.data[0]); // lấy 1 job theo ID
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu ứng tuyển:", error);
      }
    };
    if (id) fetchUserApply();
  }, [id]);

  if (!jobApply) return <p className="text-center p-4">Đang tải dữ liệu...</p>;

  const { job_id, cv_file_url, cover_letter, viewed_at } = jobApply;
  const company = job_id.company_id;

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className="container mx-auto px-4 py-6">
        <button>
          <a href={`/`}>Quay lại</a>
        </button>
        {/* Thông tin công ty */}
        <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <img
              src={company.logo_url}
              alt={company.name}
              className="w-24 h-24 object-contain rounded-lg"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800">
                {company.name}
              </h2>
              <p className="text-gray-600">{company.description}</p>
              <div className="mt-2 text-sm text-gray-500 space-y-1">
                <p>🌍 {company.location}</p>
                <p>👥 Quy mô: {company.size} nhân sự</p>
                <p>📅 Thành lập: {company.founded_year}</p>
                <p>
                  🔗 Website:{" "}
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    {company.website}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Thông tin công việc */}
        <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {job_id.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <p>
              💼 Hình thức:{" "}
              <span className="font-medium">
                {job_id.formWork_id.formWorkName}
              </span>
            </p>
            <p>
              📂 Ngành nghề:{" "}
              <span className="font-medium">{job_id.category_id.name}</span>
            </p>
            <p>
              📈 Kinh nghiệm:{" "}
              <span className="font-medium">
                {job_id.workExperience_id.label}
              </span>
            </p>
            <p>
              🎯 Cấp bậc:{" "}
              <span className="font-medium">
                {job_id.experience_level_id.experienceName}
              </span>
            </p>
            <p>
              💰 Lương: {job_id.salary_min}tr - {job_id.salary_max}tr
            </p>
            <p>📍 Địa điểm: {job_id.location}</p>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold">Mô tả công việc</h4>
            <p className="text-gray-600 whitespace-pre-line">
              {job_id.description}
            </p>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold">Yêu cầu</h4>
            <p className="text-gray-600 whitespace-pre-line">
              {job_id.requirements}
            </p>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold">Quyền lợi</h4>
            <p className="text-gray-600 whitespace-pre-line">
              {job_id.job_benefits}
            </p>
          </div>
        </div>

        {/* Thông tin ứng tuyển */}
        <div className="bg-white rounded-2xl shadow-md p-4 md:p-6">
          <h3 className="text-lg font-semibold mb-3">Thông tin ứng tuyển</h3>
          <p>
            📝 Thư xin việc:{" "}
            <span className="italic text-gray-700">{cover_letter}</span>
          </p>
          <p className="mt-2">
            👁️ Đã xem lúc: {new Date(viewed_at).toLocaleString()}
          </p>
          {cv_file_url && (
            <a
              href={cv_file_url}
              target="_blank"
              rel="noreferrer"
              className="showCV inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
            >
              Xem CV
            </a>
          )}
        </div>
      </div>
    </>
  );
}

export default UserApply;
