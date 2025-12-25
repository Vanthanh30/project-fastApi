import React from 'react';
import LayoutDefault from '../layout_default/layout_default';
import './home.scss';

const Home = () => {
    const featuredProducts = [
        {
            id: 1,
            name: 'Kem Nền Ambient Soft Glow',
            category: 'Kem nền dưỡng da',
            price: '1,650,000',
            tag: 'MỚI NHẤT',
            image: '/products/foundation.jpg'
        },
        {
            id: 2,
            name: 'Son Thỏi Lì Velvet Matte',
            category: 'Son thỏi cao cấp',
            price: '950,000',
            tag: null,
            image: '/products/lipstick.jpg'
        },
        {
            id: 3,
            name: 'Mascara Caution Extreme Lash',
            category: 'Dưỡng mi dài',
            price: '730,000',
            tag: null,
            image: '/products/mascara.jpg'
        },
        {
            id: 4,
            name: 'Phấn Má Hồng Ambient',
            category: 'Phấn má phun sương',
            price: '1,125,000',
            tag: null,
            image: '/products/blush.jpg'
        }
    ];

    const seasonalProducts = [
        {
            id: 1,
            category: 'MẶT',
            title: 'Làm Nền',
            description: 'Lớp nền hoàn hảo cho làn da rạng rỡ',
            image: '/seasonal/face.jpg'
        },
        {
            id: 2,
            category: 'MÔI',
            title: 'Màu Hồng',
            description: 'Sắc màu quyến rũ bền lâu',
            image: '/seasonal/lips.jpg'
        },
        {
            id: 3,
            category: 'MẮT',
            title: 'Màu Nâu',
            description: 'Làm nổi bật đôi mắt của bạn',
            image: '/seasonal/eyes.jpg'
        }
    ];

    return (
        <LayoutDefault>
            <div className="home">
                {/* Hero Section */}
                <section className="hero">
                    <div className="hero__image-bg"></div>
                    <div className="hero__content">
                        <p className="hero__label">BỘ SƯU TẬP MỚI</p>
                        <h1 className="hero__title">CHẠM NHẸ<br />TỎA NHUNG</h1>
                        <p className="hero__description">
                            Trải nghiệm chạm mịn như nhung, từ má hồng, môi hồng đến trang điểm hoàn thiện. Tiếp tục câu chuyện trang điểm của bạn.
                        </p>
                        <button className="hero__cta">MUA BỘ SƯU TẬP</button>
                    </div>
                </section>

                {/* Featured Products Section */}
                <section className="featured">
                    <div className="container">
                        <div className="featured__header">
                            <h2 className="featured__title">TÌNH HOẠ BIỂU TƯỢNG</h2>
                            <p className="featured__subtitle">Những sản phẩm được yêu thích nhất, luôn chạy hàng đầu trên các bảng xếp hạng</p>
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
                                        <p className="product-card__category">{product.category}</p>
                                        <p className="product-card__price">{product.price}₫</p>
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
                                <span className="premium__label">THIẾT LÝ ĐỔA CHÚNG TÔI</span>
                                <h2 className="premium__title">Sang Trọng Thuần Khiết.<br />Đột Phá Khoa Học.</h2>
                                <p className="premium__description">
                                    LUMIÈRE ra đời từ niềm khao khát tạo nên một thương hiệu mỹ phẩm cao cấp không chỉ mang lại vẻ đẹp ngoại hình mà còn nuôi dưỡng làn da từ sâu bên trong. Chúng tôi tin rằng vẻ đẹp thực sự đến từ sự tự tin và sức khỏe làn da được chăm sóc tận tâm.
                                </p>
                                <button className="premium__cta">ĐỌC CÂU CHUYỆN CỦA CHÚNG TÔI</button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Seasonal Collection */}
                <section className="seasonal">
                    <div className="container">
                        <div className="seasonal__header">
                            <h2 className="seasonal__title">MUA SẮM THEO DANH MỤC</h2>
                            <p className="seasonal__subtitle">
                                Khám phá các sản phẩm trang điểm nguyên tắc. Sản phẩm của chúng tôi được nghiên cứu kỹ lưỡng và kiểm định nghiêm ngặt để đem lại trải nghiệm hoàn hảo.
                            </p>
                        </div>

                        <div className="seasonal__grid">
                            {seasonalProducts.map((item) => (
                                <div key={item.id} className="seasonal-card">
                                    <div className="seasonal-card__image">
                                        <div className="seasonal-card__image-placeholder"></div>
                                        <div className="seasonal-card__overlay">
                                            <div className="seasonal-card__text">
                                                <h3 className="seasonal-card__category">{item.category}</h3>
                                                <p className="seasonal-card__title">{item.title}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </LayoutDefault>
    );
};

export default Home;