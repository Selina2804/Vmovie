import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";

const BASE_URL = "https://68faff8894ec96066024411b.mockapi.io";

export default function AccountManager() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    id: null,
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/account`);
        setUsers(response.data);
      } catch (error) {
        console.error("Lỗi khi tải người dùng:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async () => {
    if (!form.username || !form.email || !form.password) {
      return alert("Vui lòng điền đầy đủ thông tin!");
    }
    if (users.find((u) => u.email === form.email))
      return alert("Email đã tồn tại!");

    try {
      const response = await axios.post(`${BASE_URL}/account`, form);
      setUsers([...users, response.data]);
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (user) => {
    setForm(user);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`${BASE_URL}/account/${form.id}`, form);
      setUsers(users.map((u) => (u.id === form.id ? response.data : u)));
      resetForm();
      setShowModal(false);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      try {
        await axios.delete(`${BASE_URL}/account/${id}`);
        setUsers(users.filter((u) => u.id !== id));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const resetForm = () =>
    setForm({ id: null, username: "", email: "", password: "", role: "user" });

  const closeModal = () => {
    resetForm();
    setIsEditing(false);
    setShowModal(false);
  };

  return (
    <section className="account-manager">
      <h1>👤 Quản lý tài khoản</h1>

      <button className="btn-add" onClick={() => setShowModal(true)}>
        + Thêm người dùng
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="account-modal">
            <h3>{isEditing ? "Chỉnh sửa tài khoản" : "Thêm tài khoản mới"}</h3>

            <div className="form-add-edit">
              <input
                name="username"
                placeholder="Tên người dùng"
                value={form.username}
                onChange={handleChange}
              />
              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                value={form.password}
                onChange={handleChange}
              />
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <div className="form-actions">
                {isEditing ? (
                  <button className="btn-edit" onClick={handleUpdate}>
                    Cập nhật
                  </button>
                ) : (
                  <button className="btn-add" onClick={handleAdd}>
                    Thêm
                  </button>
                )}
                <button className="btn-delete" onClick={closeModal}>
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {users.length === 0 ? (
        <p className="no-account">Chưa có người dùng nào.</p>
      ) : (
        <table className="account-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên người dùng</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit" onClick={() => handleEdit(u)}>
                      Sửa
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(u.id)}
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
