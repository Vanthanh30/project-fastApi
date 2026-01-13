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
                        <h3 className="footer__title">MỞ KHÓA ĐẶC QUYỀN</h3>
                        <p className="footer__description">
                            Đăng ký để nhận ưu đãi giảm 15% cho đơn hàng đầu tiên và là người đầu tiên biết về các sản phẩm mới, ưu đãi độc quyền.
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
                            <li><a href="/new-arrivals">Hàng Mới Về</a></li>
                            <li><a href="/best-sellers">Bán Chạy Nhất</a></li>
                            <li><a href="/lips">Môi</a></li>
                            <li><a href="/eyes">Mắt</a></li>
                            <li><a href="/face">Mặt</a></li>
                            <li><a href="/gifts">Bộ Quà Tặng</a></li>
                        </ul>
                    </div>

                    {/* About Section */}
                    <div className="footer__column">
                        <h4 className="footer__column-title">VỀ CHÚNG TÔI</h4>
                        <ul className="footer__list">
                            <li><a href="/our-story">Câu Chuyện</a></li>
                            <li><a href="/ingredients">Thành Phần</a></li>
                            <li><a href="/events">Sự Kiện Vàng</a></li>
                            <li><a href="/careers">Tuyển Dụng</a></li>
                            <li><a href="/press">Báo Chí</a></li>
                        </ul>
                    </div>

                    {/* Customer Care Section */}
                    <div className="footer__column">
                        <h4 className="footer__column-title">CHĂM SÓC KHÁCH HÀNG</h4>
                        <ul className="footer__list">
                            <li><a href="/contact">Liên Hệ</a></li>
                            <li><a href="/shipping">Vận Chuyển & Đổi Trả</a></li>
                            <li><a href="/faq">Câu Hỏi Thường Gặp</a></li>
                            <li><a href="/stores">Tìm Cửa Hàng</a></li>
                            <li><a href="/accessibility">Trợ Năng</a></li>
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
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10z" />
                                <circle cx="12" cy="12" r="3.2" />
                                <circle cx="17.5" cy="6.5" r="1.2" />
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
                            <a href="/privacy">Chính Sách Bảo Mật</a>
                            <a href="/terms">Điều Khoản Sử Dụng</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;