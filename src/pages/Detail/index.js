import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMovies } from "../../context/MovieContext";
import "./style.css";

const MovieDetail = () => {
  const { id } = useParams(); // lấy id từ URL (ví dụ /thong-tin/5)
  const navigate = useNavigate();
  const { allMovies } = useMovies();

  // Tìm phim tương ứng
  const movie = allMovies.find((m) => m.id === parseInt(id));

  // Nếu không có phim phù hợp
  if (!movie) {
    return (
      <div className="movie-detail-page" style={{ padding: "120px", color: "white" }}>
        <h2>Không tìm thấy phim.</h2>
      </div>
    );
  }

  return (
    <div className="movie-detail-page">
      {/* Khoảng trống để tránh header đè */}
      <div className="movie-detail-header-space"></div>

      <div className="movie-detail">
        {/* Poster phim */}
        <div className="movie-detail-poster">
          <img src={movie.image} alt={movie.title} />
          <button
            className="watch-button"
            onClick={() => navigate(`/xem-phim/${movie.id}`)}
          >
            🎬 Xem Phim
          </button>
        </div>

        {/* Thông tin phim */}
        <div className="movie-detail-info">
          <h1 className="movie-title">{movie.title}</h1>
          <p className="movie-eng-title">
            <em>{movie.engTitle}</em>
          </p>

          <div className="movie-meta">
            <p>
              <strong>Trạng thái:</strong> Tập 1 Vietsub
            </p>
            <p>
              <strong>Thời lượng:</strong> 45 phút/tập
            </p>
            <p>
              <strong>Thể loại:</strong>{" "}
              <span className="tag">Hành Động</span>{" "}
              <span className="tag">Phiêu Lưu</span>
            </p>
            <p>
              <strong>Đánh giá:</strong> ⭐⭐⭐⭐☆ (8.7/10)
            </p>
          </div>
        </div>
      </div>

      {/* Mô tả phim */}
      <div className="movie-detail-description">
        <h2>Nội dung chi tiết</h2>
        <p>
          {`"${movie.title}" là một bộ phim hấp dẫn với nhiều tình tiết lôi cuốn.
          Bộ phim mang đến trải nghiệm tuyệt vời về hành trình, cảm xúc và những giá trị nhân văn sâu sắc.`}
        </p>

        <div className="keyword-tags">
          <span>#{movie.title.replace(/\s+/g, "")}</span>
          <span>#{movie.engTitle.replace(/\s+/g, "")}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
