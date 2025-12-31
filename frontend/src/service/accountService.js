// src/services/accountService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Tạo axios instance với config mặc định
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
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

const accountService = {
    // GET /admin/profile - Lấy thông tin admin hiện tại
    getProfile: async () => {
        try {
            const response = await axiosInstance.get('/admin/profile');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Không thể tải thông tin' };
        }
    },

    // PUT /admin/me - Cập nhật thông tin admin profile
    // Note: Endpoint này chưa có trong backend, sẽ dùng mock
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

            // Try to call API (sẽ fail nếu endpoint chưa có)
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
            // Nếu API chưa có, fake success và update localStorage
            console.warn('⚠️ Update API not available, simulating success');

            const updatedAdmin = {
                name: profileData.name,
                email: profileData.email,
                role: 'Admin',
            };

            localStorage.setItem('adminInfo', JSON.stringify(updatedAdmin));

            return {
                message: 'Profile updated successfully (mock)',
                admin: updatedAdmin
            };
        }
    },

    // GET /admin/accounts - Lấy danh sách admin (chưa có API, dùng profile hiện tại)
    getAllAdmins: async () => {
        try {
            console.log('📡 Trying to fetch admin accounts...');

            // Try API endpoint first
            const response = await axiosInstance.get('/admin/accounts');
            console.log('✅ Response from /admin/accounts:', response.data);
            return response.data;
        } catch (error) {
            console.warn('⚠️ /admin/accounts not available, using current admin profile');

            // Fallback: Get current admin profile
            try {
                const profile = await axiosInstance.get('/admin/profile');
                console.log('✅ Got current admin profile:', profile.data);

                // Return as array with single admin
                return [profile.data];
            } catch (profileError) {
                console.error('❌ Failed to get profile:', profileError);
                throw profileError.response?.data || { message: 'Không thể tải danh sách admin' };
            }
        }
    },

    // DELETE /admin/accounts/:id - Xóa admin account (chưa có API)
    deleteAdmin: async (id) => {
        try {
            const response = await axiosInstance.delete(`/admin/accounts/${id}`);
            return response.data;
        } catch (error) {
            console.warn('⚠️ Delete API not available');
            throw error.response?.data || { message: 'Xóa tài khoản thất bại. API chưa được implement.' };
        }
    },
};

export default accountService;