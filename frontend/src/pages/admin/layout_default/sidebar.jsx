import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, ShoppingBag, Wallet, FolderOpen, User, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.scss';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeMenu, setActiveMenu] = useState('dashboard');

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
        { id: 'products', label: 'Quản lý sản phẩm', icon: Package, path: '/admin/product' },
        { id: 'categories', label: 'Quản lý danh mục', icon: ShoppingBag, path: '/admin/category' },
        { id: 'accounts', label: 'Quản lý tài khoản', icon: Wallet, path: '/admin/account' },
        { id: 'orders', label: 'Quản lý đơn hàng', icon: FolderOpen, path: '/admin/order' },
    ];

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

    const handleLogout = () => {
        console.log('Đăng xuất');
        // Thêm logic đăng xuất ở đây
    };

    return (
        <div className="sidebar">
            {/* Logo Header */}
            <div className="sidebar__header">
                <div className="sidebar__logo">
                    <span className="sidebar__logo-icon">★</span>
                    <h1 className="sidebar__logo-text">LUMIÈRE</h1>
                </div>
            </div>

            {/* Menu Items */}
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

            {/* User Profile */}
            <div className="sidebar__footer">
                <div className="sidebar__user">
                    <div className="sidebar__user-avatar">
                        <img src="https://via.placeholder.com/40" alt="Admin" />
                    </div>
                    <div className="sidebar__user-info">
                        <p className="sidebar__user-name">Quản trị viên</p>
                        <p className="sidebar__user-email">admin@lumiere.com</p>
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