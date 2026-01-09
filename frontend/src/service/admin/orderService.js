import axios from "axios";

const API_URL = 'http://localhost:8000';
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminInfo');
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);
class OrderService {
    async getAllOrders() {
        try {
            const response = await axiosInstance.get(`${API_URL}/orders/`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async approveOrder(orderId) {
        try {
            const response = await axiosInstance.put(`${API_URL}/orders/${orderId}/approve_order/`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }
    async cancelOrder(orderId) {
        try {
            const response = await axiosInstance.put(`${API_URL}/orders/${orderId}/cancel_order/`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }
}
export default new OrderService();
