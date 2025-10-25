import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "./style.css";
import { Link } from "react-router-dom";
import axios from "axios";

// 🎬 Thẻ phim
const MovieCard = ({ movie }) => (
  <Link
    style={{ textDecoration: "none" }}
    to={`/thong-tin/${movie.id}`}
    className="movie-card-link"
  >
    <div className="movie-card">
      <img src={movie.image} alt={movie.title} />
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>{movie.engTitle}</p>
      </div>
    </div>
  </Link>
);

// 🎞️ Mục phim (có Swiper)
const MovieSection = ({ title, movies }) => (
  <div className="movie-section">
    <div className="movie-header">
      <h2>{title}</h2>
      <Link to="/danh-sach" className="see-more">
        Xem thêm →
      </Link>
    </div>

    <div className="swiper-container-wrapper">
      <div className="swiper-button-prev custom-nav"></div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={16}
        slidesPerView={5}
        grabCursor
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        breakpoints={{
          320: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 5 },
        }}
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <MovieCard movie={movie} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="swiper-button-next custom-nav"></div>
    </div>
  </div>
);

// 📋 Danh sách tổng hợp phim
const MovieList = () => {
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data từ MockAPI
  useEffect(() => {
    axios
      .get("https://68faff8894ec96066024411b.mockapi.io/movies")
      .then((res) => {
        setAllMovies(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Lỗi tải danh sách phim");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Đang tải danh sách phim...</p>;
  if (error) return <p>{error}</p>;

  // Chia 2 section: Anime & Phim Hay và Anime
  const firstSection = allMovies.slice(0, 6);
  const animeSection = allMovies.filter((m) =>
    m.genre.toLowerCase().includes("anime")
  );

  return (
    <>
      <MovieSection title="Anime & Phim Hay" movies={firstSection} />
      {animeSection.length > 0 && (
        <MovieSection title="Anime" movies={animeSection} />
      )}
    </>
  );
};

export default MovieList;
