import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, ShoppingBag, Wallet, FolderOpen, User, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.scss';
import adminService from '../../../service/adminService';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [adminInfo, setAdminInfo] = useState(null);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
        { id: 'products', label: 'Quản lý sản phẩm', icon: Package, path: '/admin/product' },
        { id: 'categories', label: 'Quản lý danh mục', icon: ShoppingBag, path: '/admin/category' },
        { id: 'accounts', label: 'Quản lý tài khoản', icon: Wallet, path: '/admin/account' },
        { id: 'orders', label: 'Quản lý đơn hàng', icon: FolderOpen, path: '/admin/order' },
    ];

    // Load thông tin admin khi component mount
    useEffect(() => {
        loadAdminInfo();
    }, []);

    const loadAdminInfo = () => {
        // Lấy thông tin admin từ localStorage (nhanh)
        const storedInfo = adminService.getStoredAdminInfo();
        setAdminInfo(storedInfo);

        // Optional: Có thể fetch từ API để có data mới nhất
        // adminService.getProfile()
        //     .then(data => setAdminInfo(data))
        //     .catch(err => console.error('Failed to load admin info:', err));
    };

    // Cập nhật activeMenu dựa trên URL hiện tại
    useEffect(() => {
        const currentPath = location.pathname;
        const currentItem = menuItems.find(item => {
            if (item.path === '/admin') {
                return currentPath === '/admin';
            }
            return currentPath.startsWith(item.path);
        });

        if (currentItem) {
            setActiveMenu(currentItem.id);
        }
    }, [location.pathname]);

    const handleMenuClick = (item) => {
        setActiveMenu(item.id);
        navigate(item.path);
    };

    const handleLogout = async () => {
        if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
            try {
                // Call logout API
                await adminService.logout();

                console.log('Đăng xuất thành công');

                // Redirect to login
                navigate('/admin/login', { replace: true });
            } catch (error) {
                console.error('Logout error:', error);
                // Vẫn redirect về login page ngay cả khi có lỗi
                navigate('/admin/login', { replace: true });
            }
        }
    };

    // Lấy avatar URL hoặc sử dụng placeholder
    const getAvatarUrl = () => {
        if (adminInfo?.avatar) {
            // Nếu avatar là full URL
            if (adminInfo.avatar.startsWith('http')) {
                return adminInfo.avatar;
            }
            // Nếu avatar là relative path, thêm base URL
            return `${window.location.origin}${adminInfo.avatar}`;
        }
        // Default placeholder
        return 'https://via.placeholder.com/40';
    };

    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <div className="sidebar__logo">
                    <span className="sidebar__logo-icon">★</span>
                    <h1 className="sidebar__logo-text">LUMIÈRE</h1>
                </div>
            </div>

            <nav className="sidebar__nav">
                <ul className="sidebar__menu">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeMenu === item.id;

                        return (
                            <li key={item.id} className="sidebar__menu-item">
                                <button
                                    onClick={() => handleMenuClick(item)}
                                    className={`sidebar__menu-link ${isActive ? 'sidebar__menu-link--active' : ''}`}
                                >
                                    <Icon className="sidebar__menu-icon" />
                                    <span className="sidebar__menu-label">{item.label}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="sidebar__footer">
                <div className="sidebar__user">
                    <div className="sidebar__user-avatar">
                        <img
                            src={getAvatarUrl()}
                            alt={adminInfo?.name || 'Admin'}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/40';
                            }}
                        />
                    </div>
                    <div className="sidebar__user-info">
                        <p className="sidebar__user-name">
                            {adminInfo?.name || 'Quản trị viên'}
                        </p>
                        <p className="sidebar__user-email">
                            {adminInfo?.email || 'admin@lumiere.com'}
                        </p>
                    </div>
                    <button
                        className="sidebar__logout"
                        onClick={handleLogout}
                        title="Đăng xuất"
                    >
                        <LogOut />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;