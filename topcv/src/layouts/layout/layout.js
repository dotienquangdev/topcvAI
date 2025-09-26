import "./layout.css";
import Header from "../Header/header";
import Footer from "../footer/footer";
// import Main from "../main";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="layout-container">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default Layout;
