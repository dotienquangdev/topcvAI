import { createCompanies } from "../../../services/companies";
import { getCategories } from "../../../services/categories";
import { useState } from "react";
import {
  createJobs,
  deleteJobById,
  updateJob,
  addJobs,
} from "../../../services/jobs";

function NewAddJobs() {
  const [addJobs, setAddJobs] = useState(null);
  const [editingJob, setEditingJob] = useState(null); // job đang sửa

  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newJobs, setNewJobs] = useState({
    category_id: "",
    company_id: "",
    formWork: "",
    experience_level: "",
    workExperience: "",
    title: "",
    description: "",
    location: "",
    requirements: "",
    salary_min: "",
    salary_max: "",
    job_benefits: "",
    deadline: "",
    status: "active",
    outstanding: "",
    created_at: new Date(),
    updated_at: new Date(),
    deleted: false,
  });

  const handleAddJobs = async () => {
    try {
      const result = await addJobs(newJobs);
      console.log(result);
      if (result) {
        setShowAddModal(false);
        setNewJobs({
          category_id: "",
          company_id: "",
          formWork: "",
          experience_level: "",
          workExperience: "",
          title: "",
          description: "",
          location: "",
          requirements: "",
          salary_min: "",
          salary_max: "",
          job_benefits: "",
          deadline: "",
          status: "active",
          outstanding: "",
          created_at: new Date(),
          updated_at: new Date(),
          deleted: false,
        });
        const updatedJobs = await createJobs();
        setNewJobs(updateJob);
        console.log(updateJob);
      } else {
        console.error("Them that bai");
      }
    } catch (error) {
      console.error("Lỗi thêm jobs:", error);
    }
  };
  return (
    <>
      {/* Add 1 */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h5>Thêm bài hát mới</h5>

            <form>
              <label>Tiêu đề:</label>
              <input
                type="text"
                onChange={(e) =>
                  setEditingJob({ ...editingJob, title: e.target.value })
                }
              />

              <label>Companys Name:</label>
              <select
                value={newJobs.company_id._id}
                onChange={(e) =>
                  setNewJobs({ ...newJobs, company_id: e.target.value })
                }
              >
                <option value="">-- Chọn công ty --</option>
                {companies.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.name}
                  </option>
                ))}
              </select>

              <label>Logo URL:</label>
              <input
                className="logoURLadd"
                type="text"
                onChange={(e) =>
                  setEditingJob({
                    ...editingJob,
                    company_id: {
                      ...editingJob.company_id,
                      logo_url: e.target.value,
                    },
                  })
                }
              />
              <label>Location:</label>
              <input
                type="text"
                onChange={(e) =>
                  setEditingJob({
                    ...editingJob,
                    company_id: {
                      ...editingJob.company_id,
                      location: e.target.value,
                    },
                  })
                }
              />
              <label>Size:</label>
              <input
                type="text"
                onChange={(e) =>
                  setEditingJob({
                    ...editingJob,
                    company_id: {
                      ...editingJob.company_id,
                      size: e.target.value,
                    },
                  })
                }
              />
              <label>requirements:</label>
              <input
                type="text"
                onChange={(e) =>
                  setEditingJob({ ...editingJob, requirements: e.target.value })
                }
              />
              <label>Job Type:</label>
              <input
                type="text"
                onChange={(e) =>
                  setEditingJob({ ...editingJob, job_type: e.target.value })
                }
              />
              <label>experience_level:</label>
              <input
                type="text"
                onChange={(e) =>
                  setEditingJob({
                    ...editingJob,
                    experience_level: e.target.value,
                  })
                }
              />
              <label>Categories Name:</label>
              <select
                value={newJobs.category_id}
                onChange={(e) =>
                  setNewJobs({ ...newJobs, category_id: e.target.value })
                }
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <label>Lương tối thiểu:</label>
              <input
                type="number"
                onChange={(e) =>
                  setEditingJob({
                    ...editingJob,
                    salary_min: Number(e.target.value),
                  })
                }
              />
              <label>Lương tối đa:</label>
              <input
                type="number"
                onChange={(e) =>
                  setEditingJob({
                    ...editingJob,
                    salary_max: Number(e.target.value),
                  })
                }
              />
            </form>
            <input
              id="title"
              type="text"
              placeholder="title"
              value={newJobs.title}
              onChange={(e) =>
                setNewJobs({ ...newJobs, title: e.target.value })
              }
            />
            <input
              id="requirements"
              type="text"
              placeholder="requirements"
              value={newJobs.requirements}
              onChange={(e) =>
                setNewJobs({ ...newJobs, requirements: e.target.value })
              }
            />
            <input
              id="salary_min"
              type="number"
              placeholder="salary_min"
              value={newJobs.salary_min}
              onChange={(e) =>
                setNewJobs({ ...newJobs, salary_min: e.target.value })
              }
            />
            <input
              id="salary_max"
              type="number"
              placeholder="salary_max"
              value={newJobs.salary_max}
              onChange={(e) =>
                setNewJobs({ ...newJobs, salary_max: e.target.value })
              }
            />

            <input
              id="job_type"
              type="text"
              placeholder="job_type"
              value={newJobs.job_type}
              onChange={(e) =>
                setNewJobs({ ...newJobs, job_type: e.target.value })
              }
            />
            <input
              id="location"
              type="text"
              placeholder="location"
              value={newJobs.location}
              onChange={(e) =>
                setNewJobs({ ...newJobs, location: e.target.value })
              }
            />
            <input
              id="company_id"
              type="text"
              placeholder="company_id"
              value={newJobs.company_id}
              onChange={(e) =>
                setNewJobs({ ...newJobs, company_id: e.target.value })
              }
            />
            <input
              id="category_id"
              type="text"
              placeholder="category_id"
              value={newJobs.category_id}
              onChange={(e) =>
                setNewJobs({ ...newJobs, category_id: e.target.value })
              }
            />

            <div className="modal-buttons">
              <button onClick={handleAddJobs}>Thêm mới12</button>
              <button onClick={() => setShowAddModal(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NewAddJobs;
