import React, { useState } from 'react';
import LayoutDefault from '../layout_default/layout_default';
import './order.scss';

const Order = () => {
    const [activeTab, setActiveTab] = useState('TẤT CẢ');

    const tabs = ['TẤT CẢ', 'CHỜ XÁC NHẬN', 'ĐANG GIAO', 'ĐÃ GIAO', 'ĐÃ HỦY'];

    const orders = [
        { id: '#ORD-8921', date: '24/10/2025', time: '10:36 AM', total: '5.800.000đ', status: 'ĐANG GIAO' },
        { id: '#ORD-8876', date: '23/10/2025', time: '14:22 PM', total: '3.200.000đ', status: 'CHỜ XÁC NHẬN' },
        { id: '#ORD-8754', date: '20/10/2025', time: '09:15 AM', total: '7.500.000đ', status: 'ĐÃ GIAO' },
        { id: '#ORD-8632', date: '18/10/2025', time: '16:45 PM', total: '2.100.000đ', status: 'ĐÃ HỦY' },
        { id: '#ORD-8519', date: '15/10/2025', time: '11:20 AM', total: '4.900.000đ', status: 'ĐANG GIAO' },
    ];

    const getStatusBadge = (status) => {
        const statusMap = {
            'ĐANG GIAO': { color: 'delivering', text: 'Đang giao hàng' },
            'CHỜ XÁC NHẬN': { color: 'pending', text: 'Chờ xác nhận' },
            'ĐÃ GIAO': { color: 'delivered', text: 'Đã giao hàng' },
            'ĐÃ HỦY': { color: 'canceled', text: 'Đã hủy' },
        };
        return statusMap[status] || { color: 'default', text: status };
    };

    const filteredOrders = orders.filter(order =>
        activeTab === 'TẤT CẢ' || order.status === activeTab
    );

    return (
        <LayoutDefault>
            <div className="my-orders-page">
                <div className="container">

                    {/* Header */}
                    <div className="my-orders-page__header">
                        <h1 className="my-orders-page__title">Đơn hàng của tôi</h1>
                        <p className="my-orders-page__subtitle">
                            Theo dõi hành trình làm đẹp của bạn với LUMIÈRE.
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="my-orders-page__tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                className={`my-orders-page__tab ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Danh sách đơn hàng với stagger animation */}
                    <div className="my-orders-page__list">
                        {filteredOrders.length === 0 ? (
                            <div className="my-orders-page__empty">
                                <p>Không có đơn hàng nào ở trạng thái này.</p>
                                <p>Hãy khám phá thêm sản phẩm để tiếp tục hành trình làm đẹp nhé!</p>
                            </div>
                        ) : (
                            filteredOrders.map((order, index) => {
                                const statusInfo = getStatusBadge(order.status);
                                return (
                                    <div
                                        key={order.id}
                                        className="my-orders-page__order-card"
                                        style={{ animationDelay: `${index * 0.15}s` }} // Stagger effect
                                    >
                                        <div className="order-card__header">
                                            <div className="order-card__id">Mã đơn: <strong>{order.id}</strong></div>
                                            <span className={`order-card__status order-card__status--${statusInfo.color}`}>
                                                {statusInfo.text}
                                            </span>
                                        </div>

                                        <div className="order-card__body">
                                            <p className="order-card__date">Ngày đặt hàng: {order.date} lúc {order.time}</p>
                                            <p className="order-card__total">Tổng tiền: <strong>{order.total}</strong></p>
                                        </div>

                                        <div className="order-card__footer">
                                            <button className="order-card__btn order-card__btn--primary">
                                                Xem chi tiết đơn hàng
                                            </button>
                                            {order.status === 'ĐANG GIAO' && (
                                                <button className="order-card__btn order-card__btn--secondary">
                                                    Theo dõi vận chuyển
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Pagination */}
                    {filteredOrders.length > 0 && (
                        <div className="my-orders-page__pagination">
                            <button className="pagination-btn">« Trước</button>
                            <button className="pagination-btn active">1</button>
                            <button className="pagination-btn">2</button>
                            <button className="pagination-btn">3</button>
                            <button className="pagination-btn">Tiếp »</button>
                        </div>
                    )}
                </div>
            </div>
        </LayoutDefault>
    );
};

export default Order;