import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/useAuth";
import "../styles/Auth.css";
import loginbanner from "../assets/banner-login.jpg"

const LoginPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: "", password: "" } });

  const onSubmit = async (data) => {
    try {
      await auth.login(data.email, data.password);
      navigate("/");
    } catch (err) {
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
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
