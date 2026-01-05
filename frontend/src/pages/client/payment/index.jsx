import React, { useState } from 'react';
import { ShieldCheck, MapPin, User, CreditCard, Banknote, Building2, Smartphone, Wallet } from 'lucide-react';
import LayoutDefault from '../layout_default/layout_default';
import './payment.scss';

const Payment = () => {
    // Mock data từ cart (trong thực tế sẽ lấy từ context/redux)
    const [cartItems] = useState([
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

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        district: '',
        ward: '',
        note: '',
        paymentMethod: 'cod'
    });

    const [errors, setErrors] = useState({});

    const cities = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ'];
    const paymentMethods = [
        {
            id: 'cod',
            name: 'Thanh toán khi nhận hàng (COD)',
            icon: Banknote,
            description: ''
        },
        {
            id: 'bank',
            name: 'Chuyển khoản ngân hàng',
            icon: Building2,
            description: '',
            logos: [
                { name: 'Vietcombank', image: '../src/assets/bank1.jpg' },
                { name: 'Techcombank', image: '../src/assets/bank2.png' },
                { name: 'VPBank', image: '../src/assets/bank3.jpg' },
                { name: 'BIDV', image: '../src/assets/bank4.jpg' }
            ]
        },
        {
            id: 'momo',
            name: 'Ví MoMo',
            image: '../src/assets/payment2.jpg',
            description: ''
        },
        {
            id: 'card',
            name: 'Thẻ tín dụng/ghi nợ',
            icon: CreditCard,
            description: '',
            logos: [
                { name: 'Visa', image: '../src/assets/payment1.jpg' },
                { name: 'Mastercard', image: '../src/assets/payment5.png' },
                { name: 'JCB', image: '../src/assets/payment6.png' }
            ]
        }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên';
        if (!formData.email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Vui lòng nhập số điện thoại';
        } else if (!/^[0-9]{10,11}$/.test(formData.phone)) {
            newErrors.phone = 'Số điện thoại không hợp lệ';
        }
        if (!formData.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ';
        if (!formData.city) newErrors.city = 'Vui lòng chọn tỉnh/thành phố';
        if (!formData.district.trim()) newErrors.district = 'Vui lòng nhập quận/huyện';
        if (!formData.ward.trim()) newErrors.ward = 'Vui lòng nhập phường/xã';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            console.log('Order submitted:', { formData, cartItems });
            // Xử lý đặt hàng ở đây
            alert('Đặt hàng thành công!');
        }
    };

    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN') + '₫';
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 0;
    const tax = 0;
    const total = subtotal + shipping + tax;

    return (
        <LayoutDefault>
            <div className="payment">
                <div className="container">
                    <div className="payment__header">
                        <h1 className="payment__title">THANH TOÁN</h1>
                        <div className="payment__breadcrumb">
                            <a href="/cart">Giỏ hàng</a>
                            <span>/</span>
                            <span>Thanh toán</span>
                        </div>
                    </div>

                    <div className="payment__content">
                        {/* Left: Customer Information */}
                        <div className="payment__form">
                            {/* Contact Information */}
                            <section className="payment__section">
                                <h2 className="payment__section-title">
                                    <User size={20} />
                                    Thông tin liên hệ
                                </h2>

                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="fullName">
                                            Họ và tên <span className="required">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="fullName"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="Nguyễn Văn A"
                                            className={errors.fullName ? 'error' : ''}
                                        />
                                        {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="phone">
                                            Số điện thoại <span className="required">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="0912345678"
                                            className={errors.phone ? 'error' : ''}
                                        />
                                        {errors.phone && <span className="error-message">{errors.phone}</span>}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">
                                        Email <span className="required">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="email@example.com"
                                        className={errors.email ? 'error' : ''}
                                    />
                                    {errors.email && <span className="error-message">{errors.email}</span>}
                                </div>
                            </section>

                            {/* Shipping Address */}
                            <section className="payment__section">
                                <h2 className="payment__section-title">
                                    <MapPin size={20} />
                                    Địa chỉ giao hàng
                                </h2>

                                <div className="form-group">
                                    <label htmlFor="address">
                                        Địa chỉ cụ thể <span className="required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Số nhà, tên đường"
                                        className={errors.address ? 'error' : ''}
                                    />
                                    {errors.address && <span className="error-message">{errors.address}</span>}
                                </div>

                                <div className="form-grid form-grid--3">
                                    <div className="form-group">
                                        <label htmlFor="city">
                                            Tỉnh/Thành phố <span className="required">*</span>
                                        </label>
                                        <select
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className={errors.city ? 'error' : ''}
                                        >
                                            <option value="">Chọn tỉnh/thành phố</option>
                                            {cities.map(city => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                        {errors.city && <span className="error-message">{errors.city}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="district">
                                            Quận/Huyện <span className="required">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="district"
                                            name="district"
                                            value={formData.district}
                                            onChange={handleChange}
                                            placeholder="Quận/Huyện"
                                            className={errors.district ? 'error' : ''}
                                        />
                                        {errors.district && <span className="error-message">{errors.district}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="ward">
                                            Phường/Xã <span className="required">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="ward"
                                            name="ward"
                                            value={formData.ward}
                                            onChange={handleChange}
                                            placeholder="Phường/Xã"
                                            className={errors.ward ? 'error' : ''}
                                        />
                                        {errors.ward && <span className="error-message">{errors.ward}</span>}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="note">Ghi chú đơn hàng (tuỳ chọn)</label>
                                    <textarea
                                        id="note"
                                        name="note"
                                        value={formData.note}
                                        onChange={handleChange}
                                        placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn"
                                        rows="4"
                                    />
                                </div>
                            </section>

                            {/* Payment Method */}
                            <section className="payment__section">
                                <h2 className="payment__section-title">
                                    <CreditCard size={20} />
                                    Phương thức thanh toán
                                </h2>

                                <div className="payment-methods">
                                    {paymentMethods.map(method => {
                                        return (
                                            <label key={method.id} className="payment-method">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value={method.id}
                                                    checked={formData.paymentMethod === method.id}
                                                    onChange={handleChange}
                                                />
                                                <span className="payment-method__icon">
                                                    {method.image ? (
                                                        <img
                                                            src={method.image}
                                                            alt={method.name}
                                                            style={{ width: '20px', height: '20px', objectFit: 'contain' }}
                                                        />
                                                    ) : (
                                                        React.createElement(method.icon, { size: 20 })
                                                    )}
                                                </span>
                                                <span className="payment-method__info">
                                                    <span className="payment-method__name">{method.name}</span>
                                                    {method.logos && method.logos.length > 0 && (
                                                        <span className="payment-method__logos">
                                                            {method.logos.map((logo, index) => (
                                                                <img
                                                                    key={index}
                                                                    src={logo.image}
                                                                    alt={logo.name}
                                                                    title={logo.name}
                                                                />
                                                            ))}
                                                        </span>
                                                    )}
                                                    {method.description && (
                                                        <span className="payment-method__description">{method.description}</span>
                                                    )}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </section>
                        </div>

                        {/* Right: Order Summary */}
                        <div className="payment__summary">
                            <div className="payment__summary-sticky">
                                <h2 className="payment__summary-title">Đơn hàng của bạn</h2>

                                {/* Products */}
                                <div className="order-items">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="order-item">
                                            <div className="order-item__image">
                                                <div className="order-item__image-placeholder"></div>
                                            </div>
                                            <div className="order-item__details">
                                                <h3 className="order-item__name">{item.name}</h3>
                                                <p className="order-item__variant">{item.color} × {item.quantity}</p>
                                            </div>
                                            <div className="order-item__price">
                                                {formatPrice(item.price * item.quantity)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Coupon */}
                                <div className="coupon-box">
                                    <input
                                        type="text"
                                        placeholder="Mã giảm giá"
                                        className="coupon-box__input"
                                    />
                                    <button type="button" className="coupon-box__btn">
                                        Áp dụng
                                    </button>
                                </div>

                                {/* Price Summary */}
                                <div className="price-summary">
                                    <div className="price-summary__row">
                                        <span>Tạm tính</span>
                                        <span>{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="price-summary__row">
                                        <span>Phí vận chuyển</span>
                                        <span className="text-success">Miễn phí</span>
                                    </div>
                                    <div className="price-summary__divider"></div>
                                    <div className="price-summary__row price-summary__total">
                                        <span>Tổng cộng</span>
                                        <span className="price-summary__total-amount">{formatPrice(total)}</span>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button onClick={handleSubmit} className="payment__submit-btn">
                                    ĐẶT HÀNG NGAY
                                </button>

                                {/* Security */}
                                <div className="payment__security">
                                    <ShieldCheck size={16} />
                                    <span>Thanh toán bảo mật & mã hoá</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutDefault>
    );
};

export default Payment;