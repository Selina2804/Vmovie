import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/useAuth"; // Zustand store
import "../styles/Auth.css";
import loginbanner from "../assets/banner-login.jpg";

const LoginPage = () => {
  const auth = useAuth(); // Zustand store auth
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: "", password: "" } });

  // Lắng nghe sự thay đổi của user trong zustand
  useEffect(() => {
    if (auth.user) {
      // Nếu người dùng đã đăng nhập, điều hướng theo quyền
      if (auth.user.role === "admin") {
        navigate("/admin"); // Điều hướng đến trang quản trị cho admin
      } else {
        navigate("/"); // Điều hướng đến trang chủ cho người dùng bình thường
      }
    }
  }, [auth.user, navigate]); // Phụ thuộc vào sự thay đổi của user và navigate

  const onSubmit = async (data) => {
    try {
      // Đăng nhập và cập nhật người dùng trong zustand
      await auth.login(data.email.trim(), data.password.trim());

      // Sau khi đăng nhập thành công, điều hướng sẽ tự động qua useEffect
    } catch (err) {
      // Hiển thị lỗi nếu đăng nhập thất bại
      alert(err.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="container">
      <div className="auth-wrapper">
        <div className="auth-image">
          <img src={loginbanner} alt="Login illustration" />
        </div>
        <div className="auth-container">
          <h2>Đăng nhập</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <label>Email</label>
            <input
              {...register("email", { required: "Nhập email" })}
              placeholder="Nhập email"
            />
            {errors.email && <p className="error-text">{errors.email.message}</p>}

            <label>Mật khẩu</label>
            <input
              type="password"
              {...register("password", { required: "Nhập mật khẩu" })}
              placeholder="Nhập mật khẩu"
            />
            {errors.password && (
              <p className="error-text">{errors.password.message}</p>
            )}

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <p className="another-form">
            Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
          </p>

          {/* 🔹 Ghi chú tài khoản admin */}
          <div
            className="admin-note"
            style={{
              marginTop: "1rem",
              fontSize: "0.9rem",
              color: "#ccc",
              textAlign: "left",
            }}
          >
            Tài khoản admin mặc định để truy cập trang quản trị:
            <br />
            Email: <strong>admin@gmail.com</strong> <br />
            Mật khẩu: <strong>admin123</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
