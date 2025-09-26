const mongoose = require("mongoose");

const jobCategoriesSchema = new mongoose.Schema({
  name: String, // tên ngành nghề
  slug: String, // Slug
  skills: [
    {
      name: String, // tên kỹ năng
      slug: String, // slug kỹ năng
      status: {
        type: String,
        default: "active",
      },
      deleted: {
        type: Boolean,
        default: false,
      },
      created_at: {
        type: Date,
        default: Date.now,
      },
      updated_at: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  status: {
    type: String,
    default: "active",
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const JobCategories = mongoose.model(
  "JobCategories",
  jobCategoriesSchema,
  "job_categories"
);

module.exports = JobCategories;
