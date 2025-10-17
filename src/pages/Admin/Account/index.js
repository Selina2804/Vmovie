import React, { useState, useEffect } from "react";
import "./style.css";

export default function AccountManager() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ id: null, username: "", email: "", password: "", role: "user" });
  const [isEditing, setIsEditing] = useState(false);

  // Load user từ localStorage
  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    setUsers(allUsers);
  }, []);

  // Đồng bộ mỗi khi users thay đổi
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = () => {
    if (!form.username || !form.email || !form.password) {
      return alert("Vui lòng điền đầy đủ thông tin!");
    }
    if (users.find(u => u.email === form.email)) return alert("Email đã tồn tại!");
    const newUser = { ...form, id: Date.now() };
    setUsers([...users, newUser]);
    setForm({ id: null, username: "", email: "", password: "", role: "user" });
  };

  const handleEdit = (user) => {
    setForm(user);
    setIsEditing(true);
  };

  const handleUpdate = () => {
    setUsers(users.map(u => u.id === form.id ? form : u));
    setForm({ id: null, username: "", email: "", password: "", role: "user" });
    setIsEditing(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <section className="dashboard">
      <h2>👤 Quản lý tài khoản</h2>
      <p>Danh sách người dùng trong hệ thống</p>

      {/* Form thêm/sửa user */}
      <div className="form-add-edit">
        <input name="username" placeholder="Tên người dùng" value={form.username} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="Mật khẩu" value={form.password} onChange={handleChange} />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        {isEditing ? (
          <button className="btn-edit" onClick={handleUpdate}>Cập nhật</button>
        ) : (
          <button className="btn-edit" onClick={handleAdd}>Thêm</button>
        )}
      </div>

      {/* Bảng danh sách user */}
      <table className="sales-table">
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
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button className="btn-edit" onClick={() => handleEdit(u)}>Sửa</button>
                <button className="btn-delete" onClick={() => handleDelete(u.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
