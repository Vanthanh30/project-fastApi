import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Package,
  Heart,
  CheckCircle,
  Mail,
  Calendar,
  X,
  ShoppingCart,
  Check,
  Grid3x3,
  Upload,
} from "lucide-react";
import LayoutDefault from "../layout_default/layout_default";
import axios from "axios";
import "./auth.scss";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("info");
  const [emailNotification, setEmailNotification] = useState(true);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const response = await axios.get("http://localhost:8000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = response.data;
        setFormData({
          fullName: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
        });
        setPreviewAvatar(user.avatar);
      } catch (error) {
        console.error("Lỗi lấy thông tin:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Vui lòng đăng nhập lại");
      return;
    }

    try {
      const dataToSend = new FormData();

      dataToSend.append("name", formData.fullName);
      dataToSend.append("phone", formData.phone);
      dataToSend.append("address", formData.address);

      if (avatarFile) {
        dataToSend.append("avatar", avatarFile);
      }

      await axios.put("http://localhost:8000/auth/me", dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Thông tin đã được cập nhật thành công!");
      window.location.reload();
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  const menuItems = [{ id: "info", label: "Thông tin cá nhân" }];

  return (
    <LayoutDefault>
      <div className="profile">
        <div className="profile__container">
          <aside className="profile__sidebar">
            <div className="profile__user">
              <div className="profile__avatar">
                <img
                  src={previewAvatar || "/avatar-placeholder.jpg"}
                  alt={formData.fullName}
                  style={{ objectFit: "cover" }}
                />
                <div className="profile__avatar-badge">
                  <CheckCircle size={14} />
                </div>
              </div>
              <h2 className="profile__user-name">
                {formData.fullName || "User"}
              </h2>
              <p className="profile__user-email">{formData.email}</p>
              <button
                type="button"
                className="profile__avatar-edit-btn"
                onClick={handleAvatarClick}
              >
                <Upload size={16} />
                Chỉnh sửa ảnh đại diện
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>

            <nav className="profile__menu">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className={`profile__menu-item ${
                    activeTab === item.id ? "active" : ""
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <span className="profile__menu-icon">
                    {item.id === "info" && <User size={20} />}
                  </span>
                  <span className="profile__menu-label">{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          <main className="profile__content">
            {activeTab === "info" && (
              <div className="profile__section">
                <div className="profile__header">
                  <h1 className="profile__title">Thông tin cá nhân</h1>
                  <p className="profile__subtitle">
                    Quản lý thông tin hồ sơ cá nhân, xem và cập nhật thông tin
                    để đảm bảo tính chính xác
                  </p>
                </div>

                <div className="profile__card">
                  <h2>Chi tiết hồ sơ</h2>

                  <form className="profile__form" onSubmit={handleSubmit}>
                    <div className="profile__form-group">
                      <label htmlFor="fullName">Họ và tên</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Nhập họ và tên"
                      />
                    </div>

                    <div className="profile__form-group">
                      <label htmlFor="email">Địa chỉ Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        readOnly
                        className="bg-gray-100 cursor-not-allowed"
                      />
                    </div>

                    <div className="profile__form-group">
                      <label htmlFor="phone">Số điện thoại</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Nhập số điện thoại"
                      />
                    </div>

                    <div className="profile__form-group">
                      <label htmlFor="address">Địa chỉ</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address || ""}
                        onChange={handleChange}
                        placeholder="Nhập địa chỉ giao hàng (Số nhà, đường, phường/xã...)"
                      />
                    </div>

                    <button
                      type="submit"
                      className="profile__submit-btn"
                      disabled={isLoading}
                    >
                      {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                  </form>
                </div>

                <div className="profile__card profile__notification">
                  <h2>Tùy chọn liên lạc</h2>

                  <div className="profile__notification-item">
                    <div className="profile__notification-content">
                      <div className="profile__notification-icon">
                        <Mail size={24} />
                      </div>
                      <div className="profile__notification-text">
                        <h3>Bản tin qua thư điện tử</h3>
                        <p>
                          Nhận cập nhật về sản phẩm mới, ưu đãi đặc biệt, tin
                          tức và cập nhật sự kiện được gửi đến hộp thư đến của
                          bạn
                        </p>
                      </div>
                    </div>
                    <label className="profile__toggle">
                      <input
                        type="checkbox"
                        checked={emailNotification}
                        onChange={(e) => setEmailNotification(e.target.checked)}
                      />
                      <span className="profile__toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="profile__section">
                <div className="profile__header">
                  <h1 className="profile__title">Lịch sử đơn hàng</h1>
                  <p className="profile__subtitle">
                    Theo dõi, quản lý đơn hàng và lịch sử mua sắm của bạn
                  </p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </LayoutDefault>
  );
};

export default Profile;
