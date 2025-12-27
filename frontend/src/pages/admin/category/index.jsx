import React, { useState } from 'react';
import { Search, SlidersHorizontal, Edit2, Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../layout_default/Sidebar';
import './category.scss';

const CategoryPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState('all');

    const categories = [
        {
            id: 1,
            name: 'Son Môi (Lipstick)',
            type: 'Trang điểm môi',
            description: 'Các dòng son môi, son kem lì, son dưỡng và chi tiết',
            status: 'Hiển thị',
            image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=200&h=200&fit=crop'
        },
        {
            id: 2,
            name: 'Kem Nền (Foundation)',
            type: 'Trang điểm mặt',
            description: 'Kem nền che phủ hoàn hảo, lâu trôi, với nhiều lựa chọn',
            status: 'Hiển thị',
            image: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=200&h=200&fit=crop'
        },
        {
            id: 3,
            name: 'Chăm Sóc Da (Skincare)',
            type: 'Dưỡng da',
            description: 'Các sản phẩm serum, kem dưỡng ẩm và làm sạch',
            status: 'Ẩn',
            image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&h=200&fit=crop'
        },
        {
            id: 4,
            name: 'Phấn Phủ (Powder)',
            type: 'Trang điểm mặt',
            description: 'Phấn phủ kiềm dầu, tạo lớp nền mịn màng tự nhiên',
            status: 'Hiển thị',
            image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=200&h=200&fit=crop'
        },
        {
            id: 5,
            name: 'Dụng Cụ (Tools)',
            type: 'Phụ kiện',
            description: 'Cọ trang điểm, bông mút và các dụng cụ làm đẹp',
            status: 'Hiển thị',
            image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop'
        }
    ];

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleEdit = (id) => {
        navigate(`/admin/category/edit/${id}`);
    };

    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
            console.log('Delete category:', id);
            // Gọi API xóa ở đây
        }
    };

    const handleAddNew = () => {
        navigate('/admin/category/create');
    };

    return (
        <div className="category-page">
            <Sidebar />

            <div className="category-page__content">
                {/* Header */}
                <div className="category-page__header">
                    <div className="category-page__header-info">
                        <h1 className="category-page__title">Quản lý danh mục</h1>
                        <p className="category-page__subtitle">
                            Xem, chỉnh sửa và tổ chức danh mục sản phẩm của cửa hàng
                        </p>
                    </div>
                    <button className="category-page__add-btn" onClick={handleAddNew}>
                        <Plus size={18} />
                        Thêm danh mục mới
                    </button>
                </div>

                {/* Search and Filter */}
                <div className="category-page__toolbar">
                    <div className="category-page__search">
                        <Search className="category-page__search-icon" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm danh mục theo tên, ID..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="category-page__search-input"
                        />
                    </div>
                    <div className="category-page__filters">
                        <select
                            className="category-page__sort-select"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="visible">Hiển thị</option>
                            <option value="hidden">Ẩn</option>
                        </select>
                        <button className="category-page__filter-btn">
                            <SlidersHorizontal size={18} />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="category-page__table-wrapper">
                    <table className="category-page__table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>TÊN DANH MỤC</th>
                                <th>MÔ TẢ</th>
                                <th>TRẠNG THÁI</th>
                                <th>HÀNH ĐỘNG</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category, index) => (
                                <tr key={category.id} style={{ animationDelay: `${index * 0.05}s` }}>
                                    <td className="category-page__stt">{index + 1}</td>
                                    <td>
                                        <div className="category-page__category-info">
                                            <div className="category-page__category-icon">
                                                <img
                                                    src={category.image}
                                                    alt={category.name}
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div>
                                                <div className="category-page__category-name">
                                                    {category.name}
                                                </div>
                                                <div className="category-page__category-type">
                                                    {category.type}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="category-page__description">
                                            {category.description}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`category-page__status ${category.status === 'Hiển thị'
                                            ? 'category-page__status--visible'
                                            : 'category-page__status--hidden'
                                            }`}>
                                            {category.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="category-page__actions">
                                            <button
                                                className="category-page__action-btn category-page__action-btn--edit"
                                                onClick={() => handleEdit(category.id)}
                                                title="Chỉnh sửa"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                className="category-page__action-btn category-page__action-btn--delete"
                                                onClick={() => handleDelete(category.id)}
                                                title="Xóa"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="category-page__pagination">
                    <div className="category-page__pagination-controls">
                        <button className="category-page__pagination-btn">
                            &lt; Trước
                        </button>
                        <button className="category-page__pagination-btn category-page__pagination-btn--active">
                            1
                        </button>
                        <button className="category-page__pagination-btn">2</button>
                        <button className="category-page__pagination-btn">3</button>
                        <span className="category-page__pagination-dots">...</span>
                        <button className="category-page__pagination-btn">
                            Sau &gt;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;