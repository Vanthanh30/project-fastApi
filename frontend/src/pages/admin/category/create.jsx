import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import Sidebar from '../layout_default/Sidebar';
import './category.scss';

const CategoryCreate = () => {
    const [formData, setFormData] = useState({
        name: '',
        parentCategory: '',
        description: '',
        status: 'visible',
        image: null
    });

    const [imagePreview, setImagePreview] = useState(null);

    const parentCategories = [
        { id: 1, name: 'Trang điểm' },
        { id: 2, name: 'Dưỡng da' },
        { id: 3, name: 'Phụ kiện' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file
            }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Create category:', formData);
        // Handle API call here
    };

    const handleCancel = () => {
        window.history.back();
    };

    return (
        <div className="category-page">
            <Sidebar />

            <div className="category-page__content">
                <div className="category-form">
                    <div className="category-form__header">
                        <h1 className="category-form__title">Thông tin danh mục</h1>
                        <button
                            className="category-form__close"
                            onClick={handleCancel}
                            type="button"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="category-form__body">
                        {/* Tên danh mục */}
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
                            />
                        </div>

                        {/* Danh mục cha */}
                        <div className="category-form__group">
                            <label className="category-form__label">
                                Danh mục cha
                            </label>
                            <select
                                name="parentCategory"
                                value={formData.parentCategory}
                                onChange={handleInputChange}
                                className="category-form__select"
                            >
                                <option value="">Chọn danh mục cha</option>
                                {parentCategories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Hình ảnh */}
                        <div className="category-form__group">
                            <label className="category-form__label">
                                Hình ảnh danh mục
                            </label>
                            <div className="category-form__upload">
                                <input
                                    type="file"
                                    id="image-upload"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="category-form__file-input"
                                />
                                <label
                                    htmlFor="image-upload"
                                    className="category-form__upload-area"
                                >
                                    {imagePreview ? (
                                        <div className="category-form__preview">
                                            <img src={imagePreview} alt="Preview" />
                                            <div className="category-form__preview-overlay">
                                                <Upload size={24} />
                                                <span>Thay đổi ảnh</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="category-form__upload-placeholder">
                                            <ImageIcon size={32} />
                                            <span>Nhấn để tải ảnh lên</span>
                                            <small>PNG, JPG, GIF (Max 5MB)</small>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Mô tả */}
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
                            />
                        </div>

                        {/* Trạng thái */}
                        <div className="category-form__group">
                            <label className="category-form__label">
                                Trạng thái
                            </label>
                            <div className="category-form__radio-group">
                                <label className="category-form__radio">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="visible"
                                        checked={formData.status === 'visible'}
                                        onChange={handleInputChange}
                                    />
                                    <span>Hiển thị</span>
                                </label>
                                <label className="category-form__radio">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="hidden"
                                        checked={formData.status === 'hidden'}
                                        onChange={handleInputChange}
                                    />
                                    <span>Ẩn</span>
                                </label>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="category-form__actions">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="category-form__btn category-form__btn--cancel"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="category-form__btn category-form__btn--submit"
                            >
                                Thêm
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CategoryCreate;