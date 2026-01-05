import React, { useState } from "react";
import { Search, Filter, Eye, Check, X, MessageSquare } from "lucide-react"; // Import thêm icon
import Sidebar from "../layout_default/Sidebar";
import "./order.scss";

const OrderPage = () => {
  const [activeTab, setActiveTab] = useState("all");

  const orders = [
    {
      id: "#ORD-7782",
      customerName: "Trần Thị B",
      email: "tranb@gmail.com",
      date: "24/10/2023",
      time: "10:30 AM",
      total: 5800000,
      status: "pending",
    },
    {
      id: "#ORD-7783",
      customerName: "Nguyễn Văn A",
      email: "nguyena@gmail.com",
      date: "24/10/2023",
      time: "09:15 AM",
      total: 1250000,
      status: "delivering",
    },
    {
      id: "#ORD-7784",
      customerName: "Lê Thị C",
      email: "lec@gmail.com",
      date: "23/10/2023",
      time: "14:20 PM",
      total: 3400000,
      status: "delivered",
    },
    {
      id: "#ORD-7785",
      customerName: "Phạm Văn D",
      email: "phamd@gmail.com",
      date: "23/10/2023",
      time: "08:45 AM",
      total: 890000,
      status: "cancelled",
    },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="order-page__status-badge order-page__status-badge--pending">
            ● Chờ xác nhận
          </span>
        );
      case "delivering":
        return (
          <span className="order-page__status-badge order-page__status-badge--delivering">
            ● Đang giao
          </span>
        );
      case "delivered":
        return (
          <span className="order-page__status-badge order-page__status-badge--delivered">
            ● Đã giao
          </span>
        );
      case "cancelled":
        return (
          <span className="order-page__status-badge order-page__status-badge--cancelled">
            ● Đã hủy
          </span>
        );
      default:
        return null;
    }
  };

  // Cập nhật phần renderActions để dùng Icon
  const renderActions = (status) => {
    switch (status) {
      case "pending":
        return (
          <>
            <button
              className="order-page__btn-action order-page__btn-action--cancel"
              title="Hủy đơn"
            >
              <X size={18} />
            </button>
            <button
              className="order-page__btn-action order-page__btn-action--confirm"
              title="Xác nhận"
            >
              <Check size={18} />
            </button>
          </>
        );
      case "delivering":
        return (
          <>
            <button
              className="order-page__btn-action order-page__btn-action--cancel"
              title="Hủy giao"
            >
              <X size={18} />
            </button>
            <button
              className="order-page__btn-action order-page__btn-action--confirm"
              title="Xác nhận đã giao"
            >
              <Check size={18} />
            </button>
          </>
        );
      case "delivered":
        return (
          <button
            className="order-page__btn-action order-page__btn-action--contact"
            title="Liên hệ khách hàng"
          >
            <MessageSquare size={18} />
          </button>
        );
      case "cancelled":
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
            { id: "pending", label: "CHỜ XÁC NHẬN" },
            { id: "delivering", label: "ĐANG GIAO" },
            { id: "delivered", label: "ĐÃ GIAO" },
            { id: "cancelled", label: "ĐÃ HỦY" },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`order-page__tab-btn ${
                activeTab === tab.id ? "order-page__tab-btn--active" : ""
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
                      <span>{order.customerName}</span>
                      <span>{order.email}</span>
                    </div>
                  </td>
                  <td>
                    <div className="order-page__date">
                      <span>{order.date}</span>
                      <span>{order.time}</span>
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
                      {renderActions(order.status)}
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
