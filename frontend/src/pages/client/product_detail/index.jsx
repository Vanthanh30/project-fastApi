import React, { useState } from 'react';
import LayoutDefault from '../layout_default/layout_default';
import ChatboxAI from '../../../components/Chatbox/ChatboxAI';
import './product_detail.scss';

const ProductDetail = () => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedShade, setSelectedShade] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const product = {
        name: 'Ambient Soft Glow Foundation',
        code: 'Lady2603',
        price: '1.480.000',
        rating: 4.8,
        reviewCount: 1204,
        shades: [
            { id: 1, name: 'Fair', color: '#f5d5c0' },
            { id: 2, name: 'Light', color: '#ecc8a8' },
            { id: 3, name: 'Medium', color: '#d4a788' },
            { id: 4, name: 'Tan', color: '#c49270' },
            { id: 5, name: 'Deep', color: '#8b6650' },
            { id: 6, name: 'Deeper', color: '#5d4037' }
        ],
        description: 'Kem nền cao cấp với công thức tiên tiến giúp da mịn màng tự nhiên. Độ che phủ hoàn hảo, bền màu suốt cả ngày mà không gây bít tắc lỗ chân lông. Phù hợp với mọi loại da.',
        images: [
            '/products/foundation-1.jpg',
            '/products/foundation-2.jpg',
            '/products/foundation-3.jpg'
        ],
        features: [
            'Độ che phủ cao',
            'Không gây bít tắc lỗ chân lông',
            'Bền màu suốt 24h',
            'Chống nước và mồ hôi',
            'SPF 30+ PA+++'
        ],
        ingredients: 'Water, Cyclopentasiloxane, Titanium Dioxide, Dimethicone, PEG-10 Dimethicone...',
        howToUse: 'Lấy một lượng vừa đủ, chấm đều lên các điểm trên khuôn mặt (trán, má, mũi, cằm). Dùng bông mút hoặc cọ tán đều từ trong ra ngoài.'
    };

    const reviews = [
        {
            id: 1,
            title: 'Chán ái mới của tôi!',
            author: 'SARAH M.',
            rating: 5,
            date: '2 ngày trước',
            content: 'Tôi đã tìm kiếm một loại kem nền che được vết đỏ mà không bị đầy phấn, và đây chính là nó. Nó tiếp vào da và mang lại độ bóng đẹp. Pát: khuyến khích!',
            helpful: 24,
            verified: true
        },
        {
            id: 2,
            title: 'Lớp nền tuyệt vời nhưng giá cao',
            author: 'JESSICA K.',
            rating: 5,
            date: '1 tuần trước',
            content: 'Lớp nền thực sự tuyệt đẹp, rất giống da thật. Nó bám rất ngày trên da và da hấp của tôi. Tôi thử một sao chi vi giá cũ, nhưng nó thực sự là món sản phẩm sang trọng.',
            helpful: 18,
            verified: true
        }
    ];

    const relatedProducts = [
        {
            id: 1,
            name: 'Ambient Lighting Blush',
            category: 'Làm hồng nà đá',
            price: '946.00',
            image: '/products/blush.jpg'
        },
        {
            id: 2,
            name: 'Caution Extreme Lash Mascara',
            category: 'Chống trôi',
            price: '629.00',
            image: '/products/mascara.jpg'
        },
        {
            id: 3,
            name: 'Velvet Matte Lipstick',
            category: 'Kô lên màu thật',
            price: '538.00',
            image: '/products/lipstick-1.jpg'
        },
        {
            id: 4,
            name: 'Ambient Lighting Powder',
            category: 'Phấn phủ hoàn thiện',
            price: '854.00',
            image: '/products/powder.jpg'
        }
    ];

    const handleQuantityChange = (type) => {
        if (type === 'increment') {
            setQuantity(prev => prev + 1);
        } else if (type === 'decrement' && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleAddToCart = () => {
        console.log('Add to cart:', { product, selectedShade, quantity });
        // Add to cart logic here
    };

    return (
        <LayoutDefault>
            <div className="product-detail">
                <div className="container">
                    {/* Breadcrumb */}
                    <div className="breadcrumb">
                        <a href="/">Trang chủ</a>
                        <span>/</span>
                        <a href="/products">Sản phẩm</a>
                        <span>/</span>
                        <span>{product.name}</span>
                    </div>

                    {/* Product Main Section */}
                    <div className="product-detail__main">
                        {/* Image Gallery */}
                        <div className="product-detail__gallery">
                            <div className="product-detail__main-image">
                                <div className="product-detail__main-image-placeholder"></div>
                            </div>
                            <div className="product-detail__thumbnails">
                                {[0, 1, 2].map((index) => (
                                    <div
                                        key={index}
                                        className={`product-detail__thumbnail ${selectedImage === index ? 'active' : ''}`}
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        <div className="product-detail__thumbnail-placeholder"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="product-detail__info">
                            <h1 className="product-detail__name">{product.name}</h1>

                            <div className="product-detail__price-row">
                                <div className="product-detail__price">{product.price}₫</div>
                                <div className="product-detail__rating">
                                    <div className="product-detail__stars">
                                        {'★★★★★'.split('').map((star, index) => (
                                            <span
                                                key={index}
                                                className={index < Math.floor(product.rating) ? 'active' : ''}
                                            >
                                                {star}
                                            </span>
                                        ))}
                                    </div>
                                    <span className="product-detail__rating-text">
                                        {product.rating} ({product.reviewCount.toLocaleString('vi-VN')} Đánh giá)
                                    </span>
                                </div>
                            </div>

                            <p className="product-detail__description">{product.description}</p>

                            {/* Shade Selection */}
                            <div className="product-detail__shades">
                                <label className="product-detail__label">
                                    TÔNG MÀU
                                    <span className="product-detail__label-hint">
                                        Bạn chọn: {selectedShade ? product.shades.find(s => s.id === selectedShade)?.name : '3.5 Medium Neutral'}
                                    </span>
                                </label>
                                <div className="product-detail__shade-list">
                                    {product.shades.map((shade) => (
                                        <div
                                            key={shade.id}
                                            className={`product-detail__shade ${selectedShade === shade.id ? 'active' : ''}`}
                                            onClick={() => setSelectedShade(shade.id)}
                                            style={{ backgroundColor: shade.color }}
                                            title={shade.name}
                                        >
                                            {selectedShade === shade.id && (
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                                                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                                                </svg>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="product-detail__shade-actions">
                                    <button className="product-detail__shade-action-btn">
                                        TÌM TÔNG MÀU CỦA BẠN
                                    </button>
                                    <button className="product-detail__shade-action-btn">
                                        XEM MẪU THỬ
                                    </button>
                                </div>
                            </div>

                            {/* Quantity */}
                            <div className="product-detail__quantity-section">
                                <div className="product-detail__quantity">
                                    <button
                                        className="product-detail__quantity-btn"
                                        onClick={() => handleQuantityChange('decrement')}
                                    >
                                        −
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="product-detail__quantity-input"
                                    />
                                    <button
                                        className="product-detail__quantity-btn"
                                        onClick={() => handleQuantityChange('increment')}
                                    >
                                        +
                                    </button>
                                </div>
                                <button className="product-detail__buy-btn" onClick={handleAddToCart}>
                                    THÊM VÀO GIỎ - {(parseFloat(product.price.replace(/\./g, '')) * quantity).toLocaleString('vi-VN')}₫
                                </button>
                                <button className="product-detail__wishlist-btn">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M10 18.35l-1.45-1.32C3.4 12.36 0 9.28 0 5.5 0 2.42 2.42 0 5.5 0 7.24 0 8.91.81 10 2.09 11.09.81 12.76 0 14.5 0 17.58 0 20 2.42 20 5.5c0 3.78-3.4 6.86-8.55 11.54L10 18.35z" fill="currentColor" />
                                    </svg>
                                </button>
                            </div>

                            {/* Collapsible Sections */}
                            <div className="product-detail__accordion">
                                <details open>
                                    <summary>MÔ TÃ</summary>
                                    <div className="product-detail__accordion-content">
                                        <p>{product.description}</p>
                                        <ul className="product-detail__features-list">
                                            {product.features.map((feature, index) => (
                                                <li key={index}>{feature}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </details>
                                <details>
                                    <summary>CÁCH SỬ DỤNG</summary>
                                    <div className="product-detail__accordion-content">
                                        <p>{product.howToUse}</p>
                                    </div>
                                </details>
                                <details>
                                    <summary>THÀNH PHẦN</summary>
                                    <div className="product-detail__accordion-content">
                                        <p>{product.ingredients}</p>
                                        <a href="#" className="product-detail__read-more">Đọc thêm →</a>
                                    </div>
                                </details>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <section className="product-detail__reviews">
                        <div className="product-detail__reviews-header">
                            <h2>ĐÁNH GIÁ</h2>
                            <div className="product-detail__reviews-summary">
                                <div className="product-detail__reviews-stars-display">
                                    {'★★★★★'.split('').map((star, index) => (
                                        <span key={index} className={index < Math.floor(product.rating) ? 'active' : ''}>
                                            {star}
                                        </span>
                                    ))}
                                </div>
                                <div className="product-detail__reviews-rating-number">{product.rating}</div>
                                <div className="product-detail__reviews-count">
                                    Dựa trên {product.reviewCount.toLocaleString('vi-VN')} Đánh giá
                                </div>
                                <button className="product-detail__write-review">VIẾT ĐÁNH GIÁ</button>
                            </div>
                        </div>

                        <div className="product-detail__reviews-list">
                            {reviews.map((review) => (
                                <div key={review.id} className="product-detail__review">
                                    <div className="product-detail__review-header">
                                        <div>
                                            <div className="product-detail__review-title">{review.title}</div>
                                            <div className="product-detail__review-stars">
                                                {'★★★★★'.split('').map((star, index) => (
                                                    <span key={index} className={index < review.rating ? 'active' : ''}>
                                                        {star}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <span className="product-detail__review-date">{review.date}</span>
                                    </div>
                                    <p className="product-detail__review-content">{review.content}</p>
                                    <div className="product-detail__review-footer">
                                        <div className="product-detail__review-author">
                                            {review.author}
                                            {review.verified && (
                                                <span className="product-detail__review-verified">NGƯỜI MUA ĐÃ XÁC THỰC</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="product-detail__load-more">TẢI THÊM ĐÁNH GIÁ</button>
                    </section>

                    {/* Related Products */}
                    <section className="product-detail__related">
                        <div className="product-detail__related-header">
                            <div>
                                <h2>HOÀN THIỆN LỚP TRANG ĐIỂM</h2>
                                <p>Sự kết hợp hoàn hảo cho lớp nền trang điểm lý tưởng.</p>
                            </div>
                            <a href="/products" className="product-detail__related-link">XEM TẤT CẢ →</a>
                        </div>
                        <div className="product-detail__related-grid">
                            {relatedProducts.map((item) => (
                                <div key={item.id} className="product-detail__related-item">
                                    <div className="product-detail__related-image">
                                        <div className="product-detail__related-image-placeholder"></div>
                                    </div>
                                    <h3 className="product-detail__related-name">{item.name}</h3>
                                    <p className="product-detail__related-category">{item.category}</p>
                                    <p className="product-detail__related-price">{item.price}₫</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
            <ChatboxAI />
        </LayoutDefault>
    );
};

export default ProductDetail;