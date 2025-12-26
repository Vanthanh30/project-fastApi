import React, { useState } from 'react';
import LayoutDefault from '../layout_default/layout_default';
import './cart.scss';

const Cart = () => {
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: 'VELVET MATTE LIPSTICK',
            category: 'Son Thỏi Cao Cấp',
            color: 'Màu Nude Quyến Rũ',
            price: 950000,
            quantity: 1,
            image: '/products/lipstick.jpg'
        },
        {
            id: 2,
            name: 'AMBIENT SOFT GLOW FOUNDATION',
            category: 'Kem Nền',
            color: 'Màu Tự Nhiên',
            price: 1200000,
            quantity: 1,
            image: '/products/foundation.jpg'
        }
    ]);

    const recommendedProducts = [
        {
            id: 1,
            name: 'Ambient Lighting Palette',
            price: '1,650,000₫',
            image: '/products/palette.jpg'
        },
        {
            id: 2,
            name: 'Unlocked Mascara',
            price: '695,000₫',
            image: '/products/mascara.jpg'
        },
        {
            id: 3,
            name: 'Sublime Flush Blush',
            price: '1,100,000₫',
            image: '/products/blush.jpg'
        }
    ];

    const updateQuantity = (id, delta) => {
        setCartItems(cartItems.map(item => {
            if (item.id === id) {
                const newQuantity = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const removeItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN') + '₫';
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 0; // Miễn phí
    const tax = 0; // Đã bao gồm
    const total = subtotal + shipping + tax;

    return (
        <LayoutDefault>
            <div className="cart">
                <div className="container">
                    <div className="cart__header">
                        <h1 className="cart__title">GIỎ HÀNG</h1>
                        <p className="cart__count">({cartItems.length} mặt hàng trong giỏ của bạn)</p>
                    </div>

                    <div className="cart__content">
                        {/* Cart Items */}
                        <div className="cart__items">
                            {cartItems.length === 0 ? (
                                <div className="cart__empty">
                                    <p>Giỏ hàng của bạn đang trống</p>
                                    <a href="/products" className="cart__shop-btn">Tiếp tục mua sắm</a>
                                </div>
                            ) : (
                                <>
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="cart-item">
                                            <button
                                                className="cart-item__remove"
                                                onClick={() => removeItem(item.id)}
                                                aria-label="Xóa sản phẩm"
                                            >
                                                ×
                                            </button>

                                            <div className="cart-item__image">
                                                <div className="cart-item__image-placeholder"></div>
                                            </div>

                                            <div className="cart-item__details">
                                                <h3 className="cart-item__name">{item.name}</h3>
                                                <p className="cart-item__category">{item.category}</p>
                                                <p className="cart-item__color">{item.color}</p>

                                                <div className="cart-item__actions">
                                                    <div className="cart-item__quantity">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, -1)}
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            −
                                                        </button>
                                                        <span>{item.quantity}</span>
                                                        <button onClick={() => updateQuantity(item.id, 1)}>
                                                            +
                                                        </button>
                                                    </div>

                                                    <p className="cart-item__price">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                        {cartItems.length > 0 && (
                            <div className="cart__summary">
                                <h2 className="cart__summary-title">TÓM TẮT ĐỚN HÀNG</h2>

                                <div className="cart__summary-row">
                                    <span>Tạm tính</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>

                                <div className="cart__summary-row">
                                    <span>Vận chuyển</span>
                                    <span className="cart__summary-free">Miễn phí</span>
                                </div>

                                <div className="cart__summary-row">
                                    <span>Thuế</span>
                                    <span className="cart__summary-included">Đã bao gồm</span>
                                </div>

                                <div className="cart__summary-divider"></div>

                                <div className="cart__summary-row cart__summary-discount">
                                    <span>Mã giảm giá</span>
                                    <span className="cart__summary-apply">Áp dụng</span>
                                </div>

                                <div className="cart__summary-divider"></div>

                                <div className="cart__summary-row cart__summary-total">
                                    <span>TỔNG CỘNG</span>
                                    <span>{formatPrice(total)}</span>
                                </div>

                                <p className="cart__summary-note">
                                    (Khuyến mại sẽ được cập nhật sau khi thanh toán)
                                </p>

                                <button className="cart__checkout-btn">
                                    TIẾN HÀNH THANH TOÁN →
                                </button>

                                <div className="cart__payment-methods">
                                    <img src="/icons/payment-1.svg" alt="Payment" />
                                    <img src="/icons/payment-2.svg" alt="Payment" />
                                    <img src="/icons/payment-3.svg" alt="Payment" />
                                    <img src="/icons/payment-4.svg" alt="Payment" />
                                </div>

                                <p className="cart__security">
                                    🔒 Thanh toán bảo mật 100%
                                </p>
                            </div>
                        )}
                    </div>
                    {cartItems.length > 0 && (
                        <section className="cart__recommended">
                            <h2 className="cart__recommended-title">CÓ THỂ BẠN SẼ THÍCH</h2>

                            <div className="cart__recommended-grid">
                                {recommendedProducts.map((product) => (
                                    <div key={product.id} className="recommended-card">
                                        <div className="recommended-card__image">
                                            <div className="recommended-card__image-placeholder"></div>
                                        </div>
                                        <h3 className="recommended-card__name">{product.name}</h3>
                                        <p className="recommended-card__price">{product.price}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </LayoutDefault>
    );
};

export default Cart;