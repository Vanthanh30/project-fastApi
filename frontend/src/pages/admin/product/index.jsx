import React, { useState, useEffect } from "react";
import { Search, Edit2, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../layout_default/Sidebar";
import ProductService from "../../../service/admin/productService";
import "./product.scss";

const ProductPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load products từ API
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await ProductService.getAllProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await ProductService.deleteProduct(productId);
        alert("Xóa sản phẩm thành công!");
        loadProducts(); // Reload danh sách
      } catch (err) {
        alert(`Lỗi: ${err.message}`);
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return "Đang bán";
      case 2:
        return "Sắp hết";
      case 3:
        return "Hết hàng";
      default:
        return "Không xác định";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 1:
        return "selling";
      case 2:
        return "low";
      case 3:
        return "out";
      default:
        return "selling";
    }
  };

  const getStockLevelClass = (stock) => {
    if (stock === 0) return "product-page__progress-fill--low";
    if (stock < 20) return "product-page__progress-fill--medium";
    return "product-page__progress-fill--high";
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toString().includes(searchTerm);

    const matchCategory =
      selectedCategory === "all" ||
      product.category?.name === selectedCategory;

    const matchStatus =
      statusFilter === "all" || product.status.toString() === statusFilter;

    return matchSearch && matchCategory && matchStatus;
  });

  if (loading) {
    return (
      <div className="product-page">
        <Sidebar />
        <div className="product-page__content">
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-page">
        <Sidebar />
        <div className="product-page__content">
          <p style={{ color: "red" }}>Lỗi: {error}</p>
          <button onClick={loadProducts}>Thử lại</button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-page">
      <Sidebar />

      <div className="product-page__content">
        {/* Header */}
        <div className="product-page__header">
          <div className="product-page__header-info">
            <h1 className="product-page__title">Quản lý sản phẩm</h1>
            <p className="product-page__subtitle">
              Quản lý danh sách, tồn kho và giá cả của các sản phẩm mỹ phẩm cao
              cấp.
            </p>
          </div>
          <button
            type="button"
            className="product-page__add-btn"
            onClick={() => navigate("/admin/product/create")}
          >
            <Plus size={18} />
            Thêm sản phẩm mới
          </button>
        </div>

        {/* Toolbar */}
        <div className="product-page__toolbar">
          <div className="product-page__search">
            <Search className="product-page__search-icon" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, ID, hoặc mã SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="product-page__search-input"
            />
          </div>
          <select
            className="product-page__category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Tất cả danh mục</option>
            <option value="Son môi">Son môi</option>
            <option value="Kem nền">Kem nền</option>
            <option value="Mắt">Mắt</option>
          </select>
        </div>

        {/* Status Tabs */}
        <div className="product-page__tabs">
          <span className="product-page__tab-label">Trạng thái:</span>
          <button
            className={`product-page__tab-btn ${statusFilter === "all" ? "product-page__tab-btn--active" : ""
              }`}
            onClick={() => setStatusFilter("all")}
          >
            Tất cả
          </button>
          <button
            className={`product-page__tab-btn ${statusFilter === "1" ? "product-page__tab-btn--active" : ""
              }`}
            onClick={() => setStatusFilter("1")}
          >
            <span className="product-page__tab-btn--dot green"></span>
            Còn hàng
          </button>
          <button
            className={`product-page__tab-btn ${statusFilter === "2" ? "product-page__tab-btn--active" : ""
              }`}
            onClick={() => setStatusFilter("2")}
          >
            <span className="product-page__tab-btn--dot orange"></span>
            Sắp hết
          </button>
          <button
            className={`product-page__tab-btn ${statusFilter === "3" ? "product-page__tab-btn--active" : ""
              }`}
            onClick={() => setStatusFilter("3")}
          >
            <span className="product-page__tab-btn--dot red"></span>
            Hết hàng
          </button>
        </div>

        {/* Table */}
        <div className="product-page__table-wrapper">
          <table className="product-page__table">
            <thead>
              <tr>
                <th style={{ textAlign: "center", width: "50px" }}>STT</th>
                <th>Sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Tồn kho</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr
                  key={product.id}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <td className="product-page__stt">{index + 1}</td>
                  <td>
                    <div className="product-page__product-info">
                      <img
                        src={ProductService.getImageUrl(product.image)}
                        alt={product.name}
                        className="product-page__product-img"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/100";
                        }}
                      />
                      <div className="product-page__product-detail">
                        <span className="product-page__product-name">
                          {product.name}
                        </span>
                        <span className="product-page__product-variant">
                          {product.brand || "N/A"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>{product.category?.name || "N/A"}</td>
                  <td>
                    <span className="product-page__price">
                      {formatPrice(product.price)}
                    </span>
                  </td>
                  <td>
                    <div className="product-page__stock-wrapper">
                      <span className="product-page__stock-number">
                        {product.quantity}
                      </span>
                      <div className="product-page__progress-bg">
                        <div
                          className={`product-page__progress-fill ${getStockLevelClass(
                            product.quantity
                          )}`}
                          style={{
                            width: `${Math.min(
                              (product.quantity / 100) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`product-page__status product-page__status--${getStatusClass(
                        product.status
                      )}`}
                    >
                      {getStatusText(product.status)}
                    </span>
                  </td>
                  <td>
                    <div className="product-page__actions">
                      <button
                        type="button"
                        className="product-page__action-btn product-page__action-btn--edit"
                        onClick={() =>
                          navigate(`/admin/product/edit/${product.id}`)
                        }
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        type="button"
                        className="product-page__action-btn product-page__action-btn--delete"
                        onClick={() => handleDelete(product.id)}
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
        <div className="product-page__pagination">
          <div className="product-page__pagination-info">
            Hiển thị {filteredProducts.length} sản phẩm
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;