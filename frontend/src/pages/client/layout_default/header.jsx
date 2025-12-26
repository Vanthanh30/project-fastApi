import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./layout_default.scss";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Check if user is logged in
  const [user, setUser] = useState(null); // Store user data
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  // Check authentication status on component mount
  useEffect(() => {
    // TODO: Replace with actual authentication check
    // Example: Check localStorage, cookies, or call API
    const checkAuth = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        setIsLoggedIn(true);
        setUser(JSON.parse(userData));
      }
    };
    checkAuth();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCartClick = () => {
    navigate("/cart");
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogin = () => {
    setIsUserMenuOpen(false);
    navigate("/login");
  };

  const handleRegister = () => {
    setIsUserMenuOpen(false);
    navigate("/register");
  };

  const handleProfile = () => {
    setIsUserMenuOpen(false);
    navigate("/profile");
  };

  const handleLogout = () => {
    // TODO: Implement actual logout logic
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setIsUserMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header__container">
        <a href="/" className="header__logo">
          <span className="header__logo-star">★</span>
          <span className="header__logo-text">LUMIÈRE</span>
        </a>

        <nav className="header__nav">
          <a href="/collection" className="header__nav-link">
            BỘ SƯU TẬP
          </a>
          <a href="/blog" className="header__nav-link">
            BÀI VIẾT
          </a>
          <a href="/help" className="header__nav-link">
            TRỢ GIÚP
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

          {/* User Menu Dropdown */}
          <div className="header__user-menu" ref={userMenuRef}>
            <button
              className="header__icon-btn"
              aria-label="User Account"
              onClick={toggleUserMenu}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z" />
                <path d="M10 12.5C5.58172 12.5 2 14.5817 2 17.5V20H18V17.5C18 14.5817 14.4183 12.5 10 12.5Z" />
              </svg>
            </button>

            {isUserMenuOpen && (
              <div className="header__dropdown">
                {!isLoggedIn ? (
                  // Not logged in - Show Login & Register
                  <>
                    <button
                      className="header__dropdown-item"
                      onClick={handleLogin}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Đăng Nhập</span>
                    </button>
                    <button
                      className="header__dropdown-item"
                      onClick={handleRegister}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M20 8V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M23 11H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Đăng Ký</span>
                    </button>
                  </>
                ) : (
                  // Logged in - Show Profile & Logout
                  <>
                    <div className="header__dropdown-user">
                      <div className="header__dropdown-avatar">
                        {user?.avatar ? (
                          <img src={user.avatar} alt={user.name} />
                        ) : (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" />
                            <path d="M12 14C7.58172 14 4 16.5817 4 19.5V22H20V19.5C20 16.5817 16.4183 14 12 14Z" />
                          </svg>
                        )}
                      </div>
                      <div className="header__dropdown-info">
                        <p className="header__dropdown-name">{user?.name || 'Người dùng'}</p>
                        <p className="header__dropdown-email">{user?.email || 'user@example.com'}</p>
                      </div>
                    </div>
                    <div className="header__dropdown-divider"></div>
                    <button
                      className="header__dropdown-item"
                      onClick={handleProfile}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Thông Tin Cá Nhân</span>
                    </button>
                    <button
                      className="header__dropdown-item header__dropdown-item--logout"
                      onClick={handleLogout}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Đăng Xuất</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

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