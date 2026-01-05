import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../layout_default/Sidebar';
import categoryService from '../../../service/admin/categoryService';
import './category.scss';

const CategoryCreate = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 1 // Mặc định là Hoạt động
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'status') {
            setFormData(prev => ({
                ...prev,
                [name]: parseInt(value)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            setError('Vui lòng nhập tên danh mục');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const dataToSubmit = {
                name: formData.name.trim(),
                description: formData.description.trim() || null,
                status: formData.status
            };

            await categoryService.create(dataToSubmit);

            alert('Tạo danh mục thành công!');
            navigate('/admin/category');
        } catch (err) {
            console.error('Error creating category:', err);
            setError(err.detail || 'Không thể tạo danh mục. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (formData.name || formData.description) {
            if (window.confirm('Bạn có chắc muốn hủy? Dữ liệu chưa lưu sẽ bị mất.')) {
                navigate('/admin/category');
            }
        } else {
            navigate('/admin/category');
        }
    };

    return (
        <div className="category-page">
            <Sidebar />

            <div className="category-page__content">
                <div className="category-form">
                    <div className="category-form__header">
                        <h1 className="category-form__title">Thêm danh mục mới</h1>
                        <button
                            className="category-form__close"
                            onClick={handleCancel}
                            type="button"
                            disabled={loading}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {error && (
                        <div className="category-form__error">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="category-form__body">
                        <div className="category-form__group">
                            <label className="category-form__label">
                                Tên danh mục <span className="category-form__required">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Nhập tên danh mục"
                                className="category-form__input"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="category-form__group">
                            <label className="category-form__label">
                                Mô tả
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Nhập mô tả danh mục"
                                className="category-form__textarea"
                                rows="4"
                                disabled={loading}
                            />
                            <small className="category-form__hint">
                                Mô tả ngắn gọn về danh mục này (tối đa 500 ký tự)
                            </small>
                        </div>

                        <div className="category-form__group">
                            <label className="category-form__label">
                                Trạng thái
                            </label>
                            <div className="category-form__radio-group">
                                <label className="category-form__radio">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="1"
                                        checked={formData.status === 1}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                    />
                                    <span>Hoạt động</span>
                                </label>
                                <label className="category-form__radio category-form__radio--disabled">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="0"
                                        checked={formData.status === 0}
                                        onChange={handleInputChange}
                                        disabled={true}
                                    />
                                    <span>Ẩn</span>
                                </label>
                            </div>
                            <small className="category-form__hint">
                                Danh mục mới sẽ được tạo với trạng thái Hoạt động
                            </small>
                        </div>

                        <div className="category-form__actions">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="category-form__btn category-form__btn--cancel"
                                disabled={loading}
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="category-form__btn category-form__btn--submit"
                                disabled={loading}
                            >
                                {loading ? 'Đang tạo...' : 'Tạo danh mục'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CategoryCreate;