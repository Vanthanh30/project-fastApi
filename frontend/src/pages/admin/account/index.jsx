import React, { useState } from 'react';
import { Edit2, Trash2, Plus, MoreVertical, User, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../layout_default/Sidebar';
import './account.scss';

const AccountPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('admin'); // 'admin' or 'customer'

    const adminAccounts = [
        {
            id: 'A0001',
            name: 'Trần Minh Thư',
            email: 'thu.tran@example.vn',
            avatar: 'https://i.pravatar.cc/150?img=1',
            status: 'Hoạt động'
        },
        {
            id: 'A0002',
            name: 'Lê Hoàng Nam',
            email: 'nam.le@example.vn',
            avatar: 'https://i.pravatar.cc/150?img=2',
            status: 'Hoạt động'
        },
        {
            id: 'A0003',
            name: 'Phạm Văn Tuấn',
            email: 'tuan.pham@example.vn',
            avatar: 'https://i.pravatar.cc/150?img=3',
            status: 'Vô hiệu hóa'
        },
        {
            id: 'A0004',
            name: 'Nguyễn Kim Ngân',
            email: 'ngan.nguyen@example.vn',
            avatar: 'https://i.pravatar.cc/150?img=4',
            status: 'Hoạt động'
        }
    ];

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

    const currentAccounts = activeTab === 'admin' ? adminAccounts : customerAccounts;

    const handleEdit = (id) => {
        navigate(`/admin/account/edit/${id}`);
    };

    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
            console.log('Delete account:', id);
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
                            {currentAccounts.map((account, index) => (
                                <tr key={account.id} style={{ animationDelay: `${index * 0.05}s` }}>
                                    <td className="account-page__stt">{index + 1}</td>
                                    <td>
                                        <img
                                            src={account.avatar}
                                            alt={account.name}
                                            className="account-page__avatar"
                                        />
                                    </td>
                                    <td className="account-page__name">{account.name}</td>
                                    <td className="account-page__email">{account.email}</td>
                                    {activeTab === 'admin' ? (
                                        <td>
                                            <span className={`account-page__status ${account.status === 'Hoạt động'
                                                ? 'account-page__status--active'
                                                : 'account-page__status--inactive'
                                                }`}>
                                                {account.status}
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
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
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
            </div>
        </div>
    );
};

export default AccountPage;