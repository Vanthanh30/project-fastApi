import React, { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LayoutDefault from "../layout_default/layout_default";
import cartService from "../../../service/client/cartService";
import ProductService from "../../../service/client/productService";
import "./cart.scss";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const navigate = useNavigate();

    // Gray placeholder SVG
    const grayPlaceholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120"%3E%3Crect width="120" height="120" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E';

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await cartService.getCart();
            console.log("Cart response:", res); // Debug: xem structure của response
            setCartItems(Array.isArray(res.items) ? res.items : []);
        } catch (error) {
            console.error("Fetch cart failed:", error);
            setCartItems([]);
        }
    };

    const toggleSelectItem = (id) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === cartItems.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(cartItems.map(item => item.id));
        }
    };

    const updateQuantity = async (itemId, delta, currentQty) => {
        const newQty = Math.max(1, currentQty + delta);
        try {
            await cartService.updateCartItem(itemId, newQty);
            fetchCart();
        } catch (error) {
            console.error("Update quantity failed:", error);
        }
    };

    const removeItem = async (itemId) => {
        try {
            await cartService.deleteCartItem(itemId);
            setSelectedIds(prev => prev.filter(id => id !== itemId));
            fetchCart();
        } catch (error) {
            console.error("Remove item failed:", error);
        }
    };

    const formatPrice = (price) =>
        Number(price).toLocaleString("vi-VN") + "₫";

    // Helper function to get image URL with better fallback logic
    const getImageUrl = (item) => {
        // Backend now returns 'image' field directly in CartItemResponse
        const imagePath = item.image;

        if (!imagePath || imagePath === 'null' || imagePath === 'NULL') {
            return grayPlaceholder;
        }

        return ProductService.getImageUrl(imagePath);
    };

    // Helper function to get product name
    const getProductName = (item) => {
        return item.name || 'Sản phẩm';
    };

    const subtotal = cartItems
        .filter(item => selectedIds.includes(item.id))
        .reduce((sum, item) => sum + item.price * item.quantity, 0);

    const shipping = 0;
    const tax = 0;
    const total = subtotal + shipping + tax;

    return (
        <LayoutDefault>
            <div className="cart">
                <div className="container">
                    <div className="cart__header">
                        <h1 className="cart__title">GIỎ HÀNG</h1>
                        <p className="cart__count">
                            ({cartItems.length} mặt hàng trong giỏ của bạn)
                        </p>
                    </div>

                    <div className="cart__content">
                        <div className="cart__items">
                            {cartItems.length === 0 ? (
                                <div className="cart__empty">
                                    <p>Giỏ hàng của bạn đang trống</p>
                                    <a href="/products" className="cart__shop-btn">
                                        Tiếp tục mua sắm
                                    </a>
                                </div>
                            ) : (
                                <>
                                    <label style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                                        <input
                                            type="checkbox"
                                            checked={
                                                cartItems.length > 0 &&
                                                selectedIds.length === cartItems.length
                                            }
                                            onChange={toggleSelectAll}
                                        />
                                        Chọn tất cả
                                    </label>
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="cart-item">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(item.id)}
                                                onChange={() => toggleSelectItem(item.id)}
                                                style={{ marginRight: 8 }}
                                            />
                                            <button
                                                className="cart-item__remove"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                ×
                                            </button>

                                            <div className="cart-item__image">
                                                <img
                                                    src={getImageUrl(item)}
                                                    alt={getProductName(item)}
                                                    onError={(e) => {
                                                        e.target.src = grayPlaceholder;
                                                    }}
                                                />
                                            </div>

                                            <div className="cart-item__details">
                                                <h3 className="cart-item__name">
                                                    {getProductName(item)}
                                                </h3>

                                                <div className="cart-item__actions">
                                                    <div className="cart-item__quantity">
                                                        <button
                                                            disabled={item.quantity <= 1}
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.id,
                                                                    -1,
                                                                    item.quantity
                                                                )
                                                            }
                                                        >
                                                            −
                                                        </button>
                                                        <span>{item.quantity}</span>
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.id,
                                                                    1,
                                                                    item.quantity
                                                                )
                                                            }
                                                        >
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
                                <h2 className="cart__summary-title">
                                    TÓM TẮT ĐƠN HÀNG
                                </h2>

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

                                <div className="cart__summary-divider" />

                                <div className="cart__summary-row cart__summary-total">
                                    <span>TỔNG CỘNG</span>
                                    <span>{formatPrice(total)}</span>
                                </div>

                                <p className="cart__summary-note">
                                    (Khuyến mại sẽ được cập nhật sau khi thanh toán)
                                </p>

                                <button
                                    onClick={() => {
                                        if (selectedIds.length === 0) {
                                            alert("Vui lòng chọn ít nhất 1 sản phẩm để thanh toán");
                                            return;
                                        }
                                        // Pass selected items to payment page
                                        const selectedItems = cartItems.filter(item =>
                                            selectedIds.includes(item.id)
                                        );
                                        navigate('/payment', {
                                            state: {
                                                selectedItems,
                                                total
                                            }
                                        });
                                    }}
                                    className="cart__checkout-btn"
                                    disabled={selectedIds.length === 0}
                                >
                                    TIẾN HÀNH THANH TOÁN →
                                </button>

                                <p className="cart__security">
                                    <ShieldCheck size={16} />
                                    <span>Thanh toán bảo mật 100%</span>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </LayoutDefault>
    );
};

export default Cart;