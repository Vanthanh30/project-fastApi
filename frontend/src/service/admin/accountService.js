import axios from 'axios';
const API_BASE_URL = 'http://localhost:8000';
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
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
const accountService = {
    getProfile: async () => {
        try {
            const response = await axiosInstance.get('/admin/me');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Không thể tải thông tin' };
        }
    },
    updateProfile: async (profileData) => {
        try {
            const formData = new FormData();
            if (profileData.name) formData.append('name', profileData.name);
            if (profileData.phone) formData.append('phone', profileData.phone);
            if (profileData.address) formData.append('address', profileData.address);
            if (profileData.password) formData.append('password', profileData.password);
            if (profileData.avatar instanceof File) {
                formData.append('avatar', profileData.avatar);
            }

            const response = await axiosInstance.put('/admin/me', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.data.user) {
                localStorage.setItem('adminInfo', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.detail || 'Cập nhật thất bại';
            throw { message: errorMessage };
        }
    },
    getAllUsers: async () => {
        try {
            const response = await axiosInstance.get('/admin/users');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Không thể tải danh sách users' };
        }
    },
    getUserDetail: async (userId) => {
        try {
            const response = await axiosInstance.get(`/admin/users/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Không thể tải thông tin user' };
        }
    },
    deleteUser: async (userId) => {
        try {
            const response = await axiosInstance.delete(`/admin/users/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Xóa tài khoản thất bại' };
        }
    },
    getAllAdmins: async () => {
        return accountService.getAllUsers();
    },

    deleteAdmin: async (id) => {
        return accountService.deleteUser(id);
    },
};

export default accountService;