import { create } from "zustand";
import axios from "axios";

// Địa chỉ của Mock API
const BASE_URL = "https://68faff8894ec96066024411b.mockapi.io";

// Tạo store với zustand
export const useAuth = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null, // Lấy thông tin người dùng từ localStorage nếu có

  // Đăng ký user mới
  register: async (email, password, username) => {
    try {
      // Gửi yêu cầu POST đến MockAPI để tạo tài khoản mới, mặc định role là "user"
      const { data } = await axios.post(`${BASE_URL}/account`, {
        email,
        password,
        username,
        role: "user", // Mặc định là "user", không cho phép đăng ký admin
      });

      // Lưu thông tin người dùng vào localStorage
      localStorage.setItem("user", JSON.stringify(data));

      // Cập nhật trạng thái của store
      set({ user: data });

      return data; // Trả về dữ liệu người dùng để xử lý sau (nếu cần)
    } catch (error) {
      console.error("Đăng ký thất bại: ", error);
      throw new Error("Đăng ký thất bại"); // Đẩy lỗi ra để thông báo cho người dùng
    }
  },

  // Đăng nhập
  login: async (email, password) => {
    try {
      // Sử dụng đúng endpoint /account thay vì /users
      const { data } = await axios.get(`${BASE_URL}/account`);
      
      // Log dữ liệu trả về từ API để kiểm tra
      console.log("Dữ liệu người dùng từ Mock API: ", data);

      // Tìm tài khoản đúng email và mật khẩu (so sánh không phân biệt chữ hoa chữ thường)
      const foundUser = data.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      console.log("Người dùng tìm thấy: ", foundUser); // Kiểm tra người dùng đã tìm thấy trong API

      if (!foundUser) throw new Error("Sai email hoặc mật khẩu");

      // Lưu thông tin người dùng vào localStorage và cập nhật trạng thái trong zustand
      localStorage.setItem("user", JSON.stringify(foundUser));
      set({ user: foundUser });

      return foundUser;
    } catch (error) {
      console.error("Đăng nhập thất bại: ", error);
      throw new Error("Sai email hoặc mật khẩu"); // Đẩy lỗi ra để hiển thị thông báo
    }
  },

  // Đăng xuất
  logout: () => {
    localStorage.removeItem("user"); // Xóa thông tin người dùng khỏi localStorage
    set({ user: null }); // Đặt lại state về null
  },

  // Cập nhật thông tin người dùng
  updateUser: async (id, updates) => {
    try {
      const { data } = await axios.put(`${BASE_URL}/account/${id}`, updates);
      if (JSON.parse(localStorage.getItem("user"))?.id === id) {
        localStorage.setItem("user", JSON.stringify(data));
        set({ user: data });
      }
      return data;
    } catch (error) {
      console.error("Cập nhật người dùng thất bại: ", error);
      throw new Error("Cập nhật thất bại");
    }
  },

  // Cập nhật tên người dùng
  updateUsername: async (newName) => {
    set((state) => {
      if (!state.user) return {};
      const updated = { ...state.user, username: newName };
      axios.put(`${BASE_URL}/account/${state.user.id}`, updated);
      localStorage.setItem("user", JSON.stringify(updated));
      return { user: updated };
    });
  },
}));
