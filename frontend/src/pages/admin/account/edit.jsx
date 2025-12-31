import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Eye, EyeOff } from 'lucide-react';
import Sidebar from '../layout_default/sidebar';
import './account.scss';
import accountService from '../../../service/accountService';

const AccountEdit = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        password: '',
        avatar: null
    });
    const [previewImage, setPreviewImage] = useState('');
    useEffect(() => {
        loadAdminProfile();
    }, []);

    const loadAdminProfile = async () => {
        try {
            setLoadingProfile(true);
            const data = await accountService.getProfile();

            setFormData({
                name: data.name || '',
                phone: data.phone || '',
                address: data.address || '',
                password: '',
                avatar: null
            });

            if (data.avatar) {
                setPreviewImage(data.avatar);
            }
        } catch (err) {
            console.error('Load profile error:', err);
            setError('Không thể tải thông tin tài khoản');
        } finally {
            setLoadingProfile(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
        if (success) setSuccess('');
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setError('Kích thước ảnh không được vượt quá 2MB');
                return;
            }
            if (!file.type.startsWith('image/')) {
                setError('Chỉ chấp nhận file ảnh (JPG, PNG, GIF)');
                return;
            }

            setFormData(prev => ({ ...prev, avatar: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);

            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const updateData = {
                name: formData.name,
                phone: formData.phone,
                address: formData.address,
            };

            if (formData.password && formData.password.trim() !== '') {
                if (formData.password.length < 6) {
                    setError('Mật khẩu phải có ít nhất 6 ký tự');
                    setLoading(false);
                    return;
                }
                updateData.password = formData.password;
            }
            if (formData.avatar instanceof File) {
                updateData.avatar = formData.avatar;
            }

            const response = await accountService.updateProfile(updateData);

            setSuccess(response.message || 'Cập nhật thông tin thành công!');
            setFormData(prev => ({ ...prev, password: '' }));

            setTimeout(() => {
                loadAdminProfile();
            }, 1000);

        } catch (err) {
            console.error('Update error:', err);
            setError(err.message || 'Cập nhật thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    if (loadingProfile) {
        return (
            <div className="account-page">
                <Sidebar />
                <div className="account-page__content">
                    <div className="account-form">
                        <p>Đang tải thông tin...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="account-page">
            <Sidebar />

            <div className="account-page__content">
                <div className="account-form">
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
                                Cập nhật thông tin tài khoản của bạn
                            </p>
                        </div>
                    </div>
                    {error && (
                        <div className="account-form__message account-form__message--error">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="account-form__message account-form__message--success">
                            {success}
                        </div>
                    )}
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
                                            disabled={loading}
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
                                        disabled={loading}
                                        required
                                    />
                                </div>

                                <div className="account-form__field">
                                    <label className="account-form__label">
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="account-form__input"
                                        placeholder="0912345678"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="account-form__field" style={{ gridColumn: '1 / -1' }}>
                                    <label className="account-form__label">
                                        Địa chỉ
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="account-form__input"
                                        placeholder="Nhập địa chỉ"
                                        disabled={loading}
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
                                        disabled={loading}
                                        minLength={6}
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
                                    Chỉ nhập mật khẩu nếu bạn muốn thay đổi (tối thiểu 6 ký tự)
                                </p>
                            </div>
                        </div>
                        <div className="account-form__actions">
                            <div className="account-form__actions-right" style={{ marginLeft: 'auto' }}>
                                <button
                                    type="button"
                                    className="account-form__btn account-form__btn--cancel"
                                    onClick={() => navigate('/admin/account')}
                                    disabled={loading}
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    className="account-form__btn account-form__btn--submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
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