import React, { useState, useEffect } from "react";
import { Wallet, ShoppingBag, Box, Users, Loader, AlertCircle } from "lucide-react";
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
import ProductService from "../../../service/admin/productService";
import OrderService from "../../../service/admin/orderService";
import accountService from "../../../service/admin/accountService";
import "./dashboard.scss";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    bestSellers: [],
    recentOrders: [],
    chartData: []
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [products, orders, users] = await Promise.all([
        ProductService.getAllProducts(),
        OrderService.getAllOrders(),
        accountService.getAllUsers()
      ]);

      console.log('Products loaded:', products.length, products);
      console.log('Orders loaded:', orders.length, orders);
      console.log('Users loaded:', users.length, users);

      // Tính tổng doanh thu từ tổng giá tiền sản phẩm của đơn hàng "Đã giao"
      let totalRevenue = 0;
      orders
        .filter(order => order.status === "Đã giao")
        .forEach(order => {
          if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
              const itemTotal = (item.price || 0) * (item.quantity || 0);
              totalRevenue += itemTotal;
            });
          }
        });

      console.log('Total Revenue from product prices:', totalRevenue);

      // Tổng số đơn hàng
      const totalOrders = orders.length;

      // Tính số lượng đã bán cho từng sản phẩm từ đơn hàng "Đã giao"
      const productSales = {};

      orders
        .filter(order => order.status === "Đã giao")
        .forEach(order => {
          if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
              const productId = item.product_id || item.product?.id;
              if (productId) {
                const quantity = parseInt(item.quantity) || 0;
                productSales[productId] = (productSales[productId] || 0) + quantity;
              }
            });
          }
        });

      console.log('Product Sales from delivered orders:', productSales);

      // Tạo danh sách sản phẩm bán chạy với số lượng đã bán từ đơn hàng
      const bestSellers = products
        .map(product => {
          const soldQuantity = productSales[product.id] || 0;
          return {
            id: product.id,
            name: product.name,
            category: `${product.category?.name || 'N/A'} • ${soldQuantity} Đã bán`,
            price: product.price,
            img: ProductService.getImageUrl(product.image),
            soldQuantity: soldQuantity
          };
        })
        .sort((a, b) => b.soldQuantity - a.soldQuantity)
        .slice(0, 4);

      console.log('Best Sellers:', bestSellers);

      // Lấy 5 đơn hàng gần nhất
      const recentOrders = orders
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5)
        .map(order => ({
          id: order.id,
          orderId: order.id,
          customer: order.full_name || "Khách hàng",
          email: order.email || "N/A",
          avatar: getInitials(order.full_name || "KH"),
          date: formatDate(order.created_at),
          items: order.items?.length || 0,
          status: order.status,
          total: order.total || 0
        }));

      console.log('Recent Orders (limited to 5):', recentOrders);

      const chartData = generateChartData(orders);
      console.log('Chart Data:', chartData);

      setDashboardData({
        totalRevenue,
        totalOrders,
        totalProducts: products.length,
        totalUsers: users.length,
        bestSellers,
        recentOrders,
        chartData
      });

    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError(err.message || "Không thể tải dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "KH";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
  };

  const generateChartData = (orders) => {
    const monthlyRevenue = {};
    const currentYear = new Date().getFullYear();

    for (let i = 1; i <= 12; i++) {
      monthlyRevenue[i] = 0;
    }

    orders.forEach(order => {
      if (order.status === "Đã giao" && order.created_at) {
        const orderDate = new Date(order.created_at);
        if (orderDate.getFullYear() === currentYear) {
          const month = orderDate.getMonth() + 1;

          // Tính doanh thu từ tổng giá tiền sản phẩm
          if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
              const itemTotal = (item.price || 0) * (item.quantity || 0);
              monthlyRevenue[month] += itemTotal;
            });
          }
        }
      }
    });

    return Object.keys(monthlyRevenue).map(month => ({
      name: `T${month}`,
      revenue: monthlyRevenue[month]
    }));
  };

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
      case "Đã giao":
        return (
          <span className="dashboard-page__status-pill dashboard-page__status-pill--delivered">
            Đã giao
          </span>
        );
      case "Chờ xác nhận":
        return (
          <span className="dashboard-page__status-pill dashboard-page__status-pill--pending">
            Chờ xác nhận
          </span>
        );
      case "Đang giao":
        return (
          <span className="dashboard-page__status-pill dashboard-page__status-pill--delivering">
            Đang giao
          </span>
        );
      case "Đã hủy":
        return (
          <span className="dashboard-page__status-pill dashboard-page__status-pill--cancelled">
            Đã hủy
          </span>
        );
      default:
        return (
          <span className="dashboard-page__status-pill dashboard-page__status-pill--pending">
            {status}
          </span>
        );
    }
  };

  const customLabelFormatter = (label) => {
    return `Tháng ${label.replace("T", "")}`;
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <Sidebar />
        <div className="dashboard-page__content">
          <div className="dashboard-page__loading">
            <Loader size={48} className="dashboard-page__loading-icon" />
            <p>Đang tải dữ liệu dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <Sidebar />
        <div className="dashboard-page__content">
          <div className="dashboard-page__error">
            <AlertCircle size={48} className="dashboard-page__error-icon" />
            <p>{error}</p>
            <button onClick={loadDashboardData} className="dashboard-page__retry-btn">
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statsData = [
    {
      title: "Tổng doanh thu",
      value: dashboardData.totalRevenue,
      icon: <Wallet size={24} />,
      type: "money",
    },
    {
      title: "Đơn hàng",
      value: dashboardData.totalOrders,
      icon: <ShoppingBag size={24} />,
      type: "order",
    },
    {
      title: "Sản phẩm",
      value: dashboardData.totalProducts,
      icon: <Box size={24} />,
      type: "product",
    },
    {
      title: "Tài khoản",
      value: dashboardData.totalUsers,
      icon: <Users size={24} />,
      type: "user",
    },
  ];

  return (
    <div className="dashboard-page">
      <Sidebar />

      <div className="dashboard-page__content">
        <div className="dashboard-page__stats-grid">
          {statsData.map((stat, index) => (
            <div key={index} className="dashboard-page__stat-card">
              <div className="dashboard-page__stat-header">
                <div
                  className={`dashboard-page__stat-icon dashboard-page__stat-icon--${stat.type}`}
                >
                  {stat.icon}
                </div>
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

        <div className="dashboard-page__charts-grid">
          <div className="dashboard-page__section-card">
            <div className="dashboard-page__section-header">
              <h3>Biểu đồ doanh thu</h3>
              <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                Năm {new Date().getFullYear()}
              </div>
            </div>
            <div style={{ width: "100%", height: "300px", minHeight: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dashboardData.chartData}
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

                  <Tooltip
                    labelFormatter={customLabelFormatter}
                    formatter={(value) => [formatCurrency(value), "Doanh thu"]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Doanh thu"
                    stroke="#2563eb"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="dashboard-page__section-card">
            <div className="dashboard-page__section-header">
              <h3>Sản phẩm</h3>
              <button>Tất cả</button>
            </div>
            <div className="dashboard-page__best-seller-list">
              {dashboardData.bestSellers.length > 0 ? (
                dashboardData.bestSellers.map((product) => (
                  <div key={product.id} className="dashboard-page__product-item">
                    <img
                      src={product.img}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/100";
                      }}
                    />
                    <div className="dashboard-page__product-info">
                      <h4>{product.name}</h4>
                      <span>{product.category}</span>
                    </div>
                    <span className="dashboard-page__product-price">
                      {formatCurrency(product.price)}
                    </span>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: "center", color: "#6b7280", padding: "2rem" }}>
                  Chưa có dữ liệu sản phẩm bán chạy
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="dashboard-page__section-card">
          <div className="dashboard-page__section-header">
            <h3>Đơn hàng gần đây</h3>
          </div>

          <div className="dashboard-page__table-wrapper">
            {dashboardData.recentOrders.length > 0 ? (
              <table className="dashboard-page__table">
                <thead>
                  <tr>
                    <th style={{ width: "60px", textAlign: "center" }}>STT</th>
                    <th>ID Đơn hàng</th>
                    <th>Khách hàng</th>
                    <th>Ngày đặt</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentOrders.map((order, index) => (
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
                        <span style={{ color: "#dc2626", fontWeight: 600 }}>
                          {order.orderId}
                        </span>
                      </td>
                      <td>
                        <div className="dashboard-page__customer-cell">
                          <div className="dashboard-page__avatar-circle">
                            {order.avatar}
                          </div>
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ fontWeight: 600 }}>{order.customer}</span>
                            <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                              {order.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>{order.date}</td>
                      <td>
                        <span style={{ fontWeight: 600 }}>
                          {formatCurrency(order.total)}
                        </span>
                      </td>
                      <td>{getStatusBadge(order.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ textAlign: "center", color: "#6b7280", padding: "2rem" }}>
                Chưa có đơn hàng nào
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;