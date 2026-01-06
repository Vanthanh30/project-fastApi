import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Loader, FolderOpen, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../layout_default/Sidebar';
import Pagination from '../../../components/Pagination/Pagination';
import CategoryFilter from '../../../components/Filter/CategoryFilter';
import categoryService from '../../../service/admin/categoryService';
import './category.scss';

const CategoryPage = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const itemsPerPage = 10;

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        filterCategories();
    }, [categories, searchTerm]);

    // DEBUG: Kiểm tra dữ liệu categories
    useEffect(() => {
        if (categories.length > 0) {
            console.log('Categories:', categories.map(c => ({
                name: c.name,
                desc: c.description,
                descLength: c.description?.length,
                // In ra từng ký tự để thấy ký tự ẩn
                descChars: c.description?.split('').map((char, i) =>
                    `[${i}]="${char}" (${char.charCodeAt(0)})`
                )
            })));
        }
    }, [categories]);

    const loadCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await categoryService.getAll();
            setCategories(data);
        } catch (err) {
            setError(err.detail || 'Không thể tải danh sách danh mục');
            console.error('Error loading categories:', err);
        } finally {
            setLoading(false);
        }
    };

    const filterCategories = () => {
        let filtered = [...categories];

        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(cat => {
                const name = cat.name?.toLowerCase().trim() || '';
                const description = cat.description?.toLowerCase().trim() || '';

                return name.includes(searchLower) || description.includes(searchLower);
            });
        }

        setFilteredCategories(filtered);
        setCurrentPage(1);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleEdit = (id) => {
        navigate(`/admin/category/edit/${id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
            try {
                await categoryService.delete(id);

                const newTotalItems = filteredCategories.length - 1;
                const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);

                if (currentPage > newTotalPages && newTotalPages > 0) {
                    setCurrentPage(newTotalPages);
                }

                loadCategories();
                alert('Xóa danh mục thành công!');
            } catch (err) {
                alert(err.detail || 'Không thể xóa danh mục');
                console.error('Error deleting category:', err);
            }
        }
    };

    const handleAddNew = () => {
        navigate('/admin/category/create');
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalItems = filteredCategories.length;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);

    if (loading) {
        return (
            <div className="category-page">
                <Sidebar />
                <div className="category-page__content">
                    <div className="category-page__loading">
                        <Loader size={48} className="category-page__loading-icon" />
                        <p>Đang tải dữ liệu...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="category-page">
                <Sidebar />
                <div className="category-page__content">
                    <div className="category-page__error">
                        <AlertCircle size={48} className="category-page__error-icon" />
                        <p>{error}</p>
                        <button onClick={loadCategories} className="category-page__retry-btn">
                            Thử lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="category-page">
            <Sidebar />

            <div className="category-page__content">
                <div className="category-page__header">
                    <div className="category-page__header-info">
                        <h1 className="category-page__title">Quản lý danh mục</h1>
                        <p className="category-page__subtitle">
                            Xem, chỉnh sửa và tổ chức danh mục sản phẩm của cửa hàng
                            {` (${filteredCategories.length} danh mục)`}
                        </p>
                    </div>
                    <button className="category-page__add-btn" onClick={handleAddNew}>
                        <Plus size={18} />
                        Thêm danh mục mới
                    </button>
                </div>

                <CategoryFilter
                    searchTerm={searchTerm}
                    onSearchChange={handleSearch}
                />

                <div className="category-page__table-wrapper">
                    {currentItems.length === 0 ? (
                        <div className="category-page__empty">
                            <FolderOpen size={48} className="category-page__empty-icon" />
                            <p className="category-page__empty-title">Không tìm thấy danh mục nào</p>
                            <p className="category-page__empty-subtitle">
                                Thử tìm kiếm với từ khóa khác
                            </p>
                        </div>
                    ) : (
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
                                {currentItems.map((category, index) => (
                                    <tr key={category.id} style={{ animationDelay: `${index * 0.05}s` }}>
                                        <td className="category-page__stt">
                                            {indexOfFirstItem + index + 1}
                                        </td>
                                        <td>
                                            <div className="category-page__category-info">
                                                <div className="category-page__category-icon">
                                                    <FolderOpen size={24} />
                                                </div>
                                                <div>
                                                    <div className="category-page__category-name">
                                                        {category.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="category-page__description">
                                                {category.description || 'Chưa có mô tả'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`category-page__status ${category.status === 1
                                                ? 'category-page__status--active'
                                                : 'category-page__status--hidden'
                                                }`}>
                                                {category.status === 1 ? 'Hoạt động' : 'Ẩn'}
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
                    )}
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    showIfLessThan={4}
                />
            </div>
        </div>
    );
};

export default CategoryPage;