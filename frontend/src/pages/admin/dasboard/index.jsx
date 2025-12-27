import React from "react";
import { Wallet, ShoppingBag, Box, Users } from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import Sidebar from "../layout_default/Sidebar";
import "./dashboard.scss";

const Dashboard = () => {
  // --- Mock Data (Cập nhật sang dữ liệu 12 tháng) ---
  const statsData = [
    {
      title: "Tổng doanh thu",
      value: 1250000000,
      icon: <Wallet size={24} />,
      type: "money",
      change: "+12.5%",
      trend: "up",
    },
    {
      title: "Đơn hàng mới",
      value: 145,
      icon: <ShoppingBag size={24} />,
      type: "order",
      change: "+5.2%",
      trend: "up",
    },
    {
      title: "Sản phẩm",
      value: 320,
      icon: <Box size={24} />,
      type: "product",
      change: "0.0%",
      trend: "neutral",
    },
    {
      title: "Tài khoản",
      value: 58,
      icon: <Users size={24} />,
      type: "user",
      change: "+8.1%",
      trend: "up",
    },
  ];

  const chartData = [
    { name: "T1", revenue: 4000000 },
    { name: "T2", revenue: 3000000 },
    { name: "T3", revenue: 2000000 },
    { name: "T4", revenue: 2780000 },
    { name: "T5", revenue: 1890000 },
    { name: "T6", revenue: 2390000 },
    { name: "T7", revenue: 3490000 },
    { name: "T8", revenue: 2000000 },
    { name: "T9", revenue: 2780000 },
    { name: "T10", revenue: 1890000 },
    { name: "T11", revenue: 2390000 },
    { name: "T12", revenue: 3490000 },
  ];

  const bestSellers = [
    {
      id: 1,
      name: "Ambient Palette",
      category: "Makeup • 1.2k Đã bán",
      price: 1200000,
      img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      name: "Vanish Foundation",
      category: "Face • 980 Đã bán",
      price: 1200000,
      img: "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=100&h=100&fit=crop",
    },
    {
      id: 3,
      name: "Unlocked Mascara",
      category: "Eyes • 850 Đã bán",
      price: 1200000,
      img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&h=100&fit=crop",
    },
    {
      id: 4,
      name: "Velvet Lipstick",
      category: "Lips • 620 Đã bán",
      price: 1200000,
      img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=100&h=100&fit=crop",
    },
  ];

  const recentOrders = [
    {
      id: "#ORD-7829",
      customer: "Nguyen Thao",
      avatar: "NT",
      date: "24/10/2023",
      items: "3 sản phẩm",
      status: "completed",
      total: 4250000,
    },
    {
      id: "#ORD-7828",
      customer: "Le Minh",
      avatar: "LM",
      date: "24/10/2023",
      items: "1 sản phẩm",
      status: "pending",
      total: 1850000,
    },
    {
      id: "#ORD-7827",
      customer: "Tran Hung",
      avatar: "TH",
      date: "23/10/2023",
      items: "5 sản phẩm",
      status: "completed",
      total: 8900000,
    },
    {
      id: "#ORD-7826",
      customer: "Pham Anh",
      avatar: "PA",
      date: "23/10/2023",
      items: "2 sản phẩm",
      status: "cancelled",
      total: 2100000,
    },
  ];

  // Helper functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="dashboard-page__status-pill dashboard-page__status-pill--completed">
            ● Hoàn thành
          </span>
        );
      case "pending":
        return (
          <span className="dashboard-page__status-pill dashboard-page__status-pill--pending">
            ● Chờ xử lý
          </span>
        );
      case "cancelled":
        return (
          <span className="dashboard-page__status-pill dashboard-page__status-pill--cancelled">
            ● Đã hủy
          </span>
        );
      default:
        return status;
    }
  };

  // Hàm tùy chỉnh hiển thị tiêu đề Tooltip (T1 -> Tháng 1)
  const customLabelFormatter = (label) => {
    return `Tháng ${label.replace("T", "")}`;
  };

  return (
    <div className="dashboard-page">
      <Sidebar />

      <div className="dashboard-page__content">
        {/* 1. Stats Grid */}
        <div className="dashboard-page__stats-grid">
          {statsData.map((stat, index) => (
            <div key={index} className="dashboard-page__stat-card">
              <div className="dashboard-page__stat-header">
                <div
                  className={`dashboard-page__stat-icon dashboard-page__stat-icon--${stat.type}`}
                >
                  {stat.icon}
                </div>
                <span
                  className={`dashboard-page__stat-badge dashboard-page__stat-badge--${stat.trend}`}
                >
                  {stat.change}
                </span>
              </div>
              <div className="dashboard-page__stat-info">
                <span className="dashboard-page__stat-label">{stat.title}</span>
                <span className="dashboard-page__stat-value">
                  {stat.type === "money"
                    ? formatCurrency(stat.value)
                    : formatNumber(stat.value)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 2. Middle Section: Chart & Best Sellers */}
        <div className="dashboard-page__charts-grid">
          {/* Left: Revenue Trend */}
          <div className="dashboard-page__section-card">
            <div className="dashboard-page__section-header">
              <h3>Biểu đồ doanh thu</h3>
              <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                Năm 2023
              </div>
            </div>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis hide={true} />
                  <CartesianGrid vertical={false} stroke="#f3f4f6" />

                  {/* Tooltip Customization */}
                  <Tooltip
                    labelFormatter={customLabelFormatter} // Đổi T1 -> Tháng 1
                    formatter={(value) => [formatCurrency(value), "Doanh thu"]} // Đổi revenue -> Doanh thu
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Doanh thu" // Tên hiển thị khi hover
                    stroke="#2563eb"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right: Best Sellers */}
          <div className="dashboard-page__section-card">
            <div className="dashboard-page__section-header">
              <h3>Sản phẩm bán chạy</h3>
              <button>Tất cả</button>
            </div>
            <div className="dashboard-page__best-seller-list">
              {bestSellers.map((product) => (
                <div key={product.id} className="dashboard-page__product-item">
                  <img src={product.img} alt={product.name} />
                  <div className="dashboard-page__product-info">
                    <h4>{product.name}</h4>
                    <span>{product.category}</span>
                  </div>
                  <span className="dashboard-page__product-price">
                    {formatCurrency(product.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Bottom Section: Recent Orders */}
        <div className="dashboard-page__section-card">
          <div className="dashboard-page__section-header">
            <h3>Đơn hàng gần đây</h3>
            <button
              style={{
                color: "#6b7280",
                fontWeight: "normal",
                border: "1px solid #e5e7eb",
                padding: "0.25rem 0.75rem",
                borderRadius: "6px",
                fontSize: "0.75rem",
              }}
            >
              Bộ lọc
            </button>
          </div>

          <div className="dashboard-page__table-wrapper">
            <table className="dashboard-page__table">
              <thead>
                <tr>
                  <th style={{ width: "60px", textAlign: "center" }}>STT</th>
                  <th>Khách hàng</th>
                  <th>Ngày đặt</th>
                  <th>Số lượng</th>
                  <th>Trạng thái</th>
                  <th>Tổng tiền</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, index) => (
                  <tr key={order.id}>
                    <td
                      style={{
                        textAlign: "center",
                        color: "#6b7280",
                        fontWeight: 500,
                      }}
                    >
                      {index + 1}
                    </td>
                    <td>
                      <div className="dashboard-page__customer-cell">
                        <div className="dashboard-page__avatar-circle">
                          {order.avatar}
                        </div>
                        <span>{order.customer}</span>
                      </div>
                    </td>
                    <td>{order.date}</td>
                    <td>{order.items}</td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>{formatCurrency(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="dashboard-page__view-all">Xem tất cả &gt;&gt;</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
