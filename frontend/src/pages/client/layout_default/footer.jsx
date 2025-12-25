import React, { useState } from 'react';
import './layout_default.scss';

const Footer = () => {
    const [email, setEmail] = useState('');

    const handleSubscribe = (e) => {
        e.preventDefault();
        console.log('Subscribed with email:', email);
        setEmail('');
    };

    return (
        <footer className="footer">
            <div className="footer__container">
                <div className="footer__grid">
                    {/* Newsletter Section */}
                    <div className="footer__newsletter">
                        <h3 className="footer__title">MỞ KHÓA QUYỀN LỢI ĐẶC BIỆT</h3>
                        <p className="footer__description">
                            Đăng ký để nhận ưu đãi giảm 15% cho đơn hàng đầu tiên và là người đầu tiên biết về các sản phẩm mới.
                        </p>
                        <form className="footer__form" onSubmit={handleSubscribe}>
                            <input
                                type="email"
                                placeholder="Địa chỉ Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="footer__input"
                                required
                            />
                            <button type="submit" className="footer__submit">
                                ĐĂNG KÝ
                            </button>
                        </form>
                    </div>

                    {/* Store Section */}
                    <div className="footer__column">
                        <h4 className="footer__column-title">CỬA HÀNG</h4>
                        <ul className="footer__list">
                            <li><a href="/new-arrivals">Hàng mới về</a></li>
                            <li><a href="/best-sellers">Sản phẩm bán chạy</a></li>
                            <li><a href="/honey">Mật</a></li>
                            <li><a href="/new">Mới</a></li>
                            <li><a href="/honey-2">Mật</a></li>
                            <li><a href="/gifts">Bộ quà tặng</a></li>
                        </ul>
                    </div>

                    {/* About Section */}
                    <div className="footer__column">
                        <h4 className="footer__column-title">VỀ CHÚNG TÔI</h4>
                        <ul className="footer__list">
                            <li><a href="/our-story">Câu chuyện thương hiệu</a></li>
                            <li><a href="/team">Thành phần</a></li>
                            <li><a href="/events">Sự kiện vàng</a></li>
                            <li><a href="/recruitment">Tuyển dụng</a></li>
                            <li><a href="/press">Báo chí</a></li>
                        </ul>
                    </div>

                    {/* Customer Care Section */}
                    <div className="footer__column">
                        <h4 className="footer__column-title">CHĂM SÓC KHÁCH HÀNG</h4>
                        <ul className="footer__list">
                            <li><a href="/contact">Liên hệ</a></li>
                            <li><a href="/shipping">Vận chuyển & Đổi trả</a></li>
                            <li><a href="/faq">Câu hỏi thường gặp</a></li>
                            <li><a href="/stores">Tìm cửa hàng</a></li>
                            <li><a href="/support">Trợ năng</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="footer__bottom">
                    <div className="footer__social">
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M6.29 18.25c7.55 0 11.67-6.25 11.67-11.67v-.53c.8-.59 1.49-1.3 2.04-2.13-.75.33-1.54.55-2.36.65a4.12 4.12 0 0 0 1.8-2.27c-.8.48-1.68.81-2.6 1a4.1 4.1 0 0 0-7 3.74 11.65 11.65 0 0 1-8.45-4.3 4.1 4.1 0 0 0 1.27 5.49C2.01 8.2 1.37 8.03.8 7.7v.05a4.1 4.1 0 0 0 3.3 4.03 4.1 4.1 0 0 1-1.86.07 4.1 4.1 0 0 0 3.83 2.85A8.23 8.23 0 0 1 0 16.4a11.62 11.62 0 0 0 6.29 1.84" />
                            </svg>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 0C7.28 0 6.94 0 5.88 0.05 4.82 0.1 4.07 0.28 3.42 0.53 2.74 0.79 2.14 1.17 1.61 1.7 1.08 2.23 0.7 2.83 0.44 3.51 0.19 4.16 0.01 4.91 0.01 5.97 0.01 7.03 0.01 7.37 0.01 10.09 0.01 12.81 0.01 13.15 0.06 14.21 0.11 15.27 0.29 16.02 0.54 16.67 0.8 17.35 1.18 17.95 1.71 18.48 2.24 19.01 2.84 19.39 3.52 19.65 4.17 19.9 4.92 20.08 5.98 20.08 7.04 20.13 7.38 20.13 10.1 20.13 12.82 20.13 13.16 20.08 14.22 20.03 15.28 19.85 16.03 19.6 16.68 19.34 17.36 18.96 17.96 18.43 18.49 17.9 19.02 17.3 19.4 16.62 19.66 15.97 19.91 15.32 20.09 14.26 20.09 13.2 20.14 12.86 20.14 10.14 20.14 7.42 20.14 7.08 20.09 6.02 20.04 4.96 19.86 4.21 19.61 3.56 19.35 2.88 18.97 2.28 18.44 1.75 17.91 1.22 17.31 0.84 16.63 0.58 15.98 0.33 15.33 0.15 14.27 0.15 13.21 0.1 12.87 0.1 10.15 0.1 7.43 0.1 7.09 0.15 6.03 0.2 4.97 0.38 4.22 0.63 3.57 0.89 2.89 1.27 2.29 1.8 1.76 2.33 1.23 2.93 0.85 3.61 0.59 4.26 0.34 4.91 0.16 5.97 0.16 7.03 0.11 7.37 0.11 10.09 0.11" />
                                <circle cx="10" cy="10" r="3.2" />
                                <circle cx="15.4" cy="4.6" r="1" />
                            </svg>
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" />
                            </svg>
                        </a>
                    </div>

                    <div className="footer__copyright">
                        <p>© 2024 LUMIÈRE Cosmetics</p>
                        <div className="footer__links">
                            <a href="/privacy">Chính sách bảo mật</a>
                            <a href="/terms">Điều khoản sử dụng</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;