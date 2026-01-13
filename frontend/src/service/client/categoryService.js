import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

class CategoryService {
    // Lấy tất cả danh mục
    async getAllCategories() {
        try {
            const response = await axios.get(`${API_URL}/categories/`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Lấy danh mục theo ID
    async getCategoryById(id) {
        try {
            const response = await axios.get(`${API_URL}/categories/${id}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Lấy danh mục với số lượng sản phẩm
    async getCategoriesWithCount() {
        try {
            const response = await axios.get(`${API_URL}/categories/`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Xử lý lỗi
    handleError(error) {
        if (error.response) {
            const message = error.response.data.detail || "Đã có lỗi xảy ra";
            return new Error(message);
        } else if (error.request) {
            return new Error("Không thể kết nối đến server");
        } else {
            return new Error(error.message);
        }
    }
}

export default new CategoryService();