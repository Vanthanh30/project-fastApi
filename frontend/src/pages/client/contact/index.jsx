import React, { useState } from 'react';
import LayoutDefault from '../layout_default/layout_default';
import './contact.scss';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Xử lý gửi form ở đây
        alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.');
        // Reset form
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
        });
    };

    return (
        <LayoutDefault>
            <div className="contact">
                <div className="container">
                    <div className="contact__content">
                        {/* Left Side - Contact Form */}
                        <div className="contact__form-section">
                            <h1 className="contact__title">LIÊN HỆ CHÚNG TÔI</h1>
                            <p className="contact__subtitle">
                                Chúng tôi luôn sẵn sàng lắng nghe, Hãy gửi câu hỏi hoặc nhận xét của bạn về
                                sản phẩm và dịch vụ của chúng tôi trả lời nhanh chóng tới bạn
                            </p>

                            <form className="contact__form" onSubmit={handleSubmit}>
                                <div className="contact__form-row">
                                    <div className="contact__form-group">
                                        <label htmlFor="name">HỌ VÀ TÊN</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            placeholder="Nhập họ và tên của bạn"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="contact__form-group">
                                        <label htmlFor="email">EMAIL</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="Nhập địa chỉ email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="contact__form-group">
                                    <label htmlFor="subject">CHỦ ĐỀ</label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Chọn chủ đề liên hệ</option>
                                        <option value="product">Thắc mắc về sản phẩm</option>
                                        <option value="order">Đơn hàng & Vận chuyển</option>
                                        <option value="warranty">Bảo hành & Đổi trả</option>
                                        <option value="cooperation">Hợp tác kinh doanh</option>
                                        <option value="other">Khác</option>
                                    </select>
                                </div>

                                <div className="contact__form-group">
                                    <label htmlFor="message">NỘI DUNG TIN NHẮN</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows="6"
                                        placeholder="Viết tin nhắn của bạn ở đây"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>

                                <button type="submit" className="contact__submit-btn">
                                    GỬI TIN NHẮN →
                                </button>
                            </form>
                        </div>

                        {/* Right Side - Contact Info & Map */}
                        <div className="contact__info-section">
                            <div className="contact__info-card">
                                <h2 className="contact__info-title">THÔNG TIN LIÊN HỆ</h2>

                                <div className="contact__info-item">
                                    <div className="contact__info-icon">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                            <circle cx="12" cy="10" r="3" />
                                        </svg>
                                    </div>
                                    <div className="contact__info-content">
                                        <h3>ĐỊA CHỈ SHOWROOM</h3>
                                        <p>Tầng 1, Saigon Centre,<br />
                                            65 Lê Lợi, Quận 1, TP. HCM<br />
                                            Quận 1, TP Hồ Chí Minh</p>
                                    </div>
                                </div>

                                <div className="contact__info-item">
                                    <div className="contact__info-icon">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                        </svg>
                                    </div>
                                    <div className="contact__info-content">
                                        <h3>HOTLINE</h3>
                                        <p>1900 888 999<br />
                                            Thứ Hai - Thứ Sáu: 9:00 - 22:00</p>
                                    </div>
                                </div>

                                <div className="contact__info-item">
                                    <div className="contact__info-icon">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                            <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                    </div>
                                    <div className="contact__info-content">
                                        <h3>EMAIL HỖ TRỢ</h3>
                                        <p>support@lumierevietnam.vn</p>
                                    </div>
                                </div>
                            </div>

                            {/* Map */}
                            <div className="contact__map">
                                <div className="contact__map-placeholder">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    <p>Xem bản đồ</p>
                                </div>
                            </div>

                            {/* Store Hours */}
                            <div className="contact__hours">
                                <div className="contact__hours-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                </div>
                                <div className="contact__hours-content">
                                    <h3>Bạn có câu hỏi về thời gian?</h3>
                                    <p>Showroom của chúng tôi mở cửa 7 ngày trong tuần: 9:00 - 21:30 →</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutDefault>
    );
};

export default Contact;