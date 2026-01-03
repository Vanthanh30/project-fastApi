import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

class ProductService {
    async getAllProducts() {
        try {
            const response = await axios.get(`${API_URL}/products/`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }
    async getProductById(id) {
        try {
            const response = await axios.get(`${API_URL}/products/${id}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }
    async createProduct(productData, imageFile = null) {
        try {
            const formData = new FormData();
            formData.append('name', productData.name);
            formData.append('category_id', productData.category_id);
            formData.append('price', productData.price);
            formData.append('description', productData.description || '');
            formData.append('brand', productData.brand);
            formData.append('quantity', productData.quantity);
            formData.append('status', productData.status);
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const response = await axios.post(`${API_URL}/products/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }
    async updateProduct(id, productData, imageFile = null) {
        try {
            const formData = new FormData();
            if (productData.name) formData.append('name', productData.name);
            if (productData.category_id) formData.append('category_id', productData.category_id);
            if (productData.price) formData.append('price', productData.price);
            if (productData.description) formData.append('description', productData.description);
            if (productData.brand) formData.append('brand', productData.brand);
            if (productData.quantity !== undefined) formData.append('quantity', productData.quantity);
            if (productData.status) formData.append('status', productData.status);
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const response = await axios.put(
                `${API_URL}/products/${id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }
    async deleteProduct(id) {
        try {
            const response = await axios.delete(`${API_URL}/products/${id}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }
    getImageUrl(imagePath) {
        if (!imagePath) {
            return "https://via.placeholder.com/100";
        }
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }
        return `${API_URL}/static/images/${imagePath}`;
    }
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