const routeUser = require("./routes.users");
const routeCompanies = require("./routes.companies");
const routeCandidate = require("./routes.candidate");
const routeJobs = require("./routes.jobs");
const routeCategories = require("./routes.categoriesJobs");
const routeResumes = require("./routes.resumes");
const routeEmployer = require("./routes.employer");
const routeJobView = require("./routes.job_views");
const routeUpload = require("./upload");
const routeApplications = require("./routes.JobApplications");
const routeVnpay = require("./routes.vnpay");

module.exports = (app) => {
  app.use("/api/companies", routeCompanies);
  app.use("/api/candidate", routeCandidate);
  app.use("/api/jobs", routeJobs);
  app.use("/api/resumes", routeResumes);
  app.use("/api/employers", routeEmployer);
  app.use("/api/categories", routeCategories);
  app.use("/api/uploads", routeUpload);
  app.use("/api/jobView", routeJobView);
  app.use("/api/user", routeUser);
  app.use("/api/jobApplication", routeApplications);
  app.use("/api/vnpay", routeVnpay);
};
