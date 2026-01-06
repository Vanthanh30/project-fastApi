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

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
            window.location.href =
                "/login?redirect=" +
                encodeURIComponent(window.location.pathname);
        }
        return Promise.reject(error);
    }
);

const cartService = {
    addToCart: async (productId, quantity) => {
        const res = await api.post("/cart/add", {
            product_id: productId,
            quantity,
        });
        return res.data;
    },

    getCart: async () => {
        const res = await api.get("/cart");
        return res.data;
    },

    updateCartItem: async (id, quantity) => {
        const res = await api.put(`/cart/item/${id}`, { quantity });
        return res.data;
    },

    deleteCartItem: async (id) => {
        const res = await api.delete(`/cart/item/${id}`);
        return res.data;
    },
};

export default cartService;
