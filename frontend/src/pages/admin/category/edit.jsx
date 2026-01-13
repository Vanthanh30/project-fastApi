import React, { useState, useEffect } from 'react';
import { X, Loader, AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../layout_default/Sidebar';
import categoryService from '../../../service/admin/categoryService';
import './category.scss';

const CategoryEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 1
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadCategory();
    }, [id]);

    const loadCategory = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await categoryService.getById(id);

            setFormData({
                name: data.name,
                description: data.description || '',
                status: data.status
            });
        } catch (err) {
            console.error('Error loading category:', err);
            setError(err.detail || 'Không thể tải thông tin danh mục');
        } finally {
            setLoading(false);
        }
    };

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
            setSubmitting(true);
            setError(null);

            const dataToSubmit = {
                name: formData.name.trim(),
                description: formData.description.trim() || null,
                status: formData.status
            };

            await categoryService.update(id, dataToSubmit);

            alert('Cập nhật danh mục thành công!');
            navigate('/admin/category');
        } catch (err) {
            console.error('Error updating category:', err);
            setError(err.detail || 'Không thể cập nhật danh mục. Vui lòng thử lại.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (window.confirm('Bạn có chắc muốn hủy? Các thay đổi chưa lưu sẽ bị mất.')) {
            navigate('/admin/category');
        }
    };

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

    if (error && !formData.name) {
        return (
            <div className="category-page">
                <Sidebar />
                <div className="category-page__content">
                    <div className="category-page__error">
                        <AlertCircle size={48} className="category-page__error-icon" />
                        <p>{error}</p>
                        <div className="category-page__error-actions">
                            <button onClick={loadCategory} className="category-page__retry-btn">
                                Thử lại
                            </button>
                            <button onClick={() => navigate('/admin/category')} className="category-page__back-btn">
                                Quay lại
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="category-page">
            <Sidebar />

            <div className="category-page__content">
                <div className="category-form">
                    <div className="category-form__header">
                        <h1 className="category-form__title">Chỉnh sửa danh mục</h1>
                        <button
                            className="category-form__close"
                            onClick={handleCancel}
                            type="button"
                            disabled={submitting}
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
                                ID danh mục
                            </label>
                            <input
                                type="text"
                                value={id}
                                className="category-form__input category-form__input--disabled"
                                disabled
                            />
                        </div>

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
                                disabled={submitting}
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
                                disabled={submitting}
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
                                        disabled={submitting}
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
                                Chỉ có thể chọn trạng thái Hoạt động
                            </small>
                        </div>

                        <div className="category-form__actions">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="category-form__btn category-form__btn--cancel"
                                disabled={submitting}
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="category-form__btn category-form__btn--submit"
                                disabled={submitting}
                            >
                                {submitting ? 'Đang cập nhật...' : 'Cập nhật'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CategoryEdit;