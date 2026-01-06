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
            const message = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
            window.location.href = "/login?redirect=" + encodeURIComponent(window.location.pathname);

            return Promise.reject(new Error(message));
        }
        return Promise.reject(error);
    }
);

const cartService = {
    addToCart: (productId, quantity) =>
        api.post("/cart/add", { product_id: productId, quantity }).then(res => res.data),
    getCart: () => api.get("/cart").then(res => res.data),
    updateCartItem: (id, quantity) =>
        api.put(`/cart/item/${id}`, { quantity }).then(res => res.data),
    deleteCartItem: (id) =>
        api.delete(`/cart/item/${id}`).then(res => res.data),
};

export default cartService;