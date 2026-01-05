import React, { useState } from "react";
import { Search, Filter, Eye, Check, X, MessageSquare } from "lucide-react";
import Sidebar from "../layout_default/Sidebar";
import orderService from "../../../service/admin/orderService";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./order.scss";

const OrderPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    } catch (err) {
      alert(err.response?.data?.detail || "Không thể duyệt đơn");
    }
  };

  const handleCancel = async (orderId) => {
    if (!confirm("Bạn có chắc muốn hủy đơn này?")) return;

    try {
      await orderService.cancelOrder(orderId);
      loadData();
    } catch (err) {
      alert(err.response?.data?.detail || "Không thể hủy đơn");
    }
  };

  // Cập nhật phần renderActions để dùng Icon
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
            >
              <Eye size={18} />
            </button>
          </>
        );
      case "Đang giao":
        return (
          <button
            className="order-page__btn-action order-page__btn-action--view"
            title="Xem chi tiết"
          >
            <Eye size={18} />
          </button>
        );
      case "Đã giao":
        return (
          <button
            className="order-page__btn-action order-page__btn-action--view"
            title="Xem chi tiết"
          >
            <Eye size={18} />
          </button>

        );
      case "Đã hủy":
        return (
          <button
            className="order-page__btn-action order-page__btn-action--view"
            title="Xem chi tiết"
          >
            <Eye size={18} />
          </button>
        );
      default:
        return null;
    }
  };

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((order) => order.status === activeTab);

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
            <input type="text" placeholder="Tìm theo ID, Tên khách hàng..." />
          </div>
          <div className="order-page__filter-group">
            <span>Trạng thái:</span>
            <select>
              <option>Tất cả</option>
              <option>Mới nhất</option>
              <option>Cũ nhất</option>
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
              {filteredOrders.map((order) => (
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
              Hiển thị 1 đến 5 của 128 kết quả
            </span>
            <button className="order-page__page-btn">&lt;</button>
            <button className="order-page__page-btn order-page__page-btn--active">
              1
            </button>
            <button className="order-page__page-btn">2</button>
            <button className="order-page__page-btn">...</button>
            <button className="order-page__page-btn">24</button>
            <button className="order-page__page-btn">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
