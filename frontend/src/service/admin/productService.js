import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

class ProductService {
    // Lấy tất cả sản phẩm
    async getAllProducts() {
        try {
            const response = await axios.get(`${API_URL}/products/`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Lấy sản phẩm theo ID
    async getProductById(id) {
        try {
            const response = await axios.get(`${API_URL}/products/${id}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Tạo sản phẩm mới
    async createProduct(productData) {
        try {
            const response = await axios.post(`${API_URL}/products/`, productData);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Cập nhật sản phẩm
    async updateProduct(id, productData) {
        try {
            const response = await axios.put(
                `${API_URL}/products/${id}`,
                productData
            );
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Xóa sản phẩm (soft delete)
    async deleteProduct(id) {
        try {
            const response = await axios.delete(`${API_URL}/products/${id}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Upload ảnh lên server
    async uploadImage(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post(`${API_URL}/upload/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data.filename || response.data.url;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Lấy URL đầy đủ của ảnh
    getImageUrl(imagePath) {
        if (!imagePath) {
            return "https://via.placeholder.com/100";
        }

        // Nếu đã là URL đầy đủ
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }

        // Nếu là đường dẫn tương đối, thêm API_URL
        return `${API_URL}/static/images/${imagePath}`;
    }

    // Xử lý lỗi
    handleError(error) {
        if (error.response) {
            // Server trả về response với status code lỗi
            const message = error.response.data.detail || "Đã có lỗi xảy ra";
            return new Error(message);
        } else if (error.request) {
            // Request được gửi nhưng không nhận được response
            return new Error("Không thể kết nối đến server");
        } else {
            // Lỗi khác
            return new Error(error.message);
        }
    }
}

export default new ProductService();