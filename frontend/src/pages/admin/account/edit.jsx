import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, Eye, EyeOff } from 'lucide-react';
import Sidebar from '../layout_default/Sidebar';
import './account.scss';

const AccountEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [showPassword, setShowPassword] = useState(false);

    // Mock data - In real app, fetch based on id
    const [formData, setFormData] = useState({
        name: 'Trần Minh Thư',
        email: 'thu.tran@example.vn',
        role: 'Admin',
        password: '',
        avatar: null
    });
    const [previewImage, setPreviewImage] = useState('https://i.pravatar.cc/150?img=1');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, avatar: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Update account:', id, formData);
        navigate('/admin/account');
    };

    const handleDelete = () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
            console.log('Delete account:', id);
            navigate('/admin/account');
        }
    };

    return (
        <div className="account-page">
            <Sidebar />

            <div className="account-page__content">
                <div className="account-form">
                    {/* Header */}
                    <div className="account-form__header">
                        <button
                            className="account-form__back-btn"
                            onClick={() => navigate('/admin/account')}
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="account-form__title">Chỉnh sửa tài khoản</h1>
                            <p className="account-form__subtitle">
                                Cập nhật thông tin tài khoản {formData.name}
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form className="account-form__body" onSubmit={handleSubmit}>
                        <div className="account-form__section">
                            <h3 className="account-form__section-title">Ảnh đại diện</h3>
                            <div className="account-form__avatar-upload">
                                <div className="account-form__avatar-preview">
                                    {previewImage ? (
                                        <img src={previewImage} alt="Preview" />
                                    ) : (
                                        <div className="account-form__avatar-placeholder">
                                            <Upload size={32} />
                                        </div>
                                    )}
                                </div>
                                <div className="account-form__avatar-info">
                                    <label className="account-form__upload-btn">
                                        <Upload size={16} />
                                        Thay đổi ảnh
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            hidden
                                        />
                                    </label>
                                    <p className="account-form__upload-hint">
                                        JPG, PNG hoặc GIF. Kích thước tối đa 2MB
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="account-form__section">
                            <h3 className="account-form__section-title">Thông tin cá nhân</h3>
                            <div className="account-form__grid">
                                <div className="account-form__field">
                                    <label className="account-form__label">
                                        Họ và tên <span className="account-form__required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="account-form__input"
                                        placeholder="Nhập họ và tên"
                                        required
                                    />
                                </div>

                                <div className="account-form__field">
                                    <label className="account-form__label">
                                        Email <span className="account-form__required">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="account-form__input"
                                        placeholder="name@example.vn"
                                        required
                                    />
                                </div>

                                <div className="account-form__field">
                                    <label className="account-form__label">
                                        Vai trò <span className="account-form__required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="role"
                                        value={formData.role}
                                        className="account-form__input account-form__input--disabled"
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="account-form__section">
                            <h3 className="account-form__section-title">
                                Thay đổi mật khẩu
                                <span className="account-form__optional">(Tùy chọn)</span>
                            </h3>
                            <div className="account-form__field" style={{ maxWidth: '400px' }}>
                                <label className="account-form__label">
                                    Mật khẩu mới
                                </label>
                                <div className="account-form__input-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="account-form__input account-form__input--password"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        className="account-form__input-icon"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <p className="account-form__hint">
                                    Chỉ nhập mật khẩu nếu bạn muốn thay đổi
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="account-form__actions">
                            <button
                                type="button"
                                className="account-form__btn account-form__btn--delete"
                                onClick={handleDelete}
                            >
                                Xóa tài khoản
                            </button>
                            <div className="account-form__actions-right">
                                <button
                                    type="button"
                                    className="account-form__btn account-form__btn--cancel"
                                    onClick={() => navigate('/admin/account')}
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    className="account-form__btn account-form__btn--submit"
                                >
                                    Lưu thay đổi
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AccountEdit;