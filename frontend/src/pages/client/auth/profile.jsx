import React, { useState, useRef } from 'react';
import { User, Package, Heart, CheckCircle, Mail, Calendar, X, ShoppingCart, Check, Grid3x3, Upload } from 'lucide-react';
import LayoutDefault from '../layout_default/layout_default';
import './auth.scss';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('info');
    const [emailNotification, setEmailNotification] = useState(true);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        fullName: 'Isabelle Duong',
        email: 'isabelle.d@example.com',
        phone: '+84 901 234 567',
        dateOfBirth: '',
        gender: 'Nữ'
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
        console.log('Updated profile:', formData);
        alert('Thông tin đã được cập nhật thành công!');
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log('Selected file:', file);
            // Xử lý upload ảnh ở đây
        }
    };

    const menuItems = [
        { id: 'info', label: 'Thông tin cá nhân' },
        { id: 'orders', label: 'Lịch sử đơn hàng' },
        { id: 'wishlist', label: 'Sản phẩm yêu thích' }
    ];

    const orders = [
        {
            id: 'ORD-001',
            date: '20/12/2024',
            total: '2.450.000đ',
            status: 'Đã giao',
            items: 3,
            products: [
                { name: 'iPhone 15 Pro Max', image: '/product1.jpg', quantity: 1, price: '1.850.000đ' },
                { name: 'AirPods Pro', image: '/product2.jpg', quantity: 1, price: '400.000đ' },
                { name: 'Case iPhone', image: '/product3.jpg', quantity: 1, price: '200.000đ' }
            ]
        },
        {
            id: 'ORD-002',
            date: '15/12/2024',
            total: '1.200.000đ',
            status: 'Đang giao',
            items: 2,
            products: [
                { name: 'MacBook Air M2', image: '/product4.jpg', quantity: 1, price: '1.000.000đ' },
                { name: 'Magic Mouse', image: '/product5.jpg', quantity: 1, price: '200.000đ' }
            ]
        },
        {
            id: 'ORD-003',
            date: '10/12/2024',
            total: '850.000đ',
            status: 'Đã hủy',
            items: 1,
            products: [
                { name: 'iPad Pro 11 inch', image: '/product6.jpg', quantity: 1, price: '850.000đ' }
            ]
        }
    ];

    const wishlistItems = [
        {
            id: 1,
            name: 'Samsung Galaxy S24 Ultra',
            price: '3.200.000đ',
            originalPrice: '3.800.000đ',
            image: '/wish1.jpg',
            inStock: true,
            discount: '15%'
        },
        {
            id: 2,
            name: 'Sony WH-1000XM5',
            price: '1.450.000đ',
            originalPrice: '1.800.000đ',
            image: '/wish2.jpg',
            inStock: true,
            discount: '20%'
        },
        {
            id: 3,
            name: 'Apple Watch Series 9',
            price: '2.100.000đ',
            originalPrice: null,
            image: '/wish3.jpg',
            inStock: false,
            discount: null
        },
        {
            id: 4,
            name: 'DJI Mini 3 Pro',
            price: '4.500.000đ',
            originalPrice: '5.200.000đ',
            image: '/wish4.jpg',
            inStock: true,
            discount: '13%'
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Đã giao':
                return '#10b981';
            case 'Đang giao':
                return '#f59e0b';
            case 'Đã hủy':
                return '#ef4444';
            default:
                return '#6b7280';
        }
    };

    return (
        <LayoutDefault>
            <div className="profile">
                <div className="profile__container">
                    <aside className="profile__sidebar">
                        <div className="profile__user">
                            <div className="profile__avatar">
                                <img src="/avatar-placeholder.jpg" alt="Isabelle Duong" />
                                <div className="profile__avatar-badge">
                                    <CheckCircle size={14} />
                                </div>
                            </div>
                            <h2 className="profile__user-name">Isabelle Duong</h2>
                            <p className="profile__user-email">isabelle.d@example.com</p>
                            <button
                                type="button"
                                className="profile__avatar-edit-btn"
                                onClick={handleAvatarClick}
                            >
                                <Upload size={16} />
                                Chỉnh sửa ảnh đại diện
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                        </div>

                        <nav className="profile__menu">
                            {menuItems.map(item => (
                                <button
                                    key={item.id}
                                    className={`profile__menu-item ${activeTab === item.id ? 'active' : ''}`}
                                    onClick={() => setActiveTab(item.id)}
                                >
                                    <span className="profile__menu-icon">
                                        {item.id === 'info' && <User size={20} />}
                                        {item.id === 'orders' && <Package size={20} />}
                                        {item.id === 'wishlist' && <Heart size={20} />}
                                    </span>
                                    <span className="profile__menu-label">{item.label}</span>
                                </button>
                            ))}
                        </nav>
                    </aside>

                    <main className="profile__content">
                        {activeTab === 'info' && (
                            <div className="profile__section">
                                <div className="profile__header">
                                    <h1 className="profile__title">Thông tin cá nhân</h1>
                                    <p className="profile__subtitle">
                                        Quản lý thông tin hồ sơ cá nhân, xem và cập nhật thông tin để đảm bảo tính chính xác
                                    </p>
                                </div>

                                <div className="profile__card">
                                    <h2>Chi tiết hồ sơ</h2>

                                    <form className="profile__form" onSubmit={handleSubmit}>
                                        <div className="profile__form-group">
                                            <label htmlFor="fullName">Họ và tên</label>
                                            <input
                                                type="text"
                                                id="fullName"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                placeholder="Nhập họ và tên"
                                            />
                                        </div>

                                        <div className="profile__form-group">
                                            <label htmlFor="email">Địa chỉ Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Nhập email"
                                            />
                                        </div>

                                        <div className="profile__form-group">
                                            <label htmlFor="phone">Số điện thoại</label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="Nhập số điện thoại"
                                            />
                                        </div>

                                        <div className="profile__form-row">
                                            <div className="profile__form-group">
                                                <label htmlFor="dateOfBirth">Ngày sinh</label>
                                                <input
                                                    type="date"
                                                    id="dateOfBirth"
                                                    name="dateOfBirth"
                                                    value={formData.dateOfBirth}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="profile__form-group">
                                                <label htmlFor="gender">Giới tính</label>
                                                <select
                                                    id="gender"
                                                    name="gender"
                                                    value={formData.gender}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Chọn</option>
                                                    <option value="Nam">Nam</option>
                                                    <option value="Nữ">Nữ</option>
                                                    <option value="Khác">Khác</option>
                                                </select>
                                            </div>
                                        </div>

                                        <button type="submit" className="profile__submit-btn">
                                            Lưu thay đổi
                                        </button>
                                    </form>
                                </div>

                                <div className="profile__card profile__notification">
                                    <h2>Tùy chọn liên lạc</h2>

                                    <div className="profile__notification-item">
                                        <div className="profile__notification-content">
                                            <div className="profile__notification-icon">
                                                <Mail size={24} />
                                            </div>
                                            <div className="profile__notification-text">
                                                <h3>Bản tin qua thư điện tử</h3>
                                                <p>Nhận cập nhật về sản phẩm mới, ưu đãi đặc biệt, tin tức và cập nhật sự kiện được gửi đến hộp thư đến của bạn</p>
                                            </div>
                                        </div>
                                        <label className="profile__toggle">
                                            <input
                                                type="checkbox"
                                                checked={emailNotification}
                                                onChange={(e) => setEmailNotification(e.target.checked)}
                                            />
                                            <span className="profile__toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div className="profile__section">
                                <div className="profile__header">
                                    <h1 className="profile__title">Lịch sử đơn hàng</h1>
                                    <p className="profile__subtitle">
                                        Theo dõi, quản lý đơn hàng và lịch sử mua sắm của bạn
                                    </p>
                                </div>

                                <div className="profile__orders">
                                    {orders.map(order => (
                                        <div key={order.id} className="profile__order-card">
                                            <div className="profile__order-header">
                                                <div className="profile__order-info">
                                                    <div className="profile__order-id">
                                                        <Grid3x3 size={16} />
                                                        {order.id}
                                                    </div>
                                                    <span className="profile__order-date">
                                                        <Calendar size={14} />
                                                        {order.date}
                                                    </span>
                                                </div>
                                                <div className="profile__order-status" style={{ color: getStatusColor(order.status) }}>
                                                    {order.status}
                                                </div>
                                            </div>

                                            <div className="profile__order-products">
                                                {order.products.map((product, idx) => (
                                                    <div key={idx} className="profile__order-product">
                                                        <div className="profile__order-product-img">
                                                            <div className="profile__product-placeholder">
                                                                <Package size={32} strokeWidth={1.5} />
                                                            </div>
                                                        </div>
                                                        <div className="profile__order-product-details">
                                                            <h4>{product.name}</h4>
                                                            <p>Số lượng: {product.quantity}</p>
                                                        </div>
                                                        <div className="profile__order-product-price">
                                                            {product.price}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="profile__order-footer">
                                                <div className="profile__order-total">
                                                    <span>Tổng cộng:</span>
                                                    <strong>{order.total}</strong>
                                                </div>
                                                <div className="profile__order-actions">
                                                    <button className="profile__order-btn profile__order-btn--secondary">
                                                        Chi tiết
                                                    </button>
                                                    {order.status === 'Đã giao' && (
                                                        <button className="profile__order-btn profile__order-btn--primary">
                                                            Mua lại
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'wishlist' && (
                            <div className="profile__section">
                                <div className="profile__header">
                                    <h1 className="profile__title">Sản phẩm yêu thích</h1>
                                    <p className="profile__subtitle">
                                        Danh sách các sản phẩm bạn đã lưu để theo dõi
                                    </p>
                                </div>

                                <div className="profile__wishlist">
                                    {wishlistItems.map(item => (
                                        <div key={item.id} className="profile__wishlist-card">
                                            <button className="profile__wishlist-remove">
                                                <X size={20} />
                                            </button>

                                            {item.discount && (
                                                <div className="profile__wishlist-badge">-{item.discount}</div>
                                            )}

                                            <div className="profile__wishlist-img">
                                                <div className="profile__product-placeholder">
                                                    <Package size={64} strokeWidth={1.5} />
                                                </div>
                                            </div>

                                            <div className="profile__wishlist-content">
                                                <h3 className="profile__wishlist-name">{item.name}</h3>

                                                <div className="profile__wishlist-price">
                                                    <span className="profile__wishlist-price-current">{item.price}</span>
                                                    {item.originalPrice && (
                                                        <span className="profile__wishlist-price-original">{item.originalPrice}</span>
                                                    )}
                                                </div>

                                                <div className="profile__wishlist-stock">
                                                    {item.inStock ? (
                                                        <span className="profile__wishlist-stock--in">
                                                            <Check size={14} />
                                                            Còn hàng
                                                        </span>
                                                    ) : (
                                                        <span className="profile__wishlist-stock--out">
                                                            <X size={14} />
                                                            Hết hàng
                                                        </span>
                                                    )}
                                                </div>

                                                <button
                                                    className="profile__wishlist-btn"
                                                    disabled={!item.inStock}
                                                >
                                                    <ShoppingCart size={18} />
                                                    Thêm vào giỏ
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </LayoutDefault>
    );
};

export default Profile;