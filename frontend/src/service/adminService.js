// src/services/adminService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Tạo axios instance với config mặc định
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Để gửi cookies
});

// Interceptor để tự động thêm token vào header
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

// Interceptor để xử lý response và error
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token hết hạn hoặc không hợp lệ
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminInfo');
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);

const adminService = {
    // Đăng nhập admin
    login: async (credentials) => {
        try {
            const response = await axiosInstance.post('/auth/admin/login', {
                email: credentials.email || credentials.username,
                password: credentials.password,
            });

            if (response.data.token) {
                localStorage.setItem('adminToken', response.data.token);
                localStorage.setItem('adminInfo', JSON.stringify(response.data.admin));
            }

            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Đăng nhập thất bại' };
        }
    },

    // Đăng xuất admin
    logout: async () => {
        try {
            await axiosInstance.post('/auth/admin/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminInfo');
        }
    },

    // Lấy thông tin admin
    getProfile: async () => {
        try {
            const response = await axiosInstance.get('/admin/me');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Không thể tải thông tin' };
        }
    },

    // Cập nhật thông tin admin
    updateProfile: async (profileData) => {
        try {
            const formData = new FormData();

            // Thêm các field text
            if (profileData.name) formData.append('name', profileData.name);
            if (profileData.email) formData.append('email', profileData.email);
            if (profileData.password) formData.append('password', profileData.password);

            // Thêm file avatar nếu có
            if (profileData.avatar instanceof File) {
                formData.append('avatar', profileData.avatar);
            }

            const response = await axiosInstance.put('/admin/me', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Cập nhật localStorage
            if (response.data.admin) {
                localStorage.setItem('adminInfo', JSON.stringify(response.data.admin));
            }

            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Cập nhật thất bại' };
        }
    },

    // Kiểm tra xem admin đã đăng nhập chưa
    isAuthenticated: () => {
        return !!localStorage.getItem('adminToken');
    },

    // Lấy thông tin admin từ localStorage
    getStoredAdminInfo: () => {
        const adminInfo = localStorage.getItem('adminInfo');
        return adminInfo ? JSON.parse(adminInfo) : null;
    },
};

export default adminService;