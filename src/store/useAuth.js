import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // Khởi tạo admin cố định
  useEffect(() => {
    let storedUsers = JSON.parse(localStorage.getItem("users") || "[]");

    // Admin id cố định để không bị trùng khi reload
    const adminId = "admin-001";

    if (!storedUsers.some(u => u.role === "admin")) {
      const admin = {
        id: adminId,
        username: "Admin",
        email: "admin@gmail.com",
        password: "admin123",
        role: "admin",
        avatar: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
      };
      storedUsers.push(admin);
      localStorage.setItem("users", JSON.stringify(storedUsers));
    }

    setUsers(storedUsers);
  }, []);

  // Đăng ký user mới
  const register = (email, password, username) => {
    if (users.find(u => u.email === email)) {
      throw new Error("Email đã tồn tại!");
    }

    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password,
      role: "user",
      avatar: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  // Đăng nhập
  const login = (email, password) => {
    if (!users.length) throw new Error("Danh sách user chưa sẵn sàng!");

    const foundUser = users.find(u => u.email === email && u.password === password);
    if (!foundUser) throw new Error("Sai email hoặc mật khẩu!");

    setUser(foundUser);
    localStorage.setItem("user", JSON.stringify(foundUser));
    return foundUser;
  };

  // Đăng xuất
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Update username
  const updateUsername = (newName) => {
    if (!user) return;
    const updated = { ...user, username: newName };
    const updatedUsers = users.map(u => u.id === user.id ? updated : u);
    setUsers(updatedUsers);
    setUser(updated);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, updateUsername }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
