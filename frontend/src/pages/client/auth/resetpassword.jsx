import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import './auth.scss';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState({
        new: false,
        confirm: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [tokenValid, setTokenValid] = useState(false);

    // Verify token khi component mount
    useEffect(() => {
        if (!token) {
            setError('Token không hợp lệ');
            setIsVerifying(false);
            return;
        }

        verifyToken();
    }, [token]);

    const verifyToken = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/auth/verify-reset-token/${token}`);

            if (response.ok) {
                setTokenValid(true);
            } else {
                const data = await response.json();
                setError(data.detail || 'Token không hợp lệ hoặc đã hết hạn');
            }
        } catch (err) {
            setError('Không thể xác thực token. Vui lòng thử lại.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.newPassword.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8000/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    new_password: formData.newPassword,
                    confirm_password: formData.confirmPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                setIsSuccess(true);
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setError(data.detail || 'Có lỗi xảy ra. Vui lòng thử lại.');
            }
        } catch (err) {
            setError('Không thể kết nối đến server. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    if (isVerifying) {
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
                        <div className="forgot-password__content" style={{ textAlign: 'center' }}>
                            <div className="forgot-password__icon">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="spinner">
                                    <circle cx="12" cy="12" r="10" stroke="#dc2626" strokeWidth="2" fill="none"
                                        strokeDasharray="60" strokeDashoffset="30" strokeLinecap="round">
                                        <animateTransform attributeName="transform" type="rotate"
                                            from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" />
                                    </circle>
                                </svg>
                            </div>
                            <h2 className="forgot-password__title">Đang xác thực...</h2>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!tokenValid) {
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
                        <div className="forgot-password__content">
                            <div className="forgot-password__icon">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#dc2626" />
                                </svg>
                            </div>
                            <h2 className="forgot-password__title">Link Không Hợp Lệ</h2>
                            <p className="forgot-password__subtitle">{error}</p>
                            <div className="forgot-password__footer" style={{ borderTop: 'none', paddingTop: 0 }}>
                                <Link to="/forgot-password" className="forgot-password__back">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" fill="currentColor" />
                                    </svg>
                                    Yêu cầu link mới
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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

                    {!isSuccess ? (
                        <div className="forgot-password__content">
                            <div className="forgot-password__icon">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" fill="#dc2626" />
                                </svg>
                            </div>

                            <h2 className="forgot-password__title">Tạo Mật Khẩu Mới</h2>
                            <p className="forgot-password__subtitle">
                                Mật khẩu mới phải có ít nhất 6 ký tự và khác với mật khẩu cũ.
                            </p>

                            {error && (
                                <div style={{
                                    padding: '12px 16px',
                                    background: '#fee',
                                    border: '1px solid #fcc',
                                    borderRadius: '8px',
                                    color: '#dc2626',
                                    fontSize: '14px',
                                    marginBottom: '20px'
                                }}>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="forgot-password__form">
                                <div className="forgot-password__form-group">
                                    <label className="forgot-password__label">Mật khẩu mới</label>
                                    <div className="auth__password-wrapper">
                                        <input
                                            type={showPassword.new ? "text" : "password"}
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            className="forgot-password__input auth__input--password"
                                            placeholder="Nhập mật khẩu mới"
                                            required
                                        />
                                        <span
                                            className="auth__eye-icon"
                                            onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                                        >
                                            {showPassword.new ? '👁️' : '👁️‍🗨️'}
                                        </span>
                                    </div>
                                </div>

                                <div className="forgot-password__form-group">
                                    <label className="forgot-password__label">Xác nhận mật khẩu</label>
                                    <div className="auth__password-wrapper">
                                        <input
                                            type={showPassword.confirm ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="forgot-password__input auth__input--password"
                                            placeholder="Nhập lại mật khẩu mới"
                                            required
                                        />
                                        <span
                                            className="auth__eye-icon"
                                            onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                                        >
                                            {showPassword.confirm ? '👁️' : '👁️‍🗨️'}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="forgot-password__submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Đang xử lý...' : 'Đặt Lại Mật Khẩu'}
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

                            <h2 className="forgot-password__title">Thành Công!</h2>
                            <p className="forgot-password__subtitle">
                                Mật khẩu của bạn đã được đặt lại thành công.
                                Bạn sẽ được chuyển đến trang đăng nhập trong giây lát...
                            </p>

                            <button
                                onClick={() => navigate('/login')}
                                className="forgot-password__submit"
                                style={{ marginTop: '20px' }}
                            >
                                Đăng Nhập Ngay
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;