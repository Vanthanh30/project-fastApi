import React, { useState } from "react";
import { ArrowLeft, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../layout_default/Sidebar";
import "./product.scss"; // Đã cập nhật để dùng chung file style

const CreateProduct = () => {
  const navigate = useNavigate();

  // State quản lý form
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    quantity: "",
    category: "Son",
    status: "active",
    manufactureDate: "",
    expiryDate: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    // Xử lý upload ảnh giả lập
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files[0].name }));
    }
  };

  const handleSubmit = () => {
    console.log("Submitting:", formData);
    // Logic gửi API ở đây
    alert("Đã lưu sản phẩm thành công!");
    navigate("/admin/product");
  };

  return (
    <div className="create-product-page">
      <Sidebar />

      <div className="create-product-page__content">
        {/* Header */}
        <div className="create-product-page__header">
          <div
            className="create-product-page__back-link"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} />
            Back
          </div>
          <h1 className="create-product-page__title">Thêm sản phẩm</h1>
        </div>

        {/* Form Card */}
        <div className="create-product-page__form-card">
          {/* Thông tin sản phẩm */}
          <div className="create-product-page__form-group">
            <span className="create-product-page__section-title">
              Thông tin sản phẩm
            </span>

            <label className="create-product-page__label">
              Tên sản phẩm(*)
            </label>
            <input
              type="text"
              name="name"
              className="create-product-page__input"
              placeholder="Summer T-Shirt"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="create-product-page__form-group">
            <label className="create-product-page__label">
              Mô tả sản phẩm(*)
            </label>
            <textarea
              name="description"
              className="create-product-page__textarea"
              placeholder="Product description"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Hình ảnh */}
          <div className="create-product-page__form-group">
            <label className="create-product-page__label">Hình ảnh</label>
            <div
              className="create-product-page__upload-area"
              onClick={() => document.getElementById("file-upload").click()}
            >
              <input
                id="file-upload"
                type="file"
                hidden
                onChange={handleFileChange}
              />
              <button className="create-product-page__upload-btn">
                Add File
              </button>
              <span className="create-product-page__upload-text">
                {formData.image
                  ? `Selected: ${formData.image}`
                  : "Or drag and drop files"}
              </span>
            </div>
          </div>

          {/* Giá & Số lượng */}
          <div className="create-product-page__form-group">
            <label className="create-product-page__section-title">Giá</label>
            <div className="create-product-page__row-3">
              <div>
                <label className="create-product-page__label">Đơn giá(*)</label>
                <input
                  type="text"
                  name="price"
                  className="create-product-page__input"
                  placeholder="Enter price"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="create-product-page__label">Giảm giá</label>
                <input
                  type="text"
                  name="discountPrice"
                  className="create-product-page__input"
                  placeholder="Price at Discount"
                  value={formData.discountPrice}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="create-product-page__label">
                  Số lượng(*)
                </label>
                <input
                  type="number"
                  name="quantity"
                  className="create-product-page__input"
                  placeholder="Quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Danh mục & Trạng thái */}
          <div className="create-product-page__row-2 create-product-page__form-group">
            <div>
              <label className="create-product-page__label">Danh mục</label>
              <select
                name="category"
                className="create-product-page__select"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Son">Son</option>
                <option value="Kem nền">Kem nền</option>
                <option value="Phấn phủ">Phấn phủ</option>
                <option value="Mắt">Mắt</option>
              </select>
            </div>
            <div>
              <label className="create-product-page__label">Trạng thái</label>
              <div className="create-product-page__radio-group">
                <label
                  className={`create-product-page__radio-label ${
                    formData.status === "active" ? "active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    checked={formData.status === "active"}
                    onChange={handleChange}
                  />
                  Hoạt động
                </label>
                <label
                  className={`create-product-page__radio-label ${
                    formData.status === "inactive" ? "active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value="inactive"
                    checked={formData.status === "inactive"}
                    onChange={handleChange}
                  />
                  Không hoạt động
                </label>
              </div>
            </div>
          </div>

          {/* Ngày sản xuất & Hạn sử dụng */}
          <div
            className="create-product-page__row-2 create-product-page__form-group"
            style={{ marginBottom: 0 }}
          >
            <div>
              <label className="create-product-page__label">
                Ngày sản xuất
              </label>
              <div className="create-product-page__date-input-wrapper">
                <input
                  type="text"
                  name="manufactureDate"
                  className="create-product-page__input"
                  placeholder="Set Duration"
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => (e.target.type = "text")}
                  value={formData.manufactureDate}
                  onChange={handleChange}
                />
                <Calendar
                  size={18}
                  className="create-product-page__date-icon"
                />
              </div>
            </div>
            <div>
              <label className="create-product-page__label">Hạn sử dụng</label>
              <div className="create-product-page__date-input-wrapper">
                <input
                  type="text"
                  name="expiryDate"
                  className="create-product-page__input"
                  placeholder="Set Duration"
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => (e.target.type = "text")}
                  value={formData.expiryDate}
                  onChange={handleChange}
                />
                <Calendar
                  size={18}
                  className="create-product-page__date-icon"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions - Nằm ngoài card */}
        <div className="create-product-page__bottom-actions">
          <button
            className="create-product-page__btn create-product-page__btn--cancel"
            onClick={() => navigate(-1)}
          >
            Hủy
          </button>
          <button
            className="create-product-page__btn create-product-page__btn--save"
            onClick={handleSubmit}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
