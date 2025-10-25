import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";

export default function MovieManager() {
  const [movies, setMovies] = useState([]);
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
  const [showModal, setShowModal] = useState(false);

  // Lấy danh sách phim
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(
          "https://68faff8894ec96066024411b.mockapi.io/movies"
        );
        setMovies(res.data);
      } catch (err) {
        console.error("Error fetching movies:", err);
      }
    };
    fetchMovies();
  }, []);

  // Nhập liệu form
  const handleInputChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Thêm phim
  const handleAdd = async () => {
    if (!form.title) return alert("Tên phim là bắt buộc!");
    try {
      const res = await axios.post(
        "https://68faff8894ec96066024411b.mockapi.io/movies",
        form
      );
      setMovies([...movies, res.data]);
      resetForm();
      setShowModal(false);
    } catch (err) {
      console.error("Error adding movie:", err);
    }
  };

  // Chỉnh sửa phim
  const handleEdit = (movie) => {
    setForm(movie);
    setIsEditing(true);
    setShowModal(true);
  };

  // Cập nhật phim
  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `https://68faff8894ec96066024411b.mockapi.io/movies/${form.id}`,
        form
      );
      setMovies(movies.map((m) => (m.id === form.id ? res.data : m)));
      resetForm();
      setIsEditing(false);
      setShowModal(false);
    } catch (err) {
      console.error("Error updating movie:", err);
    }
  };

  // Xóa phim
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa phim này?")) {
      try {
        await axios.delete(
          `https://68faff8894ec96066024411b.mockapi.io/movies/${id}`
        );
        setMovies(movies.filter((m) => m.id !== id));
      } catch (err) {
        console.error("Error deleting movie:", err);
      }
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

  const closeModal = () => {
    resetForm();
    setShowModal(false);
  };

  return (
    <div className="movie-manager">
      <h1>Quản Lý Danh Sách Phim</h1>

      <div className="top-bar">
        <button className="add-btn" onClick={() => setShowModal(true)}>
          Thêm phim mới
        </button>
        <p className="movie-count">
          Tổng số phim: <span>{movies.length}</span>
        </p>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{isEditing ? "Chỉnh sửa phim" : "Thêm phim mới"}</h2>

            <form
              className="movie-form"
              onSubmit={(e) => e.preventDefault()}
              autoComplete="off"
            >
              <div className="form-content">
                <div className="form-left">
                  {form.image ? (
                    <img src={form.image} alt="Preview" className="preview" />
                  ) : (
                    <div className="preview-placeholder">Chưa có ảnh</div>
                  )}
                </div>

                <div className="form-right">
                  <div className="form-grid">
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

                    <div className="form-row-inline">
                      <input
                        className="small-input"
                        name="duration"
                        placeholder="Thời lượng"
                        value={form.duration}
                        onChange={handleInputChange}
                      />
                      <input
                        className="small-input"
                        name="year"
                        placeholder="Năm"
                        value={form.year}
                        onChange={handleInputChange}
                      />
                      <input
                        className="small-input"
                        name="country"
                        placeholder="Quốc gia"
                        value={form.country}
                        onChange={handleInputChange}
                      />
                    </div>

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
                      placeholder="Mô tả phim"
                      value={form.description}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-buttons">
                    {isEditing ? (
                      <button className="save-btn" onClick={handleUpdate}>
                        Cập nhật
                      </button>
                    ) : (
                      <button className="save-btn" onClick={handleAdd}>
                        Thêm phim
                      </button>
                    )}
                    <button className="cancel-btn" onClick={closeModal}>
                      Hủy
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 📋 Danh sách phim */}
      <div className="movie-table">
        <table>
          <thead>
            <tr>
              <th>#</th>
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
            {movies.map((m, i) => (
              <tr key={m.id}>
                <td>{i + 1}</td>
                <td>
                  {m.image && (
                    <img src={m.image} alt={m.title} className="poster" />
                  )}
                </td>
                <td className="title-cell">
                  <strong>{m.title}</strong>
                  <div className="eng-title">{m.engTitle}</div>
                </td>
                <td>{m.genre}</td>
                <td>{m.country}</td>
                <td>{m.duration}</td>
                <td>{m.year}</td>
                <td>
                  {m.videoUrl && (
                    <a
                      href={m.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="watch-link"
                    >
                      🎥 Xem
                    </a>
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="edit-btn" onClick={() => handleEdit(m)}>
                      Sửa
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(m.id)}
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {movies.length === 0 && (
              <tr>
                <td colSpan={9} className="no-movie">
                  Không có phim nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
