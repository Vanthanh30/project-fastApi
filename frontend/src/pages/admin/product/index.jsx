import React, { useState, useEffect } from "react";
import { Edit2, Trash2, Plus, Loader, Package, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../layout_default/Sidebar";
import Pagination from "../../../components/Pagination/Pagination";
import ProductFilter from "../../../components/Filter/Productfilter";
import ProductService from "../../../service/admin/productService";
import categoryService from "../../../service/admin/categoryService";
import "./product.scss";

const ProductPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 10;
  const getAutoStatus = (quantity) => {
    if (quantity === 0) return 3;
    if (quantity < 20) return 2;
    return 1;
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory, statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [productsData, categoriesData] = await Promise.all([
        ProductService.getAllProducts(),
        categoryService.getAll()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || "Không thể tải dữ liệu");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((product) => {
        const name = product.name?.toLowerCase().trim() || "";
        const brand = product.brand?.toLowerCase().trim() || "";
        const id = product.id?.toString() || "";

        return (
          name.includes(searchLower) ||
          brand.includes(searchLower) ||
          id.includes(searchLower)
        );
      });
    }
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category?.name === selectedCategory
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((product) => {
        const autoStatus = getAutoStatus(product.quantity);
        return autoStatus.toString() === statusFilter;
      });
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await ProductService.deleteProduct(productId);

        const newTotalItems = filteredProducts.length - 1;
        const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);

        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }

        loadData();
        alert("Xóa sản phẩm thành công!");
      } catch (err) {
        alert(`Lỗi: ${err.message}`);
      }
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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

  // Pagination logic
  const totalItems = filteredProducts.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) {
    return (
      <div className="product-page">
        <Sidebar />
        <div className="product-page__content">
          <div className="product-page__loading">
            <Loader size={48} className="product-page__loading-icon" />
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-page">
        <Sidebar />
        <div className="product-page__content">
          <div className="product-page__error">
            <AlertCircle size={48} className="product-page__error-icon" />
            <p>{error}</p>
            <button onClick={loadData} className="product-page__retry-btn">
              Thử lại
            </button>
          </div>
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
              Quản lý danh sách, tồn kho và giá cả của các sản phẩm mỹ phẩm cao cấp
              {` (${filteredProducts.length} sản phẩm)`}
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
        <ProductFilter
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          categories={categories}
        />
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
          {currentItems.length === 0 ? (
            <div className="product-page__empty">
              <Package size={48} className="product-page__empty-icon" />
              <p className="product-page__empty-title">
                Không tìm thấy sản phẩm nào
              </p>
              <p className="product-page__empty-subtitle">
                Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc
              </p>
            </div>
          ) : (
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
                {currentItems.map((product, index) => {
                  // Tính toán trạng thái tự động dựa trên tồn kho
                  const autoStatus = getAutoStatus(product.quantity);

                  return (
                    <tr
                      key={product.id}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <td className="product-page__stt">
                        {indexOfFirstItem + index + 1}
                      </td>
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
                            autoStatus
                          )}`}
                        >
                          {getStatusText(autoStatus)}
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
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          showIfLessThan={4}
        />
      </div>
    </div>
  );
};

export default ProductPage;