import React, { useState, useEffect } from "react";
import "./style.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const AllMovies = () => {
  const [allMovies, setAllMovies] = useState([]);
  const [visibleCount, setVisibleCount] = useState(15);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy params từ URL
  const params = new URLSearchParams(location.search);
  const genreParam = params.get("theloai");
  const countryParam = params.get("quocgia");

  // Lấy dữ liệu từ API
  useEffect(() => {
    axios
      .get("https://68faff8894ec96066024411b.mockapi.io/movies")
      .then((res) => {
        setAllMovies(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Lỗi tải dữ liệu");
        setLoading(false);
      });
  }, []);

  // --- DYNAMIC GENRES & COUNTRIES ---
  const genres = [...new Set(allMovies.flatMap((m) => m.genre.split(", ").map((g) => g.trim())))];
  const countries = [...new Set(allMovies.map((m) => m.country))];

  // Lọc phim
  let filteredMovies = allMovies;
  if (genreParam && genreParam !== "tat-ca") {
    filteredMovies = filteredMovies.filter((m) =>
      m.genre.split(",").map((g) => g.trim().toLowerCase()).includes(genreParam.toLowerCase())
    );
  }
  if (countryParam && countryParam !== "tat-ca") {
    filteredMovies = filteredMovies.filter(
      (m) => m.country.toLowerCase() === countryParam.toLowerCase()
    );
  }

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

  const handleSeeMore = () => setVisibleCount(filteredMovies.length);

  if (loading) return <div>Đang tải phim...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="all-movies-page">
      <div style={{ height: "100px" }}></div>
      <h2>🎬 Danh sách phim</h2>

      {/* Bộ lọc thể loại & quốc gia */}
      <div className="filter-wrapper">
        <div className="filter-section">
          <span className="filter-label">Thể loại:</span>
          <div className="filter-options">
            <button
              onClick={() => handleFilter("theloai", "tat-ca")}
              className={`filter-btn ${!genreParam ? "active" : ""}`}
            >
              Tất cả
            </button>
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => handleFilter("theloai", g)}
                className={`filter-btn ${
                  genreParam?.toLowerCase() === g.toLowerCase() ? "active" : ""
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <span className="filter-label">Quốc gia:</span>
          <div className="filter-options">
            <button
              onClick={() => handleFilter("quocgia", "tat-ca")}
              className={`filter-btn ${!countryParam ? "active" : ""}`}
            >
              Tất cả
            </button>
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => handleFilter("quocgia", c)}
                className={`filter-btn ${
                  countryParam?.toLowerCase() === c.toLowerCase() ? "active" : ""
                }`}
              >
                {c}
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
