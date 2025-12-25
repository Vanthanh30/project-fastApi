import React from 'react';
import LayoutDefault from '../layout_default/layout_default'; // Giống hệt Cart
import './help.scss';

const Help = () => {
    return (
        <LayoutDefault>
            <div className="help-page">
                {/* Hero Section - Banner lớn với background wave nâu */}
                <section className="hero-section">
                    <div className="hero-bg"></div>
                    <div className="hero-content">
                        <h1>Trung tâm trợ giúp</h1>
                        <p>Chúng tôi có thể giúp gì cho bạn hôm nay?</p>
                        <div className="search-wrapper">
                            <div className="search-input-wrapper">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm câu trả lời (ví dụ: đổi trả, vận chuyển)..."
                                />
                            </div>
                            <button className="search-btn">Tìm kiếm</button>
                        </div>
                    </div>
                </section>

                {/* Duyệt theo chủ đề */}
                <section className="browse-section">
                    <div className="container">
                        <div className="section-header">
                            <h2>Duyệt theo chủ đề</h2>
                            <div className="category-tabs">
                                <button className="tab-btn active">Câu hỏi chung</button>
                                <button className="tab-btn">Vận chuyển</button>
                                <button className="tab-btn">Đổi trả & Hoàn tiền</button>
                                <button className="tab-btn">Sản phẩm & Thanh toán</button>
                                <button className="tab-btn">Tài khoản</button>
                            </div>
                        </div>

                        <div className="category-group">
                            <h3>Vận chuyển & Giao hàng</h3>
                            <div className="question-item">
                                <span>Đơn hàng của tôi bao lâu thì đến nơi?</span>
                                <svg className="chevron" viewBox="0 0 24 24">
                                    <path d="M7 10l5 5 5-5z" />
                                </svg>
                            </div>
                            <div className="question-item">
                                <span>Phí vận chuyển được tính như thế nào?</span>
                                <svg className="chevron" viewBox="0 0 24 24">
                                    <path d="M7 10l5 5 5-5z" />
                                </svg>
                            </div>
                            <div className="question-item">
                                <span>Tôi có thể theo dõi đơn hàng của mình không?</span>
                                <svg className="chevron" viewBox="0 0 24 24">
                                    <path d="M7 10l5 5 5-5z" />
                                </svg>
                            </div>
                        </div>

                        <div className="category-group">
                            <h3>Sản phẩm & Thanh toán</h3>
                            <div className="question-item">
                                <span>Sản phẩm của Lumière có thử nghiệm trên động vật không?</span>
                                <svg className="chevron" viewBox="0 0 24 24">
                                    <path d="M7 10l5 5 5-5z" />
                                </svg>
                            </div>
                            <div className="question-item">
                                <span>Sản phẩm có an toàn cho da nhạy cảm không?</span>
                                <svg className="chevron" viewBox="0 0 24 24">
                                    <path d="M7 10l5 5 5-5z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="contact-section">
                    <div className="container">
                        <div className="contact-card">
                            <h3>Không tìm thấy câu trả lời bạn cần?</h3>
                            <p>Đội ngũ hỗ trợ khách hàng của chúng tôi luôn sẵn sàng giúp đỡ.</p>
                            <div className="contact-actions">
                                <button className="email-btn">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                    </svg>
                                    Gửi Email
                                </button>
                                <button className="chat-btn">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M20 2H4c-1.1 0-1 1-1 2v12c0 1 .9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                                    </svg>
                                    Chat Ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </LayoutDefault>
    );
};

export default Help;