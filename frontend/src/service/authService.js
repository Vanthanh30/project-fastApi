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

            const token = response.data.access_token;

            if (!token) {
                throw new Error('Server did not return access token');
            }

            localStorage.setItem('adminToken', token);

            try {
                const profileResponse = await axios.get(`${API_BASE_URL}/admin/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                localStorage.setItem('adminInfo', JSON.stringify(profileResponse.data));
            } catch (profileError) {
                console.warn('Could not fetch admin profile:', profileError);
            }

            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.detail || 'Đăng nhập thất bại';
            throw { message: errorMessage };
        }
    },

    logout: async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (token) {
                await authAxios.post('/auth/admin/logout', null, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
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

    getProfile: async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await axios.get(`${API_BASE_URL}/admin/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            localStorage.setItem('adminInfo', JSON.stringify(response.data));

            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch profile' };
        }
    }
};

export default authService;