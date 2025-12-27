import React, { useState } from "react";
import { Search, Edit2, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../layout_default/Sidebar";
import "./product.scss";

const ProductPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const products = [
    {
      id: 1,
      name: "Son Lì Velvet Story",
      variant: "Màu: True Red",
      category: "Son môi",
      price: 1250000,
      stock: 45,
      maxStock: 100,
      status: "selling",
      image:
        "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      name: "Kem Nền Vanish Seamless",
      variant: "Màu: Porcelain",
      category: "Kem nền",
      price: 1800000,
      stock: 12,
      maxStock: 100,
      status: "low",
      image:
        "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=100&h=100&fit=crop",
    },
    {
      id: 3,
      name: "Phấn Má Hồng Ambient",
      variant: "Màu: Diffused Heat",
      category: "Má hồng",
      price: 1500000,
      stock: 0,
      maxStock: 100,
      status: "out",
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop",
    },
    {
      id: 4,
      name: "Mascara Caution Extreme",
      variant: "Màu: Black",
      category: "Mắt",
      price: 980000,
      stock: 88,
      maxStock: 100,
      status: "selling",
      image:
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&h=100&fit=crop",
    },
    {
      id: 5,
      name: "Kem Lót Veil Mineral",
      variant: "Loại: 30ml",
      category: "Kem lót",
      price: 1950000,
      stock: 5,
      maxStock: 100,
      status: "low",
      image:
        "https://images.unsplash.com/photo-1556228720-192752544a48?w=100&h=100&fit=crop",
    },
    {
      id: 6,
      name: "Kẻ Mắt Nước 1.5MM",
      variant: "Màu: Obsidian",
      category: "Mắt",
      price: 550000,
      stock: 120,
      maxStock: 150,
      status: "selling",
      image:
        "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=100&h=100&fit=crop",
    },
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusText = (status) => {
    switch (status) {
      case "selling":
        return "Đang bán";
      case "low":
        return "Sắp hết";
      case "out":
        return "Hết hàng";
      default:
        return status;
    }
  };

  const getStockLevelClass = (stock) => {
    if (stock === 0) return "product-page__progress-fill--low";
    if (stock < 20) return "product-page__progress-fill--medium";
    return "product-page__progress-fill--high";
  };

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
            <option value="lipstick">Son môi</option>
            <option value="foundation">Kem nền</option>
            <option value="eye">Mắt</option>
          </select>
        </div>

        {/* Status Tabs */}
        <div className="product-page__tabs">
          <span className="product-page__tab-label">Trạng thái:</span>
          <button
            className={`product-page__tab-btn ${
              statusFilter === "all" ? "product-page__tab-btn--active" : ""
            }`}
            onClick={() => setStatusFilter("all")}
          >
            Tất cả
          </button>
          <button
            className={`product-page__tab-btn ${
              statusFilter === "selling" ? "product-page__tab-btn--active" : ""
            }`}
            onClick={() => setStatusFilter("selling")}
          >
            <span className="product-page__tab-btn--dot green"></span>
            Còn hàng
          </button>
          <button
            className={`product-page__tab-btn ${
              statusFilter === "low" ? "product-page__tab-btn--active" : ""
            }`}
            onClick={() => setStatusFilter("low")}
          >
            <span className="product-page__tab-btn--dot orange"></span>
            Sắp hết
          </button>
          <button
            className={`product-page__tab-btn ${
              statusFilter === "out" ? "product-page__tab-btn--active" : ""
            }`}
            onClick={() => setStatusFilter("out")}
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
              {products.map((product, index) => (
                <tr
                  key={product.id}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <td className="product-page__stt">{index + 1}</td>
                  <td>
                    <div className="product-page__product-info">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-page__product-img"
                        loading="lazy"
                      />
                      <div className="product-page__product-detail">
                        <span className="product-page__product-name">
                          {product.name}
                        </span>
                        {/* Đã xóa phần hiển thị ID ở đây */}
                        <span className="product-page__product-variant">
                          {product.variant}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td>
                    <span className="product-page__price">
                      {formatPrice(product.price)}
                    </span>
                  </td>
                  <td>
                    <div className="product-page__stock-wrapper">
                      <span className="product-page__stock-number">
                        {product.stock}
                      </span>
                      <div className="product-page__progress-bg">
                        <div
                          className={`product-page__progress-fill ${getStockLevelClass(
                            product.stock
                          )}`}
                          style={{
                            width: `${Math.min(
                              (product.stock / product.maxStock) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`product-page__status product-page__status--${product.status}`}
                    >
                      {getStatusText(product.status)}
                    </span>
                  </td>
                  <td>
                    <div className="product-page__actions">
                      <button
                        className="product-page__action-btn product-page__action-btn--edit"
                        onClick={() =>
                          navigate(`/admin/product/edit/${product.id}`)
                        }
                      >
                        <Edit2 size={16} />
                      </button>
                      <button className="product-page__action-btn product-page__action-btn--delete">
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
            Hiển thị 1-6 trong số 128 sản phẩm
          </div>
          <div className="product-page__pagination-controls">
            <button className="product-page__pagination-btn">&lt;</button>
            <button className="product-page__pagination-btn product-page__pagination-btn--active">
              1
            </button>
            <button className="product-page__pagination-btn">2</button>
            <button className="product-page__pagination-btn">3</button>
            <button className="product-page__pagination-btn">...</button>
            <button className="product-page__pagination-btn">12</button>
            <button className="product-page__pagination-btn">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
