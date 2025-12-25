import React from 'react';
import LayoutDefault from '../layout_default/layout_default';
import './home.scss';

const Home = () => {
    const featuredProducts = [
        {
            id: 1,
            name: 'Kem nền dưỡng ẩm SKIN 24H',
            price: '1,590,000',
            tag: 'MỚI NHẤT',
            image: '/products/foundation.jpg'
        },
        {
            id: 2,
            name: 'Son lì Velvet VENUS 01',
            price: '690,000',
            tag: null,
            image: '/products/lipstick.jpg'
        },
        {
            id: 3,
            name: 'Mascara dưỡng mi LASHKA LONG',
            price: '590,000',
            tag: null,
            image: '/products/mascara.jpg'
        },
        {
            id: 4,
            name: 'Phấn má hồng BLUSH LIGHT PRO',
            price: '790,000',
            tag: null,
            image: '/products/blush.jpg'
        }
    ];

    const seasonalProducts = [
        {
            id: 1,
            category: 'MẮT',
            title: 'Làm Nổi Bật Đôi Mắt',
            description: 'Bộ sưu tập makeup mắt hoàn hảo',
            image: '/seasonal/eyes.jpg'
        },
        {
            id: 2,
            category: 'MÔI',
            title: 'Sắc Môi Quyến Rũ',
            description: 'Bảng màu son đa dạng và bền màu',
            image: '/seasonal/lips.jpg'
        },
        {
            id: 3,
            category: 'MẶT',
            title: 'Làn Da Hoàn Hảo',
            description: 'Lớp nền mịn màng tự nhiên',
            image: '/seasonal/face.jpg'
        }
    ];

    return (
        <LayoutDefault>
            <div className="home">
                {/* Hero Section */}
                <section className="hero">
                    <div className="hero__overlay"></div>
                    <div className="hero__content">
                        <p className="hero__subtitle">BỘ SƯU TẬP MỚI</p>
                        <h1 className="hero__title">CHẠM NHẸ<br />TỎA NHUNG</h1>
                        <p className="hero__description">
                            Khám phá vẻ đẹp tự nhiên với bộ sưu tập mới nhất
                        </p>
                        <button className="hero__cta">KHÁM PHÁ NGAY</button>
                    </div>
                    <div className="hero__image">
                        <div className="hero__image-placeholder">
                            {/* Hero image with makeup model */}
                        </div>
                    </div>
                </section>

                {/* Featured Products Section */}
                <section className="featured">
                    <div className="container">
                        <div className="featured__header">
                            <h2 className="featured__title">TÌNH HỌA BIỂU TƯỢNG</h2>
                            <p className="featured__subtitle">Những sản phẩm được yêu thích nhất</p>
                            <a href="/products" className="featured__link">XEM TẤT CẢ →</a>
                        </div>

                        <div className="featured__grid">
                            {featuredProducts.map((product) => (
                                <div key={product.id} className="product-card">
                                    {product.tag && (
                                        <span className="product-card__tag">{product.tag}</span>
                                    )}
                                    <div className="product-card__image">
                                        <div className="product-card__image-placeholder"></div>
                                    </div>
                                    <div className="product-card__info">
                                        <h3 className="product-card__name">{product.name}</h3>
                                        <p className="product-card__price">{product.price}₫</p>
                                        <button className="product-card__btn">THÊM VÀO GIỎ</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Premium Section */}
                <section className="premium">
                    <div className="container">
                        <div className="premium__content">
                            <div className="premium__image">
                                <div className="premium__image-placeholder"></div>
                            </div>
                            <div className="premium__text">
                                <span className="premium__label">LUMIÈRE PREMIUM</span>
                                <h2 className="premium__title">Sang Trọng Thuần Khiết<br />Đột Phá Khoa Học</h2>
                                <p className="premium__description">
                                    Công nghệ tiên tiến kết hợp với thành phần thiên nhiên cao cấp,
                                    mang đến làn da hoàn hảo và rạng rỡ. Trải nghiệm sự khác biệt
                                    với dòng sản phẩm cao cấp của LUMIÈRE.
                                </p>
                                <button className="premium__cta">KHU CẤU PHẨM CÔNG NGHỆ</button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Seasonal Collection */}
                <section className="seasonal">
                    <div className="container">
                        <div className="seasonal__header">
                            <h2 className="seasonal__title">MÙA SẮM THEO DẠM NƯớC</h2>
                            <p className="seasonal__subtitle">
                                Khám phá những xu hướng makeup mới nhất và tạo nên phong cách riêng của bạn
                            </p>
                        </div>

                        <div className="seasonal__grid">
                            {seasonalProducts.map((item) => (
                                <div key={item.id} className="seasonal-card">
                                    <div className="seasonal-card__image">
                                        <div className="seasonal-card__image-placeholder"></div>
                                        <div className="seasonal-card__overlay">
                                            <span className="seasonal-card__category">{item.category}</span>
                                        </div>
                                    </div>
                                    <div className="seasonal-card__content">
                                        <h3 className="seasonal-card__title">{item.title}</h3>
                                        <p className="seasonal-card__description">{item.description}</p>
                                        <button className="seasonal-card__btn">KHÁM PHÁ</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Newsletter Section */}
                <section className="newsletter">
                    <div className="container">
                        <div className="newsletter__content">
                            <h2 className="newsletter__title">ĐĂNG KÝ NHẬN ƯU ĐÃI</h2>
                            <p className="newsletter__description">
                                Nhận ngay mã giảm giá 15% cho đơn hàng đầu tiên và cập nhật
                                những sản phẩm mới nhất từ LUMIÈRE
                            </p>
                            <form className="newsletter__form">
                                <input
                                    type="email"
                                    placeholder="Địa chỉ email của bạn"
                                    className="newsletter__input"
                                    required
                                />
                                <button type="submit" className="newsletter__submit">
                                    ĐĂNG KÝ NGAY
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </LayoutDefault>
    );
};

export default Home;