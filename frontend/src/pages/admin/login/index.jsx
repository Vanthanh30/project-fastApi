import React, { useState } from 'react';
import './login.scss';
import { LuEye, LuEyeOff, LuArrowRight } from "react-icons/lu";
const AdminLogin = () => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="admin_auth">
            <div className="admin_auth__container">
                <div className="admin_auth__box">
                    {/* PHẦN TRÁI: ẢNH WAVY ĐEN + LOGO & TEXT Ở DƯỚI */}
                    <div className="admin_auth__section admin_auth__section--image">
                        <div className="admin_auth__admin-content">
                            <div className="admin_auth__admin-logo">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                                    <rect x="4" y="4" width="4" height="4" rx="1" />
                                    <rect x="4" y="10" width="8" height="10" rx="1" />
                                </svg>
                            </div>
                            <h1 className="admin_auth__admin-title">Cosmetics Admin</h1>
                            <p className="admin_auth__admin-desc">
                                Quản lý cửa hàng trực tuyến, theo dõi đơn hàng và cập nhật bộ sưu tập mới nhất.
                            </p>
                        </div>
                    </div>

                    {/* PHẦN PHẢI: FORM ĐĂNG NHẬP */}
                    <div className="admin_auth__section admin_auth__section--form">
                        <h2 className="admin_auth__title">Đăng nhập</h2>
                        <p className="admin_auth__subtitle">
                            Chào mừng trở lại! Vui lòng nhập thông tin.
                        </p>

                        <form className="admin_auth__form">
                            <div className="admin_auth__form-group">
                                <label className="admin_auth__label">Email hoặc Tên người dùng</label>
                                <input
                                    type="text"
                                    className="admin_auth__input"
                                    placeholder="admin@example.com"
                                />
                            </div>

                            <div className="admin_auth__form-group">
                                <label className="admin_auth__label">Mật khẩu</label>

                                <div className="admin_auth__password-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="admin_auth__input admin_auth__input--password"
                                        placeholder="Nhập mật khẩu"
                                    />

                                    {showPassword ? (
                                        <LuEye
                                            className="admin_auth__eye-icon"
                                            onClick={() => setShowPassword(false)}
                                        />
                                    ) : (
                                        <LuEyeOff
                                            className="admin_auth__eye-icon"
                                            onClick={() => setShowPassword(true)}
                                        />
                                    )}
                                </div>
                            </div>

                            <button type="submit" className="admin_auth__submit">
                                Đăng nhập <LuArrowRight className="admin_auth__arrow-icon" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;