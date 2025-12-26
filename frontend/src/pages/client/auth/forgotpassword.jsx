import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './auth.scss';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Reset password for:', email);
        setIsSubmitted(true);
        // Add your password reset logic here
    };

    return (
        <div className="auth">
            <div className="auth__container auth__container--forgot">
                <div className="forgot-password">
                    <div className="forgot-password__header">
                        <Link to="/" className="forgot-password__logo">
                            <span className="forgot-password__logo-star">★</span>
                            <span className="forgot-password__logo-text">LUMIÈRE</span>
                        </Link>
                    </div>

                    {!isSubmitted ? (
                        <div className="forgot-password__content">
                            <div className="forgot-password__icon">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#dc2626" />
                                </svg>
                            </div>

                            <h2 className="forgot-password__title">Quên Mật Khẩu?</h2>
                            <p className="forgot-password__subtitle">
                                Đừng lo lắng! Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn
                                hướng dẫn để đặt lại mật khẩu.
                            </p>

                            <form onSubmit={handleSubmit} className="forgot-password__form">
                                <div className="forgot-password__form-group">
                                    <label className="forgot-password__label">Địa chỉ Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="forgot-password__input"
                                        placeholder="example@email.com"
                                        required
                                    />
                                </div>

                                <button type="submit" className="forgot-password__submit">
                                    Gửi Link Đặt Lại
                                </button>
                            </form>

                            <div className="forgot-password__footer">
                                <Link to="/login" className="forgot-password__back">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" fill="currentColor" />
                                    </svg>
                                    Quay lại đăng nhập
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="forgot-password__content forgot-password__content--success">
                            <div className="forgot-password__icon forgot-password__icon--success">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="#10b981" />
                                </svg>
                            </div>

                            <h2 className="forgot-password__title">Email Đã Được Gửi!</h2>
                            <p className="forgot-password__subtitle">
                                Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email <strong>{email}</strong>.
                                Vui lòng kiểm tra hộp thư đến của bạn.
                            </p>

                            <div className="forgot-password__info">
                                <p>Không nhận được email?</p>
                                <ul>
                                    <li>Kiểm tra thư mục spam/junk</li>
                                    <li>Đảm bảo địa chỉ email chính xác</li>
                                    <li>Đợi vài phút rồi thử lại</li>
                                </ul>
                            </div>

                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="forgot-password__resend"
                            >
                                Gửi Lại Email
                            </button>

                            <div className="forgot-password__footer">
                                <Link to="/login" className="forgot-password__back">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" fill="currentColor" />
                                    </svg>
                                    Quay lại đăng nhập
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;