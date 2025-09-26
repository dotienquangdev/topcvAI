const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const dotenv = require("dotenv");
const http = require("http"); // Đúng module HTTP
const database = require("./config/database");
const route = require("./routes/routes.index");
const cors = require("cors");
const path = require("path");
// Load biến môi trường từ .env
dotenv.config();
// Khởi tạo app
const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = ["http://localhost:3002"];

// Cấu hình session & flash
app.use(
  session({
    secret: "yourSecretKey",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());
// Middleware gán flash message vào res.locals
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Kết nối database
database.connect();

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Cho phép truy cập folder uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ... routes ở dưới
const companyRoutes = require("./routes/routes.companies");
app.use("/api/companies", companyRoutes);
// Các

// Routes
route(app);

// Cấu hình view engine (nếu dùng)
app.set("view engine", "ejs");
app.set("views", "./views");

// Khởi động server
const port = process.env.PORT || 9000;
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
