import React from "react";
import "./style.css";
import { FaPlay, FaHeart } from "react-icons/fa";

function Banner() {
  return (
    <section
      className="banner"
      style={{
        backgroundImage:
          "url('https://public.laylo.com/resized_drop_images/20251010-a1f3049fd818_640.jpeg')", 
      }}
    >
      <div className="overlay"></div>

      <div className="banner-info">
        <h1 className="banner-title">Yến Ngộ Vĩnh An</h1>
        <p className="banner-subtitle">Yummy Yummy Yummy</p>

        <div className="banner-tags">
          <span className="imdb">IMDb 7.2</span>
          <span>4K</span>
          <span>Phim Bộ</span>
          <span>2025</span>
          <span>32 tập</span>
        </div>

        <div className="banner-genres">
          <span>Tình Cảm</span>
          <span>Tâm Lý</span>
          <span>Hài</span>
          <span>Cổ Trang</span>
          <span>Chính Kịch</span>
          <span>Giả Tưởng</span>
        </div>

        <p className="banner-desc">
          Một cuộc gặp gỡ tình cờ đưa gia đình Thẩm đến thành phố Vĩnh An, nơi họ
          gặp Lâm Yên, một quan tòa. Hành trình của họ mở ra một câu chuyện kỳ thú
          về ẩm thực, truyền thống địa phương và một mối tình bất ngờ.
        </p>

        <div className="banner-buttons">
          <button className="play-btn">
            <FaPlay /> Xem phim
          </button>
          <button className="fav-btn">
            <FaHeart />
          </button>
        </div>
      </div>
    </section>
    
  );
}

export default Banner;
