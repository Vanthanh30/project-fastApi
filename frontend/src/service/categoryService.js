import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const CATEGORY_ENDPOINT = `${API_URL}/categories`;
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

const categoryService = {
    getAll: async (params = {}) => {
        try {
            const { skip = 0, limit = 100 } = params;
            const response = await api.get(`${CATEGORY_ENDPOINT}`, {
                params: { skip, limit }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getById: async (id) => {
        try {
            const response = await api.get(`${CATEGORY_ENDPOINT}/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    create: async (data) => {
        try {
            const response = await api.post(`${CATEGORY_ENDPOINT}`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    update: async (id, data) => {
        try {
            const response = await api.put(`${CATEGORY_ENDPOINT}/${id}`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    delete: async (id) => {
        try {
            const response = await api.delete(`${CATEGORY_ENDPOINT}/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    search: async (searchTerm) => {
        try {
            const response = await api.get(`${CATEGORY_ENDPOINT}`);
            const allCategories = response.data;

            if (!searchTerm) return allCategories;

            return allCategories.filter(category =>
                category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                category.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default categoryService;