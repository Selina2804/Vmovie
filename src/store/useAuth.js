import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // ✅ Đăng ký tài khoản
  const register = async (email, password, username) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.find((u) => u.email === email)) {
      throw new Error("Email đã tồn tại!");
    }

    const newUser = {
      id: Date.now(),
      username,
      email,
      password,
      avatar: "https://cdn-icons-png.flaticon.com/512/847/847969.png", // ảnh mặc định
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
  };

  // ✅ Đăng nhập
  const login = async (email, password) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!foundUser) throw new Error("Sai email hoặc mật khẩu!");

    setUser(foundUser);
    localStorage.setItem("user", JSON.stringify(foundUser));
  };

  // ✅ Đăng xuất
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // ✅ Đổi tên người dùng
  const updateUsername = (newName) => {
    if (!user) return;
    const updated = { ...user, username: newName };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = users.map((u) =>
      u.email === user.email ? updated : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  return (
    <AuthContext.Provider
      value={{ user, register, login, logout, updateUsername }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
