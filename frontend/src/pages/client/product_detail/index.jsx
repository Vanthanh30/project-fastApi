import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ChevronDown, ShoppingCart } from 'lucide-react';
import LayoutDefault from '../layout_default/layout_default';
import ChatboxAI from '../../../components/Chatbox/ChatboxAI';
import ProductService from '../../../service/client/productService';
import CategoryService from '../../../service/client/categoryService';
import cartService from '../../../service/client/cartService';
import './product_detail.scss';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [category, setCategory] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addingToCart, setAddingToCart] = useState(false);

    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [openAccordions, setOpenAccordions] = useState({
        description: false,
        info: false
    });

    // Gray placeholder SVG
    const grayPlaceholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect width="300" height="300" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E';

    useEffect(() => {
        fetchProductDetail();
    }, [id]);

    const fetchProductDetail = async () => {
        try {
            setLoading(true);
            setError(null);

            const productData = await ProductService.getProductById(id);
            setProduct(productData);

            if (productData.category_id) {
                try {
                    const categoryData = await CategoryService.getCategoryById(productData.category_id);
                    setCategory(categoryData);
                } catch (err) {
                    console.error('Không thể lấy thông tin danh mục:', err);
                }

                try {
                    const related = await ProductService.getProductsByCategory(productData.category_id);
                    const filtered = related.filter(p => p.id !== productData.id).slice(0, 4);
                    setRelatedProducts(filtered);
                } catch (err) {
                    console.error('Không thể lấy sản phẩm liên quan:', err);
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (type) => {
        if (type === 'increment') {
            setQuantity(prev => prev + 1);
        } else if (type === 'decrement' && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleAddToCart = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            const ok = window.confirm(
                "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng. Chuyển đến đăng nhập?"
            );
            if (ok) {
                window.location.href = `/login?redirect=/product/${id}`;
            }
            return;
        }

        try {
            setAddingToCart(true);

            const res = await cartService.addToCart(product.id, quantity);
            if (res?.success === false) {
                throw new Error(res.message || "Thêm vào giỏ thất bại");
            }

            alert("Đã thêm sản phẩm vào giỏ hàng!");
            setQuantity(1);
            window.dispatchEvent(new Event("cart_updated"));
        } catch (err) {
            console.error(err);
            alert(
                err.response?.data?.message ||
                err.message ||
                "Không thể thêm vào giỏ hàng"
            );
        } finally {
            setAddingToCart(false);
        }
    };


    const toggleAccordion = (key) => {
        setOpenAccordions(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath || imagePath === 'null' || imagePath === 'NULL') {
            return grayPlaceholder;
        }
        return ProductService.getImageUrl(imagePath);
    };

    if (loading) {
        return (
            <LayoutDefault>
                <div className="product-detail">
                    <div className="container">
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Đang tải sản phẩm...</p>
                        </div>
                    </div>
                </div>
            </LayoutDefault>
        );
    }

    if (error || !product) {
        return (
            <LayoutDefault>
                <div className="product-detail">
                    <div className="container">
                        <div className="error-state">
                            <p>{error || 'Không tìm thấy sản phẩm'}</p>
                            <Link to="/" className="back-btn">Về trang chủ</Link>
                        </div>
                    </div>
                </div>
            </LayoutDefault>
        );
    }

    return (
        <LayoutDefault>
            <div className="product-detail">
                <div className="container">
                    <div className="breadcrumb">
                        <Link to="/">Trang chủ</Link>
                        <span>/</span>
                        {category && (
                            <>
                                <Link to="/products">{category.name}</Link>
                                <span>/</span>
                            </>
                        )}
                        <span>{product.name}</span>
                    </div>

                    <div className="product-detail__main">
                        <div className="product-detail__gallery">
                            <div className="product-detail__main-image">
                                <img
                                    src={getImageUrl(product.image)}
                                    alt={product.name}
                                    onError={(e) => {
                                        e.target.src = grayPlaceholder;
                                    }}
                                />
                            </div>
                            <div className="product-detail__thumbnails">
                                <div className="product-detail__thumbnail active">
                                    <img
                                        src={getImageUrl(product.image)}
                                        alt={product.name}
                                        onError={(e) => {
                                            e.target.src = grayPlaceholder;
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="product-detail__info">
                            <h1 className="product-detail__name">{product.name}</h1>

                            <div className="product-detail__price-row">
                                <div className="product-detail__price">
                                    {ProductService.formatPrice(product.price)}₫
                                </div>
                            </div>

                            <p className="product-detail__description">
                                {product.description || 'Sản phẩm chất lượng cao, được nhập khẩu chính hãng.'}
                            </p>

                            <div className="product-detail__quantity-section">
                                <div className="product-detail__quantity">
                                    <button
                                        className="product-detail__quantity-btn"
                                        onClick={() => handleQuantityChange('decrement')}
                                    >
                                        −
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="product-detail__quantity-input"
                                    />
                                    <button
                                        className="product-detail__quantity-btn"
                                        onClick={() => handleQuantityChange('increment')}
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    className="product-detail__buy-btn"
                                    onClick={handleAddToCart}
                                    disabled={addingToCart}
                                >
                                    {addingToCart ? 'ĐANG THÊM...' : `THÊM VÀO GIỎ - ${ProductService.formatPrice(product.price * quantity)}₫`}
                                </button>
                                <button
                                    className="product-detail__cart-btn"
                                    onClick={handleAddToCart}
                                    disabled={addingToCart}
                                    title="Thêm vào giỏ hàng"
                                >
                                    <ShoppingCart size={20} />
                                </button>
                            </div>

                            <div className="product-detail__accordion">
                                <div className="product-detail__accordion-item">
                                    <button
                                        className="product-detail__accordion-header"
                                        onClick={() => toggleAccordion('description')}
                                    >
                                        <span>MÔ TẢ</span>
                                        {openAccordions.description ?
                                            <ChevronDown size={20} /> :
                                            <ChevronRight size={20} />
                                        }
                                    </button>
                                    <div className={`product-detail__accordion-content ${openAccordions.description ? 'open' : ''}`}>
                                        <p>{product.description || 'Không có mô tả chi tiết'}</p>
                                        <ul className="product-detail__features-list">
                                            <li>Chất lượng cao cấp</li>
                                            <li>Nhập khẩu chính hãng</li>
                                            <li>Bảo hành đổi trả trong 7 ngày</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="product-detail__accordion-item">
                                    <button
                                        className="product-detail__accordion-header"
                                        onClick={() => toggleAccordion('info')}
                                    >
                                        <span>THÔNG TIN SẢN PHẨM</span>
                                        {openAccordions.info ?
                                            <ChevronDown size={20} /> :
                                            <ChevronRight size={20} />
                                        }
                                    </button>
                                    <div className={`product-detail__accordion-content ${openAccordions.info ? 'open' : ''}`}>
                                        <p><strong>Thương hiệu:</strong> {product.brand || 'N/A'}</p>
                                        <p><strong>Danh mục:</strong> {category?.name || product.category_name || 'N/A'}</p>
                                        <p><strong>Tình trạng:</strong> {product.status === 'active' ? 'Còn hàng' : 'Hết hàng'}</p>
                                        <p><strong>Số lượng còn:</strong> {product.quantity || 0}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {relatedProducts.length > 0 && (
                        <section className="product-detail__related">
                            <div className="product-detail__related-header">
                                <div>
                                    <h2>SẢN PHẨM LIÊN QUAN</h2>
                                    <p>Các sản phẩm tương tự bạn có thể quan tâm.</p>
                                </div>
                            </div>
                            <div className="product-detail__related-grid">
                                {relatedProducts.map((item) => (
                                    <Link
                                        to={`/product/${item.id}`}
                                        key={item.id}
                                        className="product-detail__related-item"
                                    >
                                        <div className="product-detail__related-image">
                                            <img
                                                src={getImageUrl(item.image)}
                                                alt={item.name}
                                                onError={(e) => {
                                                    e.target.src = grayPlaceholder;
                                                }}
                                            />
                                        </div>
                                        <h3 className="product-detail__related-name">{item.name}</h3>
                                        <p className="product-detail__related-category">
                                            {item.category_name || item.brand}
                                        </p>
                                        <p className="product-detail__related-price">
                                            {ProductService.formatPrice(item.price)}₫
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
            <ChatboxAI />
        </LayoutDefault>
    );
};

export default ProductDetail;