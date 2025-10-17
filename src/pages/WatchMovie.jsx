// src/pages/WatchMovie.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { useMovies } from "../context/MovieContext";

const WatchMovie = () => {
  const { id } = useParams();
  const { allMovies } = useMovies();

  // Tìm phim dựa trên id (ép kiểu số)
  const movie = allMovies.find(m => m.id === parseInt(id));

  if (!movie) return <div>Phim không tồn tại hoặc đang tải...</div>;

  return (
    <div style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
      <h1>{movie.title}</h1>
      <iframe
        src={movie.videoUrl}
        title={movie.title}
        width="100%"
        height="500"
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default WatchMovie;
