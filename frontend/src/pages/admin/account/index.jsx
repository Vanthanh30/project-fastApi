import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, MoreVertical, User, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../layout_default/sidebar';
import './account.scss';
import accountService from '../../../service/accountService';

const AccountPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('admin'); // 'admin' or 'customer'
    const [adminAccounts, setAdminAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Dữ liệu khách hàng tĩnh (không thay đổi)
    const customerAccounts = [
        {
            id: 'C0001',
            name: 'Võ Thị Lan',
            email: 'lan.vo@gmail.com',
            avatar: 'https://i.pravatar.cc/150?img=5',
            phone: '0912345678'
        },
        {
            id: 'C0002',
            name: 'Đặng Minh Khôi',
            email: 'khoi.dang@gmail.com',
            avatar: 'https://i.pravatar.cc/150?img=6',
            phone: '0987654321'
        },
        {
            id: 'C0003',
            name: 'Lý Thu Hằng',
            email: 'hang.ly@gmail.com',
            avatar: 'https://i.pravatar.cc/150?img=7',
            phone: '0901234567'
        }
    ];

    // Load danh sách admin khi component mount hoặc khi chuyển sang tab admin
    useEffect(() => {
        if (activeTab === 'admin') {
            loadAdminAccounts();
        }
    }, [activeTab]);

    const loadAdminAccounts = async () => {
        try {
            setLoading(true);
            setError('');

            console.log('🔍 Fetching admin accounts...');
            const data = await accountService.getAllAdmins();
            console.log('📦 Received data:', data);

            // Xử lý response - data có thể là array hoặc single object
            let accounts = [];

            if (Array.isArray(data)) {
                accounts = data;
            } else if (data && typeof data === 'object') {
                // Nếu là single object, wrap trong array
                accounts = [data];
            }

            console.log('✅ Processed accounts:', accounts);
            setAdminAccounts(accounts);

        } catch (err) {
            console.error('❌ Load admins error:', err);
            setError('Không thể tải danh sách admin');
            setAdminAccounts([]);
        } finally {
            setLoading(false);
        }
    };

    const currentAccounts = activeTab === 'admin' ? adminAccounts : customerAccounts;

    const handleEdit = (id) => {
        navigate(`/admin/account/edit/${id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
            try {
                await accountService.deleteAdmin(id);
                // Reload danh sách sau khi xóa
                loadAdminAccounts();
                alert('Xóa tài khoản thành công');
            } catch (err) {
                console.error('Delete error:', err);
                alert(err.message || 'Xóa tài khoản thất bại');
            }
        }
    };

    const handleAddNew = () => {
        navigate('/admin/account/create');
    };

    return (
        <div className="account-page">
            <Sidebar />

            <div className="account-page__content">
                {/* Header */}
                <div className="account-page__header">
                    <div className="account-page__header-info">
                        <h1 className="account-page__title">Quản lý tài khoản</h1>
                        <p className="account-page__subtitle">
                            Quản lý quyền truy cập của nhân viên và thông tin khách hàng
                        </p>
                    </div>
                    {activeTab === 'admin' && (
                        <button className="account-page__add-btn" onClick={handleAddNew}>
                            <Plus size={18} />
                            Thêm tài khoản mới
                        </button>
                    )}
                </div>

                {/* Tabs */}
                <div className="account-page__tabs">
                    <button
                        className={`account-page__tab ${activeTab === 'admin' ? 'account-page__tab--active' : ''}`}
                        onClick={() => setActiveTab('admin')}
                    >
                        <User className="account-page__tab-icon" size={18} />
                        Quản trị viên (Admins)
                    </button>
                    <button
                        className={`account-page__tab ${activeTab === 'customer' ? 'account-page__tab--active' : ''}`}
                        onClick={() => setActiveTab('customer')}
                    >
                        <Users className="account-page__tab-icon" size={18} />
                        Khách hàng (Customers)
                    </button>
                </div>

                {/* Error Message */}
                {error && activeTab === 'admin' && (
                    <div style={{
                        padding: '1rem',
                        margin: '1rem 0',
                        backgroundColor: '#fee',
                        color: '#c33',
                        borderRadius: '8px'
                    }}>
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading && activeTab === 'admin' ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                        Đang tải danh sách admin...
                    </div>
                ) : (
                    <>
                        {/* Table */}
                        <div className="account-page__table-wrapper">
                            <table className="account-page__table">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>AVATAR</th>
                                        <th>TÊN TÀI KHOẢN</th>
                                        <th>EMAIL</th>
                                        {activeTab === 'admin' ? (
                                            <th>TRẠNG THÁI</th>
                                        ) : (
                                            <th>SỐ ĐIỆN THOẠI</th>
                                        )}
                                        <th>HÀNH ĐỘNG</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentAccounts.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                                                {activeTab === 'admin'
                                                    ? 'Chưa có admin nào'
                                                    : 'Chưa có khách hàng nào'}
                                            </td>
                                        </tr>
                                    ) : (
                                        currentAccounts.map((account, index) => (
                                            <tr key={account.id} style={{ animationDelay: `${index * 0.05}s` }}>
                                                <td className="account-page__stt">{index + 1}</td>
                                                <td>
                                                    <img
                                                        src={account.avatar || 'https://via.placeholder.com/40'}
                                                        alt={account.name}
                                                        className="account-page__avatar"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="%23e5e7eb"/><circle cx="20" cy="15" r="7" fill="%239ca3af"/><path d="M8 35 Q8 25 20 25 Q32 25 32 35 Z" fill="%239ca3af"/></svg>';
                                                        }}
                                                    />
                                                </td>
                                                <td className="account-page__name">{account.name}</td>
                                                <td className="account-page__email">{account.email}</td>
                                                {activeTab === 'admin' ? (
                                                    <td>
                                                        <span className={`account-page__status ${account.status === 'Hoạt động' || account.is_active
                                                                ? 'account-page__status--active'
                                                                : 'account-page__status--inactive'
                                                            }`}>
                                                            {account.status || (account.is_active ? 'Hoạt động' : 'Vô hiệu hóa')}
                                                        </span>
                                                    </td>
                                                ) : (
                                                    <td className="account-page__phone">{account.phone}</td>
                                                )}
                                                <td>
                                                    <div className="account-page__actions">
                                                        {activeTab === 'admin' ? (
                                                            <>
                                                                <button
                                                                    className="account-page__action-btn account-page__action-btn--edit"
                                                                    onClick={() => handleEdit(account.id)}
                                                                    title="Chỉnh sửa"
                                                                >
                                                                    <Edit2 size={16} />
                                                                </button>
                                                                <button
                                                                    className="account-page__action-btn account-page__action-btn--delete"
                                                                    onClick={() => handleDelete(account.id)}
                                                                    title="Xóa"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <button
                                                                className="account-page__action-btn account-page__action-btn--view"
                                                                onClick={() => console.log('View customer:', account.id)}
                                                                title="Xem chi tiết"
                                                            >
                                                                <MoreVertical size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination - Hiển thị khi có dữ liệu */}
                        {currentAccounts.length > 0 && (
                            <div className="account-page__pagination">
                                <button className="account-page__pagination-btn">
                                    &lt;
                                </button>
                                <button className="account-page__pagination-btn account-page__pagination-btn--active">
                                    1
                                </button>
                                <button className="account-page__pagination-btn">2</button>
                                <button className="account-page__pagination-btn">3</button>
                                <span className="account-page__pagination-dots">...</span>
                                <button className="account-page__pagination-btn">12</button>
                                <button className="account-page__pagination-btn">
                                    &gt;
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AccountPage;