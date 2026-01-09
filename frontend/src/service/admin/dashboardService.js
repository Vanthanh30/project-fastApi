import axios from "axios";

const API_URL = "http://localhost:8000";

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// ===== Interceptor Request =====
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("adminToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ===== Interceptor Response =====
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminInfo");
            window.location.href = "/admin/login";
        }
        return Promise.reject(error);
    }
);

class DashboardService {
    async getStats() {
        try {
            const res = await axiosInstance.get("/dashboard/stats");
            return res.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getRevenueByMonth(year) {
        try {
            const res = await axiosInstance.get(
                `/dashboard/revenue-by-month?year=${year}`
            );
            return res.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getBestSellers() {
        try {
            const res = await axiosInstance.get("/dashboard/best-sellers");
            return res.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getRecentOrders() {
        try {
            const res = await axiosInstance.get("/dashboard/recent-orders");
            return res.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    handleError(error) {
        if (error.response) {
            return new Error(error.response.data.detail || "Đã có lỗi xảy ra");
        } else if (error.request) {
            return new Error("Không thể kết nối đến server");
        } else {
            return new Error(error.message);
        }
    }
}

export default new DashboardService();
