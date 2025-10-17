import React from "react";
import "./style.css";

export default function Dashboard() {
  return (
    <section className="dashboard">
      <h2>Trang tổng quan 🎬</h2>
      <p>Chào mừng bạn đến với bảng điều khiển quản trị hệ thống Movie!</p>

      <div className="stats-row">
        <div className="stat-card" style={{ borderTopColor: "#4f46e5" }}>
          <div>
            <div className="stat-title">Tổng số phim</div>
            <div className="stat-value">128</div>
          </div>
          <div className="stat-icon" style={{ background: "#4f46e5" }}>
            🎥
          </div>
        </div>

        <div className="stat-card" style={{ borderTopColor: "#10b981" }}>
          <div>
            <div className="stat-title">Người dùng</div>
            <div className="stat-value">542</div>
          </div>
          <div className="stat-icon" style={{ background: "#10b981" }}>
            👥
          </div>
        </div>

        <div className="stat-card" style={{ borderTopColor: "#f59e0b" }}>
          <div>
            <div className="stat-title">Đang chiếu</div>
            <div className="stat-value">23</div>
          </div>
          <div className="stat-icon" style={{ background: "#f59e0b" }}>
            🍿
          </div>
        </div>

        <div className="stat-card" style={{ borderTopColor: "#ef4444" }}>
          <div>
            <div className="stat-title">Đánh giá</div>
            <div className="stat-value">4.8⭐</div>
          </div>
          <div className="stat-icon" style={{ background: "#ef4444" }}>
            ❤️
          </div>
        </div>
      </div>
    </section>
  );
}
