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

    // Lấy sản phẩm theo danh mục
    async getProductsByCategory(categoryId) {
        try {
            // Lấy tất cả sản phẩm rồi filter theo category
            const response = await axios.get(`${API_URL}/products/`);
            const allProducts = response.data;

            // Filter sản phẩm theo category_id
            const filtered = allProducts.filter(
                product => product.category_id === categoryId
            );

            return filtered;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Tìm kiếm sản phẩm
    async searchProducts(keyword) {
        try {
            const response = await axios.get(`${API_URL}/products/search`, {
                params: { keyword }
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Lấy sản phẩm nổi bật (featured)
    async getFeaturedProducts(limit = 4) {
        try {
            const response = await axios.get(`${API_URL}/products/`);

            let products = response.data;

            // Kiểm tra nếu data nằm trong property khác
            if (response.data.products) {
                products = response.data.products;
            } else if (response.data.data) {
                products = response.data.data;
            } else if (response.data.items) {
                products = response.data.items;
            }

            // Đảm bảo products là array
            if (!Array.isArray(products)) {
                return [];
            }

            return products.slice(0, limit);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Lấy sản phẩm mới nhất
    async getLatestProducts(limit = 8) {
        try {
            const response = await axios.get(`${API_URL}/products/`);
            const sortedProducts = response.data.sort((a, b) => b.id - a.id);
            return sortedProducts.slice(0, limit);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Lấy URL hình ảnh
    getImageUrl(imagePath) {
        if (!imagePath) {
            return "https://via.placeholder.com/300x300?text=No+Image";
        }
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }
        return `${API_URL}/static/images/${imagePath}`;
    }

    // Format giá VNĐ
    formatPrice(price) {
        return new Intl.NumberFormat('vi-VN').format(price);
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

export default new ProductService();