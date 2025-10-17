import React, { useState } from "react";
import "./style.css";
import logo from "../../assets/anime.jpg";
import { useNavigate } from "react-router-dom";
import { PiBellFill } from "react-icons/pi";
import { FaGear } from "react-icons/fa6";
import Dashboard from "./Dashboard";
import MovieManager from "./Movie";
import AccountManager from "./Account";

/* ================= SIDEBAR ================= */
function Sidebar({ onMenuChange, active }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất không?")) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <aside className="admin-sidenav">
      <div className="sidenav-header">
        <img src={logo} alt="logo" className="sidenav-logo" />
        <h2 className="sidenav-title">
          Movie<span>Admin</span>
        </h2>
      </div>

      <nav className="sidenav-menu">
        <a
          className={active === "dashboard" ? "active" : ""}
          onClick={() => onMenuChange("dashboard")}
        >
          🏠 Dashboard
        </a>
        <a
          className={active === "movies" ? "active" : ""}
          onClick={() => onMenuChange("movies")}
        >
          🎬 Quản lý phim
        </a>
        <a
          className={active === "accounts" ? "active" : ""}
          onClick={() => onMenuChange("accounts")}
        >
          👤 Quản lý tài khoản
        </a>
      </nav>

      <div className="sidenav-footer">
        <p>Xin chào, Admin!</p>
        <button onClick={handleLogout} className="logout-btn">
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}

/* ================= NAVBAR ================= */
function Navbar({ title }) {
  return (
    <header className="admin-navbar">
      <div className="navbar-left">
        <h3>{title}</h3>
      </div>
      <div className="navbar-right">
        <input type="text" placeholder="Tìm kiếm..." className="search-input" />
        <button className="icon-btn">
          <PiBellFill />
        </button>
        <button className="icon-btn">
          <FaGear />
        </button>
        <img src={logo} alt="user" className="navbar-avatar" />
      </div>
    </header>
  );
}

/* ================= MAIN ADMIN ================= */
export default function AdminLayout() {
  const [activePage, setActivePage] = useState("dashboard");

  let pageTitle = "Dashboard";
  let PageContent = <Dashboard />;

  if (activePage === "movies") {
    pageTitle = "Quản lý phim";
    PageContent = <MovieManager />;
  } else if (activePage === "accounts") {
    pageTitle = "Quản lý tài khoản";
    PageContent = <AccountManager />;
  }

  return (
    <div className="admin-layout">
      <Sidebar onMenuChange={setActivePage} active={activePage} />
      <main className="admin-content">
        <Navbar title={pageTitle} />
        {PageContent}
        <footer className="admin-footer">
          © {new Date().getFullYear()} — Movie Admin Dashboard 🎬
        </footer>
      </main>
    </div>
  );
}
