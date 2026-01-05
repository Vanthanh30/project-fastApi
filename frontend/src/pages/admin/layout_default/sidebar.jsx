import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, ShoppingBag, Wallet, FolderOpen, User, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.scss';
import authService from '../../../service//admin/authService';

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
    useEffect(() => {
        loadAdminInfo();
    }, []);

    const loadAdminInfo = async () => {
        const storedInfo = authService.getStoredAdminInfo();
        if (storedInfo) {
            setAdminInfo(storedInfo);
        }
        try {
            const freshInfo = await authService.getProfile();
            setAdminInfo(freshInfo);
        } catch (err) {
            console.error('Failed to load admin profile:', err);
        }
    };
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
                await authService.logout();
                console.log('Đăng xuất thành công');
                navigate('/admin/login', { replace: true });
            } catch (error) {
                console.error('Logout error:', error);
                navigate('/admin/login', { replace: true });
            }
        }
    };

    const DEFAULT_AVATAR = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="%23e5e7eb"/><circle cx="20" cy="15" r="7" fill="%239ca3af"/><path d="M8 35 Q8 25 20 25 Q32 25 32 35 Z" fill="%239ca3af"/></svg>`;

    const getAvatarUrl = () => {
        if (adminInfo?.avatar) {
            if (adminInfo.avatar.startsWith('http')) {
                return adminInfo.avatar;
            }
            return `http://localhost:8000${adminInfo.avatar}`;
        }
        return DEFAULT_AVATAR;
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
                                e.target.src = DEFAULT_AVATAR;
                            }}
                        />
                    </div>
                    <div className="sidebar__user-info">
                        <p className="sidebar__user-name">
                            {adminInfo?.name || 'Quản trị viên'}
                        </p>
                        <p className="sidebar__user-email">
                            {adminInfo?.email || 'Loading...'}
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