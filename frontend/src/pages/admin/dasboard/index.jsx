import React, { useEffect, useState } from "react";
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
import dashboardService from "../../../service/admin/dashboardService";
import "./dashboard.scss";

const Dashboard = () => {
  const [statsData, setStatsData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // Load dashboard data
  // =========================
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const [
          stats,
          revenue,
          bestSellersRes,
          recentOrdersRes,
        ] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRevenueByMonth(new Date().getFullYear()),
          dashboardService.getBestSellers(),
          dashboardService.getRecentOrders(),
        ]);

        // ===== Stats cards =====
        setStatsData([
          {
            title: "Tổng doanh thu",
            value: stats.total_revenue,
            icon: <Wallet size={24} />,
            type: "money",
            change: stats.revenue_change,
            trend: "up",
          },
          {
            title: "Đơn hàng mới",
            value: stats.new_orders,
            icon: <ShoppingBag size={24} />,
            type: "order",
            change: stats.order_change,
            trend: "up",
          },
          {
            title: "Sản phẩm",
            value: stats.total_products,
            icon: <Box size={24} />,
            type: "product",
            change: stats.product_change,
            trend: "neutral",
          },
          {
            title: "Tài khoản",
            value: stats.total_users,
            icon: <Users size={24} />,
            type: "user",
            change: stats.user_change,
            trend: "up",
          },
        ]);

        // ===== Revenue chart =====
        setChartData(
          revenue.map((item) => ({
            name: `T${item.month}`,
            revenue: item.revenue,
          }))
        );

        // ===== Best sellers =====
        setBestSellers(
          bestSellersRes.map((p) => ({
            id: p.id,
            name: p.name,
            category: `${p.sold} Đã bán`,
            price: p.price,
            img: p.image,
          }))
        );

        // ===== Recent orders =====
        setRecentOrders(
          recentOrdersRes.map((o) => ({
            id: `#ORD-${o.id}`,
            customer: o.customer,
            avatar: o.customer
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase(),
            date: o.date,
            items: `${o.items} sản phẩm`,
            status: o.status,
            total: o.total,
          }))
        );
      } catch (error) {
        console.error("Dashboard load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // =========================
  // Helpers
  // =========================
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const formatNumber = (num) =>
    new Intl.NumberFormat("vi-VN").format(num);

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

  const customLabelFormatter = (label) =>
    `Tháng ${label.replace("T", "")}`;

  // =========================
  // Loading UI
  // =========================
  if (loading) {
    return (
      <div className="dashboard-page">
        <Sidebar />
        <div className="dashboard-page__content">
          <p>Đang tải dashboard...</p>
        </div>
      </div>
    );
  }

  // =========================
  // Render
  // =========================
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
                <span className="dashboard-page__stat-label">
                  {stat.title}
                </span>
                <span className="dashboard-page__stat-value">
                  {stat.type === "money"
                    ? formatCurrency(stat.value)
                    : formatNumber(stat.value)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 2. Chart & Best Sellers */}
        <div className="dashboard-page__charts-grid">
          {/* Chart */}
          <div className="dashboard-page__section-card">
            <div className="dashboard-page__section-header">
              <h3>Biểu đồ doanh thu</h3>
              <span>{new Date().getFullYear()}</span>
            </div>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <AreaChart data={chartData}>
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
                  <XAxis dataKey="name" tick={{ fill: "#9ca3af" }} />
                  <YAxis hide />
                  <CartesianGrid vertical={false} stroke="#f3f4f6" />
                  <Tooltip
                    labelFormatter={customLabelFormatter}
                    formatter={(value) => [
                      formatCurrency(value),
                      "Doanh thu",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2563eb"
                    strokeWidth={3}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Best sellers */}
          <div className="dashboard-page__section-card">
            <div className="dashboard-page__section-header">
              <h3>Sản phẩm bán chạy</h3>
            </div>
            <div className="dashboard-page__best-seller-list">
              {bestSellers.map((product) => (
                <div
                  key={product.id}
                  className="dashboard-page__product-item"
                >
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

        {/* 3. Recent Orders */}
        <div className="dashboard-page__section-card">
          <div className="dashboard-page__section-header">
            <h3>Đơn hàng gần đây</h3>
          </div>

          <div className="dashboard-page__table-wrapper">
            <table className="dashboard-page__table">
              <thead>
                <tr>
                  <th>STT</th>
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
                    <td>{index + 1}</td>
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

          <div className="dashboard-page__view-all">
            Xem tất cả &gt;&gt;
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
