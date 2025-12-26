import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './auth.scss';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('Mật khẩu xác nhận không khớp!');
            return;
        }

        if (!formData.agreeToTerms) {
            alert('Vui lòng đồng ý với điều khoản dịch vụ!');
            return;
        }

        console.log('Register data:', formData);
        // Add your registration logic here
    };

    return (
        <div className="auth">
            <div className="auth__container">
                <div className="auth__box">
                    {/* Left Side - Brand Image */}
                    <div className="auth__section auth__section--image" data-page="register">
                        <Link to="/" className="auth__brand-logo">
                            <span className="auth__brand-star">★</span>
                            <span className="auth__brand-text">LUMIÈRE</span>
                        </Link>
                    </div>

                    {/* Right Side - Register */}
                    <div className="auth__section">
                        <h2 className="auth__title">Đăng Ký</h2>
                        <p className="auth__subtitle">
                            Tạo tài khoản mới để trải nghiệm tích điểm và nhận ưu đãi độc quyền
                        </p>

                        {/* Register Form */}
                        <form onSubmit={handleSubmit} className="auth__form">
                            <div className="auth__form-group">
                                <label className="auth__label">Họ và tên</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="auth__input"
                                    placeholder="Nguyễn Văn A"
                                    required
                                />
                            </div>

                            <div className="auth__form-group">
                                <label className="auth__label">Địa chỉ Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="auth__input"
                                    placeholder="example@email.com"
                                    required
                                />
                            </div>

                            <div className="auth__form-group">
                                <label className="auth__label">Mật khẩu</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="auth__input"
                                    placeholder="••••••••"
                                    required
                                    minLength="6"
                                />
                            </div>

                            <div className="auth__form-group">
                                <label className="auth__label">Xác nhận mật khẩu</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="auth__input"
                                    placeholder="••••••••"
                                    required
                                    minLength="6"
                                />
                            </div>

                            <div className="auth__form-group auth__form-group--checkbox">
                                <label className="auth__checkbox">
                                    <input
                                        type="checkbox"
                                        name="agreeToTerms"
                                        checked={formData.agreeToTerms}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span className="auth__checkbox-custom"></span>
                                    <span className="auth__checkbox-label">
                                        Tôi đồng ý với{' '}
                                        <Link to="/terms" className="auth__link">Điều khoản dịch vụ</Link>
                                        {' '}và{' '}
                                        <Link to="/privacy" className="auth__link">Chính sách bảo mật</Link>
                                    </span>
                                </label>
                            </div>

                            <button type="submit" className="auth__submit">
                                Đăng Ký
                            </button>

                            <div className="auth__footer">
                                <p className="auth__footer-text">
                                    Đã có tài khoản?{' '}
                                    <Link to="/login" className="auth__link">
                                        Đăng nhập ngay
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;