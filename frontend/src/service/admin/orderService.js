import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

class OrderService {
    async getAllOrders() {
        try {
            const response = await axios.get(`${API_URL}/orders/`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async approveOrder(orderId) {
        try {
            const response = await axios.put(`${API_URL}/orders/${orderId}/approve_order/`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }
    async cancelOrder(orderId) {
        try {
            const response = await axios.put(`${API_URL}/orders/${orderId}/cancel_order/`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }
}
export default new OrderService();
