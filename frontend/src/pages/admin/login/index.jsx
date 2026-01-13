import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './login.scss';
import { LuEye, LuEyeOff, LuArrowRight } from "react-icons/lu";
import adminService from '../../../service/admin/authService';

const AdminLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    useEffect(() => {
        if (adminService.isAuthenticated()) {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await adminService.login({
                username: formData.username,
                password: formData.password
            });
            console.log('Login successful:', response);
            navigate('/admin/dashboard', { replace: true });
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Email/Tên người dùng hoặc mật khẩu không đúng');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin_auth">
            <div className="admin_auth__container">
                <div className="admin_auth__box">
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
                    <div className="admin_auth__section admin_auth__section--form">
                        <h2 className="admin_auth__title">Đăng nhập</h2>
                        <p className="admin_auth__subtitle">
                            Chào mừng trở lại! Vui lòng nhập thông tin.
                        </p>

                        {error && (
                            <div className="admin_auth__error">
                                {error}
                            </div>
                        )}

                        <form className="admin_auth__form" onSubmit={handleSubmit}>
                            <div className="admin_auth__form-group">
                                <label className="admin_auth__label">Email</label>
                                <input
                                    type="text"
                                    name="username"
                                    className="admin_auth__input"
                                    placeholder="admin@example.com"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    required
                                />
                            </div>

                            <div className="admin_auth__form-group">
                                <label className="admin_auth__label">Mật khẩu</label>

                                <div className="admin_auth__password-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        className="admin_auth__input admin_auth__input--password"
                                        placeholder="Nhập mật khẩu"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        required
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

                            <button
                                type="submit"
                                className="admin_auth__submit"
                                disabled={loading}
                            >
                                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                                {!loading && <LuArrowRight className="admin_auth__arrow-icon" />}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;