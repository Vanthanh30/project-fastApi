
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const authAxios = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

const authService = {

    login: async (credentials) => {
        try {
            const response = await authAxios.post('/auth/admin/login', {
                email: credentials.email || credentials.username,
                password: credentials.password,
            });

            const token = response.data.token || response.data.access_token;

            if (token) {
                localStorage.setItem('adminToken', token);

                if (response.data.admin) {
                    localStorage.setItem('adminInfo', JSON.stringify(response.data.admin));
                }
            }

            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Đăng nhập thất bại' };
        }
    },


    logout: async () => {
        try {
            await authAxios.post('/auth/admin/logout', null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
                },
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminInfo');
        }
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('adminToken');
    },


    getStoredAdminInfo: () => {
        const adminInfo = localStorage.getItem('adminInfo');
        return adminInfo ? JSON.parse(adminInfo) : null;
    },
};

export default authService;