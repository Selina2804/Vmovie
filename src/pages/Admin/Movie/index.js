import React, { useState } from "react";
import { useMovies } from "../../../context/MovieContext";
import "./style.css";

export default function MovieManager() {
  const { allMovies } = useMovies();
  const [movies, setMovies] = useState(allMovies);
  const [form, setForm] = useState({
    id: null,
    title: "",
    engTitle: "",
    genre: "",
    country: "",
    duration: "",
    year: "",
    image: "",
    videoUrl: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = () => {
    if (!form.title) return alert("Tên phim là bắt buộc!");
    const newMovie = { id: Date.now(), ...form };
    setMovies([...movies, newMovie]);
    resetForm();
  };

  const handleEdit = (movie) => {
    setForm(movie);
    setIsEditing(true);
  };

  const handleUpdate = () => {
    setMovies(movies.map((m) => (m.id === form.id ? form : m)));
    resetForm();
    setIsEditing(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa phim này?")) {
      setMovies(movies.filter((m) => m.id !== id));
    }
  };

  const resetForm = () =>
    setForm({
      id: null,
      title: "",
      engTitle: "",
      genre: "",
      country: "",
      duration: "",
      year: "",
      image: "",
      videoUrl: "",
      description: "",
    });

  return (
    <section className="dashboard">
      <h2>🎬 Quản lý phim</h2>

      {/* Form Thêm/Sửa */}
      <div className="form-add-edit">
        <input
          name="title"
          placeholder="Tên phim"
          value={form.title}
          onChange={handleInputChange}
        />
        <input
          name="engTitle"
          placeholder="Tên tiếng Anh"
          value={form.engTitle}
          onChange={handleInputChange}
        />
        <input
          name="genre"
          placeholder="Thể loại"
          value={form.genre}
          onChange={handleInputChange}
        />
        <input
          name="country"
          placeholder="Quốc gia"
          value={form.country}
          onChange={handleInputChange}
        />
        <input
          name="duration"
          placeholder="Thời lượng"
          value={form.duration}
          onChange={handleInputChange}
        />
        <input
          name="year"
          placeholder="Năm sản xuất"
          value={form.year}
          onChange={handleInputChange}
        />
        <input
          name="image"
          placeholder="URL ảnh"
          value={form.image}
          onChange={handleInputChange}
        />
        <input
          name="videoUrl"
          placeholder="URL video"
          value={form.videoUrl}
          onChange={handleInputChange}
        />
        <textarea
          name="description"
          placeholder="Mô tả"
          value={form.description}
          onChange={handleInputChange}
        />
        {isEditing ? (
          <button className="btn-edit" onClick={handleUpdate}>
            Cập nhật
          </button>
        ) : (
          <button className="btn-edit" onClick={handleAdd}>
            Thêm
          </button>
        )}
      </div>

      {/* Table */}
      <table className="sales-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Ảnh</th>
            <th>Tên phim</th>
            <th>Thể loại</th>
            <th>Quốc gia</th>
            <th>Thời lượng</th>
            <th>Năm</th>
            <th>Video</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((m, index) => (
            <tr key={m.id}>
              <td>{index + 1}</td>
              <td>
                {m.image && (
                  <img
                    src={m.image}
                    alt={m.title}
                    style={{ width: "80px", borderRadius: "6px" }}
                  />
                )}
              </td>
              <td>{m.title}</td>
              <td>{m.genre}</td>
              <td>{m.country}</td>
              <td>{m.duration}</td>
              <td>{m.year}</td>
              <td>
                {m.videoUrl && (
                  <a href={m.videoUrl} target="_blank" rel="noopener noreferrer">
                    🎬 Xem
                  </a>
                )}
              </td>
              <td>
                <button className="btn-edit" onClick={() => handleEdit(m)}>
                  Sửa
                </button>
                <button className="btn-delete" onClick={() => handleDelete(m.id)}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
