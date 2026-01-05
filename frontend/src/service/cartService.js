import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const cartService = {
    getCart: () => api.get("/cart").then(res => res.data),
    updateCartItem: (id, quantity) =>
        api.put(`/cart/item/${id}`, { quantity }).then(res => res.data),
    deleteCartItem: (id) =>
        api.delete(`/cart/item/${id}`).then(res => res.data),
};

export default cartService;
