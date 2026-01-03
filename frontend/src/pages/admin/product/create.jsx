import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../layout_default/Sidebar";
import ProductService from "../../../service/admin/productService";
import categoryService from "../../../service/admin/categoryService";
import "./product.scss";

const CreateProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // State quản lý form
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category_id: "",
    status: 1,
    brand: "",
    image: "",
  });

  // Load categories từ API
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
      alert("Không thể tải danh mục");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      // Tạo preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên sản phẩm");
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert("Vui lòng nhập giá hợp lệ");
      return false;
    }
    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      alert("Vui lòng nhập số lượng hợp lệ");
      return false;
    }
    if (!formData.category_id) {
      alert("Vui lòng chọn danh mục");
      return false;
    }
    if (!formData.brand.trim()) {
      alert("Vui lòng nhập thương hiệu");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      let imageUrl = null;

      // Upload ảnh nếu có
      if (imageFile) {
        try {
          imageUrl = await ProductService.uploadImage(imageFile);
        } catch (error) {
          console.error("Error uploading image:", error);
          alert("Lỗi khi upload ảnh, vui lòng thử lại");
          setLoading(false);
          return;
        }
      }

      // Chuẩn bị dữ liệu gửi lên API
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        category_id: parseInt(formData.category_id),
        status: parseInt(formData.status),
        brand: formData.brand.trim(),
        image: imageUrl,
      };

      await ProductService.createProduct(productData);
      alert("Thêm sản phẩm thành công!");
      navigate("/admin/product");
    } catch (error) {
      alert(`Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
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
              placeholder="Nhập tên sản phẩm"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="create-product-page__form-group">
            <label className="create-product-page__label">Thương hiệu(*)</label>
            <input
              type="text"
              name="brand"
              className="create-product-page__input"
              placeholder="Nhập thương hiệu"
              value={formData.brand}
              onChange={handleChange}
            />
          </div>

          <div className="create-product-page__form-group">
            <label className="create-product-page__label">
              Mô tả sản phẩm
            </label>
            <textarea
              name="description"
              className="create-product-page__textarea"
              placeholder="Nhập mô tả sản phẩm"
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
              style={{
                minHeight: imagePreview ? "250px" : "120px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "15px"
              }}
            >
              <input
                id="file-upload"
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />

              {imagePreview && (
                <div style={{ marginBottom: "10px" }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: "200px",
                      maxHeight: "200px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "2px solid #e0e0e0"
                    }}
                  />
                </div>
              )}

              <button className="create-product-page__upload-btn" type="button">
                Add File
              </button>
              <span className="create-product-page__upload-text">
                {imageFile
                  ? `Selected: ${imageFile.name}`
                  : "Or drag and drop files"}
              </span>
            </div>
          </div>

          {/* Giá & Số lượng */}
          <div className="create-product-page__form-group">
            <label className="create-product-page__section-title">
              Giá & Số lượng
            </label>
            <div className="create-product-page__row-3">
              <div>
                <label className="create-product-page__label">Đơn giá(*)</label>
                <input
                  type="number"
                  name="price"
                  className="create-product-page__input"
                  placeholder="0"
                  min="0"
                  step="1000"
                  value={formData.price}
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
                  placeholder="0"
                  min="0"
                  value={formData.quantity}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Danh mục & Trạng thái */}
          <div className="create-product-page__row-2 create-product-page__form-group">
            <div>
              <label className="create-product-page__label">Danh mục(*)</label>
              <select
                name="category_id"
                className="create-product-page__select"
                value={formData.category_id}
                onChange={handleChange}
              >
                <option value="">Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="create-product-page__label">Trạng thái</label>
              <div className="create-product-page__radio-group">
                <label
                  className={`create-product-page__radio-label ${formData.status === 1 ? "active" : ""
                    }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value="1"
                    checked={formData.status === 1}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: parseInt(e.target.value),
                      }))
                    }
                  />
                  Đang bán
                </label>
                <label
                  className={`create-product-page__radio-label ${formData.status === 2 ? "active" : ""
                    }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value="2"
                    checked={formData.status === 2}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: parseInt(e.target.value),
                      }))
                    }
                  />
                  Sắp hết
                </label>
                <label
                  className={`create-product-page__radio-label ${formData.status === 3 ? "active" : ""
                    }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value="3"
                    checked={formData.status === 3}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: parseInt(e.target.value),
                      }))
                    }
                  />
                  Hết hàng
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="create-product-page__bottom-actions">
          <button
            type="button"
            className="create-product-page__btn create-product-page__btn--cancel"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Hủy
          </button>
          <button
            type="button"
            className="create-product-page__btn create-product-page__btn--save"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;