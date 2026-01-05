import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

class OrderService {
    async getAllOrders() {
        try {
            const response = await axios.get(`${API_URL}/orders/`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }
}
export default new OrderService();
