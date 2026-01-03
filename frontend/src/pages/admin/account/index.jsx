import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, MoreVertical, User, Users, Inbox, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../layout_default/Sidebar';
import Pagination from '../../../components/Pagination/Pagination';
import './account.scss';
import accountService from '../../../service/admin/accountService';

const AccountPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('admin');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        loadUsers();
    }, [activeTab]);

    // Reset về trang 1 khi đổi tab
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError('');

            const data = await accountService.getAllUsers();
            const userList = Array.isArray(data) ? data : [];
            setUsers(userList);

        } catch (err) {
            console.error('Load users error:', err);
            setError('Không thể tải danh sách người dùng');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    // Lọc users theo tab
    const filteredUsers = users.filter(user => {
        if (activeTab === 'admin') {
            return user.role_id === 1;
        } else {
            return user.role_id === 2;
        }
    });

    // Tính toán pagination
    const totalItems = filteredUsers.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleEdit = (id) => {
        if (activeTab === 'admin') {
            navigate(`/admin/account/edit/${id}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này? Hành động này không thể hoàn tác.')) {
            try {
                await accountService.deleteUser(id);

                // Tính lại số trang sau khi xóa
                const newTotalItems = totalItems - 1;
                const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);

                // Nếu trang hiện tại lớn hơn tổng số trang mới, chuyển về trang cuối
                if (currentPage > newTotalPages && newTotalPages > 0) {
                    setCurrentPage(newTotalPages);
                }

                loadUsers();
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

                <div className="account-page__tabs">
                    <button
                        className={`account-page__tab ${activeTab === 'admin' ? 'account-page__tab--active' : ''}`}
                        onClick={() => setActiveTab('admin')}
                    >
                        <User className="account-page__tab-icon" size={18} />
                        Quản trị viên ({users.filter(u => u.role_id === 1).length})
                    </button>
                    <button
                        className={`account-page__tab ${activeTab === 'customer' ? 'account-page__tab--active' : ''}`}
                        onClick={() => setActiveTab('customer')}
                    >
                        <Users className="account-page__tab-icon" size={18} />
                        Khách hàng ({users.filter(u => u.role_id === 2).length})
                    </button>
                </div>

                {error && (
                    <div style={{
                        padding: '1rem',
                        margin: '1rem 0',
                        backgroundColor: '#fee',
                        color: '#c33',
                        borderRadius: '8px',
                        border: '1px solid #fcc'
                    }}>
                        {error}
                    </div>
                )}

                {loading ? (
                    <div style={{
                        padding: '3rem',
                        textAlign: 'center',
                        fontSize: '1.1rem',
                        color: '#666',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem'
                    }}>
                        <Loader2 size={32} className="animate-spin" style={{ color: '#3b82f6' }} />
                        <span>Đang tải danh sách...</span>
                    </div>
                ) : (
                    <>
                        <div className="account-page__table-wrapper">
                            <table className="account-page__table">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>AVATAR</th>
                                        <th>TÊN</th>
                                        <th>EMAIL</th>
                                        <th>SỐ ĐIỆN THOẠI</th>
                                        <th>TRẠNG THÁI</th>
                                        <th>HÀNH ĐỘNG</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" style={{
                                                textAlign: 'center',
                                                padding: '3rem',
                                                color: '#999',
                                                fontSize: '1rem'
                                            }}>
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: '0.75rem'
                                                }}>
                                                    <Inbox size={48} style={{ color: '#d1d5db' }} />
                                                    <span>
                                                        {activeTab === 'admin'
                                                            ? 'Chưa có quản trị viên nào'
                                                            : 'Chưa có khách hàng nào'}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        currentItems.map((user, index) => (
                                            <tr key={user.id} style={{ animationDelay: `${index * 0.05}s` }}>
                                                <td className="account-page__stt">
                                                    {indexOfFirstItem + index + 1}
                                                </td>
                                                <td>
                                                    <img
                                                        src={user.avatar || 'https://via.placeholder.com/40'}
                                                        alt={user.name}
                                                        className="account-page__avatar"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="%23e5e7eb"/><circle cx="20" cy="15" r="7" fill="%239ca3af"/><path d="M8 35 Q8 25 20 25 Q32 25 32 35 Z" fill="%239ca3af"/></svg>';
                                                        }}
                                                    />
                                                </td>
                                                <td className="account-page__name">{user.name || 'N/A'}</td>
                                                <td className="account-page__email">{user.email}</td>
                                                <td className="account-page__phone">{user.phone || '-'}</td>
                                                <td>
                                                    <span className={`account-page__status ${user.status === 1
                                                        ? 'account-page__status--active'
                                                        : 'account-page__status--inactive'
                                                        }`}>
                                                        {user.status === 1 ? 'Hoạt động' : 'Vô hiệu hóa'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="account-page__actions">
                                                        {activeTab === 'admin' ? (
                                                            <>
                                                                <button
                                                                    className="account-page__action-btn account-page__action-btn--edit"
                                                                    onClick={() => handleEdit(user.id)}
                                                                    title="Chỉnh sửa"
                                                                >
                                                                    <Edit2 size={16} />
                                                                </button>
                                                                <button
                                                                    className="account-page__action-btn account-page__action-btn--delete"
                                                                    onClick={() => handleDelete(user.id)}
                                                                    title="Xóa"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <button
                                                                className="account-page__action-btn account-page__action-btn--view"
                                                                onClick={() => console.log('View customer:', user.id)}
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

                        <Pagination
                            currentPage={currentPage}
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
                            onPageChange={handlePageChange}
                            showIfLessThan={4}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default AccountPage;