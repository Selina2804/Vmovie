import React, { useState } from "react";
import "./style.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useMovies } from "../../context/MovieContext";

// Danh mục thể loại (khớp với dữ liệu)
const categories = [
  { label: "Tất cả", value: "tat-ca" },
  { label: "Anime", value: "anime" },
  { label: "Hành Động", value: "hành động" },
  { label: "Siêu Nhiên", value: "siêu nhiên" },
  { label: "Phiêu Lưu", value: "phiêu lưu" },
  { label: "Hài Hước", value: "hài hước" },
  { label: "Viễn Tưởng", value: "viễn tưởng" },
];

// Quốc gia (khớp dữ liệu JSON)
const countries = [
  { label: "Tất cả", value: "tat-ca" },
  { label: "Nhật Bản", value: "nhật bản" },
  { label: "Mỹ", value: "mỹ" },
  { label: "Trung Quốc", value: "trung quốc" },
  { label: "Việt Nam", value: "việt nam" },
];

const AllMovies = () => {
  const { allMovies } = useMovies();
  const location = useLocation();
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(15);

  // Lấy params từ URL
  const params = new URLSearchParams(location.search);
  const genre = params.get("theloai");
  const country = params.get("quocgia");

  // Lọc phim theo thể loại và quốc gia
  let filteredMovies = allMovies;

  // ✅ Lọc thể loại: tách genre thành mảng
  if (genre && genre !== "tat-ca") {
    filteredMovies = filteredMovies.filter((m) => {
      const genres = m.genre?.toLowerCase().split(",").map((g) => g.trim());
      return genres?.includes(genre.toLowerCase());
    });
  }

  // ✅ Lọc quốc gia
  if (country && country !== "tat-ca") {
    filteredMovies = filteredMovies.filter(
      (m) => m.country?.toLowerCase() === country.toLowerCase()
    );
  }

  // ✅ Xử lý click filter
  const handleFilter = (type: "theloai" | "quocgia", value: string) => {
    const newParams = new URLSearchParams(location.search);

    if (type === "theloai") {
      if (value === "tat-ca") newParams.delete("theloai");
      else newParams.set("theloai", value);
    }

    if (type === "quocgia") {
      if (value === "tat-ca") newParams.delete("quocgia");
      else newParams.set("quocgia", value);
    }

    navigate(`/danh-sach?${newParams.toString()}`);
  };

  const handleSeeMore = () => {
    setVisibleCount(filteredMovies.length);
  };

  return (
    <div className="all-movies-page">
      <div style={{ height: "100px" }}></div>
      <h2>🎬 Danh sách phim</h2>

      {/* Bộ lọc thể loại & quốc gia */}
      <div className="filter-wrapper">
        {/* Thể loại */}
        <div className="filter-section">
          <span className="filter-label">Thể loại:</span>
          <div className="filter-options">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleFilter("theloai", cat.value)}
                className={`filter-btn ${
                  genre === cat.value ? "active" : ""
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quốc gia */}
        <div className="filter-section">
          <span className="filter-label">Quốc gia:</span>
          <div className="filter-options">
            {countries.map((c) => (
              <button
                key={c.value}
                onClick={() => handleFilter("quocgia", c.value)}
                className={`filter-btn ${
                  country === c.value ? "active" : ""
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Danh sách phim */}
      <div className="movie-grid">
        {filteredMovies.length > 0 ? (
          filteredMovies.slice(0, visibleCount).map((movie) => (
            <div
              key={movie.id}
              className="movie-card"
              onClick={() => navigate(`/thong-tin/${movie.id}`)}
            >
              <img src={movie.image} alt={movie.title} />
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>{movie.engTitle}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">Không tìm thấy phim phù hợp.</p>
        )}
      </div>

      {/* Nút xem thêm */}
      {visibleCount < filteredMovies.length && (
        <div className="see-more-container">
          <button className="see-more-btn" onClick={handleSeeMore}>
            Xem thêm
          </button>
        </div>
      )}
    </div>
  );
};

export default AllMovies;
