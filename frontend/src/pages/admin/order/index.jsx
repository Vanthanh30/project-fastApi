import React, { useState, useEffect } from "react";
import { Search, Filter, Eye, Check, X, MessageSquare } from "lucide-react";
import Sidebar from "../layout_default/Sidebar";
import orderService from "../../../service/admin/orderService";
import { useNavigate } from "react-router-dom";

import "./order.scss";

const OrderPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("newest");

  // State cho popup
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const ordersData = await orderService.getAllOrders();
      setOrders(ordersData);
    } catch (err) {
      setError(err.message || "Không thể tải dữ liệu");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDateTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString("vi-VN");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Chờ xác nhận":
        return <span className="order-page__status-badge order-page__status-badge--pending">● Chờ xác nhận</span>;
      case "Đang giao":
        return <span className="order-page__status-badge order-page__status-badge--delivering">● Đang giao</span>;
      case "Đã giao":
        return <span className="order-page__status-badge order-page__status-badge--delivered">● Đã giao</span>;
      case "Đã hủy":
        return <span className="order-page__status-badge order-page__status-badge--cancelled">● Đã hủy</span>;
      default:
        return null;
    }
  };

  const handleApprove = async (orderId) => {
    if (!confirm("Bạn có chắc muốn duyệt đơn này?")) return;

    try {
      await orderService.approveOrder(orderId);
      loadData();
      setShowPopup(false);
    } catch (err) {
      alert(err.response?.data?.detail || "Không thể duyệt đơn");
    }
  };

  const handleCancel = async (orderId) => {
    if (!confirm("Bạn có chắc muốn hủy đơn này?")) return;

    try {
      await orderService.cancelOrder(orderId);
      loadData();
      setShowPopup(false);
    } catch (err) {
      alert(err.response?.data?.detail || "Không thể hủy đơn");
    }
  };

  // Hàm xem chi tiết đơn hàng
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowPopup(true);
  };

  // Hàm đóng popup
  const closePopup = () => {
    setShowPopup(false);
    setSelectedOrder(null);
  };

  const renderActions = (order) => {
    switch (order.status) {
      case "Chờ xác nhận":
        return (
          <>
            <button
              className="order-page__btn-action order-page__btn-action--cancel"
              title="Hủy đơn"
              onClick={() => handleCancel(order.id)}
            >
              <X size={18} />
            </button>
            <button
              className="order-page__btn-action order-page__btn-action--confirm"
              title="Xác nhận"
              onClick={() => handleApprove(order.id)}
            >
              <Check size={18} />
            </button>
            <button
              className="order-page__btn-action order-page__btn-action--view"
              title="Xem chi tiết"
              onClick={() => handleViewOrder(order)}
            >
              <Eye size={18} />
            </button>
          </>
        );
      case "Đang giao":
      case "Đã giao":
      case "Đã hủy":
        return (
          <button
            className="order-page__btn-action order-page__btn-action--view"
            title="Xem chi tiết"
            onClick={() => handleViewOrder(order)}
          >
            <Eye size={18} />
          </button>
        );
      default:
        return null;
    }
  };

  const processedOrders = orders
    .filter((order) => {
      const keyword = searchTerm.toLowerCase();
      return (
        order.id.toString().includes(keyword) ||
        order.full_name.toLowerCase().includes(keyword) ||
        order.email.toLowerCase().includes(keyword)
      );
    })
    .filter((order) =>
      activeTab === "all" ? true : order.status === activeTab
    )
    .sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortType === "newest" ? dateB - dateA : dateA - dateB;
    });

  const totalItems = processedOrders.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginatedOrders = processedOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="order-page">
      <Sidebar />
      <div className="order-page__content">
        <div className="order-page__header">
          <h1 className="order-page__title">Đơn hàng</h1>
          <p className="order-page__subtitle">
            Quản lý và theo dõi trạng thái các đơn hàng gần đây.
          </p>
        </div>

        <div className="order-page__toolbar">
          <div className="order-page__search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Tìm theo ID, Tên khách hàng..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="order-page__filter-group">
            <span>Trạng thái:</span>
            <select
              value={sortType}
              onChange={(e) => {
                setSortType(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
            </select>
          </div>
        </div>

        <div className="order-page__tabs">
          {[
            { id: "all", label: "TẤT CẢ" },
            { id: "Chờ xác nhận", label: "CHỜ XÁC NHẬN" },
            { id: "Đang giao", label: "ĐANG GIAO" },
            { id: "Đã giao", label: "ĐÃ GIAO" },
            { id: "Đã hủy", label: "ĐÃ HỦY" },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`order-page__tab-btn ${activeTab === tab.id ? "order-page__tab-btn--active" : ""
                }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="order-page__table-wrapper">
          <table className="order-page__table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" className="custom-checkbox" />
                </th>
                <th>ID ĐƠN HÀNG</th>
                <th>KHÁCH HÀNG</th>
                <th>NGÀY ĐẶT</th>
                <th>TỔNG TIỀN</th>
                <th>TRẠNG THÁI</th>
                <th>HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <input type="checkbox" className="custom-checkbox" />
                  </td>
                  <td>
                    <span className="order-page__id">{order.id}</span>
                  </td>
                  <td>
                    <div className="order-page__customer">
                      <span>{order.full_name}</span>
                      <span>{order.email}</span>
                    </div>
                  </td>
                  <td>
                    <div className="order-page__date">
                      <span>{formatDateTime(order.created_at)}</span>
                    </div>
                  </td>
                  <td>
                    <span className="order-page__total">
                      {formatCurrency(order.total)}
                    </span>
                  </td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>
                    <div className="order-page__actions">
                      {renderActions(order)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="order-page__pagination">
            <span
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                marginRight: "auto",
              }}
            >
              Hiển thị {(currentPage - 1) * pageSize + 1} đến{" "}
              {Math.min(currentPage * pageSize, totalItems)} của {totalItems} kết quả
            </span>

            <button
              className="order-page__page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              &lt;
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(0, 5)
              .map((page) => (
                <button
                  key={page}
                  className={`order-page__page-btn ${currentPage === page ? "order-page__page-btn--active" : ""
                    }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

            <button
              className="order-page__page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Popup chi tiết đơn hàng */}
      {showPopup && selectedOrder && (
        <div className="order-popup-overlay" onClick={closePopup}>
          <div className="order-popup" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="order-popup__header">
              <h2 className="order-popup__title">
                Chi tiết đơn hàng #{selectedOrder.id}
              </h2>
              <button className="order-popup__close" onClick={closePopup}>
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="order-popup__content">
              {/* Trạng thái */}
              <div className="order-popup__section">
                <label className="order-popup__label">Trạng thái</label>
                {getStatusBadge(selectedOrder.status)}
              </div>

              {/* Thông tin khách hàng */}
              <div className="order-popup__grid">
                <div className="order-popup__field">
                  <label className="order-popup__label">Khách hàng</label>
                  <p className="order-popup__value">{selectedOrder.full_name}</p>
                </div>
                <div className="order-popup__field">
                  <label className="order-popup__label">Email</label>
                  <p className="order-popup__value">{selectedOrder.email}</p>
                </div>
                <div className="order-popup__field">
                  <label className="order-popup__label">Số điện thoại</label>
                  <p className="order-popup__value">{selectedOrder.phone || "N/A"}</p>
                </div>
                <div className="order-popup__field">
                  <label className="order-popup__label">Ngày đặt</label>
                  <p className="order-popup__value">{formatDateTime(selectedOrder.created_at)}</p>
                </div>
              </div>

              {/* Địa chỉ */}
              <div className="order-popup__section">
                <label className="order-popup__label">Địa chỉ giao hàng</label>
                <p className="order-popup__value">{selectedOrder.address || "Chưa có thông tin"}</p>
              </div>

              {/* Danh sách sản phẩm */}
              <div className="order-popup__section">
                <label className="order-popup__label">Sản phẩm</label>
                <div className="order-popup__products">
                  <table className="order-popup__table">
                    <thead>
                      <tr>
                        <th>Tên sản phẩm</th>
                        <th>Số lượng</th>
                        <th>Đơn giá</th>
                        <th>Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items && selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map((item, index) => (
                          <tr key={index}>
                            <td>{item.product_name || item.name || "N/A"}</td>
                            <td className="text-center">{item.quantity}</td>
                            <td>{formatCurrency(item.price)}</td>
                            <td>{formatCurrency(item.quantity * item.price)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">Không có sản phẩm</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Ghi chú */}
              {selectedOrder.note && (
                <div className="order-popup__section">
                  <label className="order-popup__label">Ghi chú</label>
                  <p className="order-popup__value">{selectedOrder.note}</p>
                </div>
              )}

              {/* Tổng tiền */}
              <div className="order-popup__total">
                <span className="order-popup__total-label">Tổng cộng:</span>
                <span className="order-popup__total-value">{formatCurrency(selectedOrder.total)}</span>
              </div>

              {/* Actions */}
              <div className="order-popup__actions">
                {selectedOrder.status === "Chờ xác nhận" && (
                  <>
                    <button
                      className="order-popup__btn order-popup__btn--confirm"
                      onClick={() => handleApprove(selectedOrder.id)}
                    >
                      <Check size={18} />
                      Xác nhận đơn hàng
                    </button>
                    <button
                      className="order-popup__btn order-popup__btn--cancel"
                      onClick={() => handleCancel(selectedOrder.id)}
                    >
                      <X size={18} />
                      Hủy đơn hàng
                    </button>
                  </>
                )}
                <button
                  className="order-popup__btn order-popup__btn--close"
                  onClick={closePopup}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;