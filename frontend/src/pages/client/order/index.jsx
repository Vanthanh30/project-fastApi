import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LayoutDefault from "../layout_default/layout_default";
import "./order.scss";

const Order = () => {
  const [activeTab, setActiveTab] = useState("TẤT CẢ");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [selectedOrder, setSelectedOrder] = useState(null);

  const navigate = useNavigate();
  const tabs = ["TẤT CẢ", "Chờ xác nhận", "Đang giao", "Đã giao", "Đã hủy"];

  const fetchOrders = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const response = await axios.get("http://localhost:8000/orders/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Lỗi lấy đơn hàng:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) return;
    const token = localStorage.getItem("access_token");
    try {
      await axios.put(
        `http://localhost:8000/orders/${orderId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Hủy đơn hàng thành công!");
      fetchOrders();
      if (selectedOrder?.id === orderId) setSelectedOrder(null);
    } catch (error) {
      const msg = error.response?.data?.detail || "Không thể hủy đơn hàng";
      alert(msg);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("vi-VN") +
      " " +
      date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
    );
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      "Chờ xác nhận": { color: "pending", text: "Chờ xác nhận" },
      "Đang giao": { color: "delivering", text: "Đang giao" },
      "Đã giao": { color: "delivered", text: "Đã giao" },
      "Đã hủy": { color: "canceled", text: "Đã hủy" },
    };
    return statusMap[status] || { color: "default", text: status };
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "TẤT CẢ") return true;
    return order.status === activeTab;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <LayoutDefault>
      <div className="my-orders-page">
        <div className="container">
          <div className="my-orders-page__header">
            <h1 className="my-orders-page__title">Đơn hàng của tôi</h1>
            <p className="my-orders-page__subtitle">
              Theo dõi hành trình làm đẹp của bạn với LUMIÈRE.
            </p>
          </div>

          <div className="my-orders-page__tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`my-orders-page__tab ${
                  activeTab === tab ? "active" : ""
                }`}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="my-orders-page__list">
            {isLoading ? (
              <div className="my-orders-page__loading">Đang tải dữ liệu...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="my-orders-page__empty">
                <p>Không có đơn hàng nào ở trạng thái này.</p>
                <button className="btn-shop-now" onClick={() => navigate("/")}>
                  Khám phá sản phẩm ngay
                </button>
              </div>
            ) : (
              <>
                {currentOrders.map((order, index) => {
                  const statusInfo = getStatusBadge(order.status);
                  return (
                    <div
                      key={order.id}
                      className="my-orders-page__order-card"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="order-card__header">
                        <div className="order-card__id">
                          Mã đơn: <strong>#{order.id}</strong>
                        </div>
                        <span
                          className={`order-card__status order-card__status--${statusInfo.color}`}
                        >
                          {statusInfo.text}
                        </span>
                      </div>

                      <div className="order-card__body">
                        <div className="order-info-row">
                          <p className="order-card__date">
                            Ngày đặt: {formatDate(order.created_at)}
                          </p>
                          <p className="order-card__payment">
                            TT: {order.payment_method}
                          </p>
                        </div>
                        <div className="order-total-row">
                          <span>Tổng tiền:</span>
                          <strong className="total-price">
                            {formatCurrency(order.total)}
                          </strong>
                        </div>
                      </div>

                      <div className="order-card__footer">
                        <button
                          className="order-card__btn order-card__btn--secondary"
                          onClick={() => setSelectedOrder(order)}
                        >
                          Xem chi tiết
                        </button>

                        {order.status === "Chờ xác nhận" && (
                          <button
                            className="order-card__btn order-card__btn--danger"
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            Hủy đơn hàng
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {totalPages > 1 && (
                  <div className="pagination-container">
                    <div className="pagination-custom">
                      <button
                        className="pagination-custom__btn"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft size={20} />
                      </button>
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index}
                          className={`pagination-custom__number ${
                            currentPage === index + 1 ? "active" : ""
                          }`}
                          onClick={() => paginate(index + 1)}
                        >
                          {index + 1}
                        </button>
                      ))}
                      <button
                        className="pagination-custom__btn"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chi tiết đơn hàng #{selectedOrder.id}</h2>
              <span
                className={`status-badge ${
                  getStatusBadge(selectedOrder.status).color
                }`}
              >
                {selectedOrder.status}
              </span>
            </div>

            <div className="modal-body">
              <div className="info-section">
                <h3>Thông tin nhận hàng</h3>
                <p>
                  <strong>Người nhận:</strong> {selectedOrder.full_name}
                </p>
                <p>
                  <strong>Số điện thoại:</strong> {selectedOrder.phone}
                </p>
                <p>
                  <strong>Địa chỉ:</strong> {selectedOrder.address}
                </p>
                <p>
                  <strong>Email:</strong> {selectedOrder.email}
                </p>
                <p>
                  <strong>Thanh toán:</strong> {selectedOrder.payment_method}
                </p>
              </div>

              <div className="products-section">
                <h3>Sản phẩm</h3>
                <div className="product-list-scroll">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="product-item">
                      <div className="product-info">
                        <h4>{item.product?.name || "Sản phẩm"}</h4>
                        <p className="price">{formatCurrency(item.price)}</p>
                      </div>
                      <div className="product-qty">x{item.quantity}</div>
                      <div className="product-total">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="summary-section">
                <div className="summary-row total">
                  <span>Tổng cộng:</span>
                  <span>{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              {selectedOrder.status === "Chờ xác nhận" && (
                <button
                  className="btn-cancel"
                  onClick={() => handleCancelOrder(selectedOrder.id)}
                >
                  Hủy đơn hàng
                </button>
              )}
              <button
                className="btn-close"
                onClick={() => setSelectedOrder(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </LayoutDefault>
  );
};

export default Order;
