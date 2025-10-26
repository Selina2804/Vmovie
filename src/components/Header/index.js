import React, { useEffect, useState, useRef } from "react";
import "./style.css";
import { FaUser } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import logo from "../../assets/vmovie.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/useAuth";
import axios from "axios";

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileGenre, setShowMobileGenre] = useState(false);
  const [showMobileCountry, setShowMobileCountry] = useState(false);
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { user, logout, updateUsername } = useAuth();

  const genreRef = useRef(null);
  const countryRef = useRef(null);
  const searchRef = useRef(null);

  // 🔹 Lấy dữ liệu từ MockAPI
  useEffect(() => {
    axios
      .get("https://68faff8894ec96066024411b.mockapi.io/movies")
      .then((res) => {
        setAllMovies(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi tải dữ liệu phim:", err);
        setLoading(false);
      });
  }, []);

  // 🔹 Xử lý scroll đổi màu header
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔹 Click ngoài để đóng dropdown / search
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        genreRef.current &&
        !genreRef.current.contains(e.target) &&
        countryRef.current &&
        !countryRef.current.contains(e.target)
      ) {
        setShowGenreDropdown(false);
        setShowCountryDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // 🔹 Đóng menu khi phóng to cửa sổ
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔹 Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setSuggestions([]);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim() === "") {
      setSuggestions([]);
    } else {
      const filtered = allMovies.filter(
        (m) =>
          m.title.toLowerCase().includes(value.toLowerCase()) ||
          m.engTitle.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 6));
    }
  };

  const handleSelectSuggestion = (movie) => {
    setQuery("");
    setSuggestions([]);
    navigate(`/thong-tin/${movie.id}`);
  };

  // 🔹 Lấy thể loại & quốc gia động
  const genres = [
    ...new Set(allMovies.flatMap((m) => m.genre.split(", ").map((g) => g.trim()))),
  ];
  const countries = [...new Set(allMovies.map((m) => m.country))];

  if (loading) {
    return (
      <header className="header">
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <span style={{ color: "#fff" }}>Đang tải dữ liệu phim...</span>
      </header>
    );
  }

  return (
    <>
      <header className={`header ${isScrolled ? "scrolled" : ""}`}>
        {/* LEFT */}
        <div className="header-left">
          <div className="logo" onClick={() => navigate("/")}>
            <img src={logo} alt="logo" />
          </div>

          {/* SEARCH BAR */}
          <form className="search-bar" onSubmit={handleSearch} ref={searchRef}>
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm phim..."
              className="search-input"
              value={query}
              onChange={handleChange}
            />

            {query.trim() !== "" && (
              <div className="search-suggestion-box">
                <p className="suggestion-title">Danh sách phim</p>
                {suggestions.length > 0 ? (
                  <ul>
                    {suggestions.map((movie) => (
                      <li
                        key={movie.id}
                        className="suggestion-item"
                        onClick={() => handleSelectSuggestion(movie)}
                      >
                        <img src={movie.image} alt={movie.title} />
                        <div className="movie-info">
                          <h4>{movie.title}</h4>
                          <p>{movie.engTitle}</p>
                          <span>
                            {movie.year} • {movie.duration}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="no-results">Không tìm thấy phim phù hợp.</div>
                )}
                <button
                  type="button"
                  className="see-all-btn"
                  onClick={() => {
                    navigate("/danh-sach");
                    setSuggestions([]);
                    setQuery("");
                  }}
                >
                  Toàn bộ kết quả
                </button>
              </div>
            )}
          </form>
        </div>

        {/* NAVIGATION */}
        <nav className="nav">
          <a href="/">Trang Chủ</a>
          <a href="/danh-sach">Danh Sách</a>

          {/* DROPDOWN THỂ LOẠI */}
          <div
            className="dropdown-click"
            ref={genreRef}
            onClick={() => {
              setShowGenreDropdown(!showGenreDropdown);
              setShowCountryDropdown(false);
            }}
          >
            <span>
              Thể Loại {showGenreDropdown ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </span>
            {showGenreDropdown && (
              <div
                className="dropdown-menu-large"
                style={{
                  marginTop: "5px",
                  background: "rgba(20, 20, 20, 0.95)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                {genres.map((g) => (
                  <div
                    key={g}
                    className="dropdown-item"
                    onClick={() => navigate(`/danh-sach?theloai=${g}`)}
                  >
                    {g}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* DROPDOWN QUỐC GIA */}
          <div
            className="dropdown-click"
            ref={countryRef}
            onClick={() => {
              setShowCountryDropdown(!showCountryDropdown);
              setShowGenreDropdown(false);
            }}
          >
            <span>
              Quốc Gia {showCountryDropdown ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </span>
            {showCountryDropdown && (
              <div
                className="dropdown-menu-large"
                style={{
                  marginTop: "5px",
                  background: "rgba(20, 20, 20, 0.95)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                {countries.map((c) => (
                  <div
                    key={c}
                    className="dropdown-item"
                    onClick={() => navigate(`/danh-sach?quocgia=${c}`)}
                  >
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* USER SECTION */}
        <div className={`header-right ${isMobileMenuOpen ? "hidden" : ""}`}>
          {user ? (
            <div className="user-menu" onClick={() => setShowMenu(!showMenu)}>
              <img src={user.avatar} alt="avatar" className="avatar" />
              <span>{user.username}</span>
              <IoIosArrowDown />
              {showMenu && (
                <div className="dropdown-menu">
                  {user.role === "admin" && (
                    <button onClick={() => navigate("/admin")}>Quản lý</button>
                  )}
                  <button
                    onClick={() => {
                      const newName = prompt("Nhập tên mới:", user.username);
                      if (newName) updateUsername(newName);
                    }}
                  >
                    Đổi tên
                  </button>
                  <button onClick={logout}>Đăng xuất</button>
                </div>
              )}
            </div>
          ) : (
            <button className="login-btn" onClick={() => navigate("/login")}>
              <FaUser /> Đăng nhập
            </button>
          )}
        </div>

        {/* ICON MENU MOBILE */}
        <div
          className={`mobile-menu-icon ${isMobileMenuOpen ? "hidden" : ""}`}
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <button className="close-btn" onClick={() => setIsMobileMenuOpen(false)}>
            x
          </button>

          <a href="/">Trang Chủ</a>
          <a href="/danh-sach">Danh Sách</a>

          <div className="mobile-dropdown">
            <span onClick={() => setShowMobileGenre(!showMobileGenre)}>
              Thể Loại {showMobileGenre ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </span>
            {showMobileGenre &&
              genres.map((g) => (
                <div
                  key={g}
                  className="dropdown-item"
                  onClick={() => {
                    navigate(`/danh-sach?theloai=${g}`);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {g}
                </div>
              ))}
          </div>

          <div className="mobile-dropdown">
            <span onClick={() => setShowMobileCountry(!showMobileCountry)}>
              Quốc Gia {showMobileCountry ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </span>
            {showMobileCountry &&
              countries.map((c) => (
                <div
                  key={c}
                  className="dropdown-item"
                  onClick={() => {
                    navigate(`/danh-sach?quocgia=${c}`);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {c}
                </div>
              ))}
          </div>

          <div className="mobile-user-section">
            {user ? (
              <>
                <div className="mobile-user">
                  <img src={user.avatar} alt="avatar" className="avatar" />
                  <span>{user.username}</span>
                </div>

                {user.role === "admin" && (
                  <button
                    className="admin-btn"
                    onClick={() => {
                      navigate("/admin");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Quản lý
                  </button>
                )}

                <button
                  className="logout-btn"
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <button
                className="login-btn mobile-login"
                onClick={() => {
                  navigate("/login");
                  setIsMobileMenuOpen(false);
                }}
              >
                <FaUser /> Đăng nhập
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
