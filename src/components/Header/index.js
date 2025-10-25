import React, { useEffect, useState, useRef } from "react";
import "./style.css";
import { FaUser } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import logo from "../../assets/vmovie.png";
import { useNavigate } from "react-router-dom";
import { useMovies } from "../../context/MovieContext";
import { useAuth } from "../../store/useAuth";

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

  const navigate = useNavigate();
  const { allMovies } = useMovies();
  const { user, logout, updateUsername } = useAuth();

  const genreRef = useRef(null);
  const countryRef = useRef(null);
  const searchRef = useRef(null);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside dropdown
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

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- SEARCH ---
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

  // --- DYNAMIC GENRES AND COUNTRIES ---
  const genres = [...new Set(allMovies.flatMap((m) => m.genre.split(", ").map((g) => g.trim())))];
  const countries = [...new Set(allMovies.map((m) => m.country))];

  return (
    <>
      <header className={`header ${isScrolled ? "scrolled" : ""}`}>
        {/* Left */}
        <div className="header-left">
          <div className="logo" onClick={() => navigate("/")}>
            <img src={logo} alt="logo" />
          </div>

          {/* Search bar */}
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
                            T{Math.floor(Math.random() * 10) + 10} • {movie.year} • {movie.duration}
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

        {/* NAV PC */}
        <nav className="nav">
          <a href="/">Trang Chủ</a>
          <a href="/danh-sach">Danh Sách</a>

          {/* Dropdown Thể loại */}
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
                style={{ marginTop: "10px" }} // 🧩 cách header
              >
                {genres.map((g) => (
                  <div
                    key={g}
                    className="dropdown-item"
                    style={{ color: "#fff" }} // 🎨 màu chữ trắng
                    onClick={() => navigate(`/danh-sach?theloai=${g}`)}
                  >
                    {g}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dropdown Quốc gia */}
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
                style={{ marginTop: "10px" }} // 🧩 cách header
              >
                {countries.map((c) => (
                  <div
                    key={c}
                    className="dropdown-item"
                    style={{ color: "#fff" }} // 🎨 màu chữ trắng
                    onClick={() => navigate(`/danh-sach?quocgia=${c}`)}
                  >
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* USER */}
        <div className={`header-right ${isMobileMenuOpen ? "hidden" : ""}`}>
          {user ? (
            <div className="user-menu" onClick={() => setShowMenu(!showMenu)}>
              <img src={user.avatar} alt="avatar" className="avatar" />
              <span>{user.username}</span>
              <IoIosArrowDown />
              {showMenu && (
                <div className="dropdown-menu">
                  {user.role === "admin" && (
                    <button onClick={() => navigate("/admin")}>Về trang quản lý</button>
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

        {/* Mobile menu icon */}
        <div
          className={`mobile-menu-icon ${isMobileMenuOpen ? "hidden" : ""}`}
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </header>
    </>
  );
}

export default Header;
