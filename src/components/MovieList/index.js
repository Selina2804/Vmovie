import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "./style.css";
import { Link } from "react-router-dom";
import { useMovies } from "../../context/MovieContext";

// MovieCard bọc Link để click được
const MovieCard = ({ movie }) => (
  <Link style={{textDecoration:'none'}} to={`/xem-phim/${movie.id}`} className="movie-card-link">
    <div className="movie-card">
      <img src={movie.image} alt={movie.title} />
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>{movie.engTitle}</p>
      </div>
    </div>
  </Link>
);

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

const MovieList = () => {
  const { allMovies } = useMovies();

  if (!allMovies || allMovies.length === 0) return <p>Đang tải danh sách phim...</p>;

  const firstSection = allMovies.slice(0, 6);
  const secondSection = allMovies.slice(6, 12);

  return (
    <>
      <MovieSection title="Anime & Phim Hay" movies={firstSection} />
      {secondSection.length > 0 && <MovieSection title="Phim Khác" movies={secondSection} />}
    </>
  );
};

export default MovieList;
