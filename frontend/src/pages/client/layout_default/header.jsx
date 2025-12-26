import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./layout_default.scss";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const handleCartClick = () => {
    navigate("/cart");
  };

  return (
    <header className="header">
      <div className="header__container">
        <a href="/" className="header__logo">
          <span className="header__logo-star">★</span>
          <span className="header__logo-text">LUMIÈRE</span>
        </a>

        <nav className="header__nav">
          <a href="/products" className="header__nav-link">
            SẢN PHẨM
          </a>
          <a href="/new-arrivals" className="header__nav-link">
            HÀNG MỚI VỀ
          </a>
          <a href="/collection" className="header__nav-link">
            BỘ SƯU TẬP
          </a>
          <a href="/about" className="header__nav-link">
            VỀ CHÚNG TÔI
          </a>
        </nav>

        <div className="header__actions">
          <div className="header__search">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="header__search-input"
            />
            <svg
              className="header__search-icon"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M7 12C9.76142 12 12 9.76142 12 7C12 4.23858 9.76142 2 7 2C4.23858 2 2 4.23858 2 7C2 9.76142 4.23858 12 7 12Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 14L10.5 10.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <button className="header__icon-btn" aria-label="User Account">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z" />
              <path d="M10 12.5C5.58172 12.5 2 14.5817 2 17.5V20H18V17.5C18 14.5817 14.4183 12.5 10 12.5Z" />
            </svg>
          </button>

          <button
            className="header__icon-btn header__cart"
            aria-label="Shopping Cart"
            onClick={handleCartClick}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M2.5 2.5H3.5L5.5 13.5H16.5L18.5 6.5H4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="7" cy="17" r="1" fill="currentColor" />
              <circle cx="15" cy="17" r="1" fill="currentColor" />
            </svg>
            <span className="header__cart-badge">1</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
