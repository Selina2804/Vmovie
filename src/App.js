// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer"; 
import Home from "./pages/Home";
import AllMovies from "./pages/AllMovie";
import MovieDetail from "./pages/Detail";

import { MovieProvider } from "./context/MovieContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { AuthProvider } from "./store/useAuth";
import WatchMovie from "./pages/Watch"; 
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <MovieProvider>
        <Header />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/danh-sach" element={<AllMovies />} />
            <Route path="/thong-tin/:id" element={<MovieDetail />} />
            <Route path="/xem-phim/:id" element={<WatchMovie />} /> 
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
          <Footer />
        </div>
      </MovieProvider>
    </AuthProvider>
  );
}

export default App;
