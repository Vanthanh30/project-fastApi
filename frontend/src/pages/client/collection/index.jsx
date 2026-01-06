import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LayoutDefault from '../layout_default/layout_default';
import ChatboxAI from '../../../components/Chatbox/ChatboxAI';
import CategoryFilter from '../../../components/Filter/CategoryFilter';
import PriceFilter from '../../../components/Filter/PriceFilter';
import ProductTypeFilter from '../../../components/Filter/ProductTypeFilter';
import ProductService from '../../../service/client/productService';
import CategoryService from '../../../service/client/categoryService';
import './collection.scss';

const Collection = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [priceRange, setPriceRange] = useState([0, 5000000]);
    const [selectedProductTypes, setSelectedProductTypes] = useState([]);
    const [sortBy, setSortBy] = useState('featured');
    const [expandedSections, setExpandedSections] = useState({
        category: true,
        price: true,
        productType: true
    });

    const productTypes = [
        {
            id: 'face',
            name: 'Mặt',
            keywords: [
                'kem nền', 'cushion', 'phấn phủ', 'phấn nền', 'primer',
                'bb cream', 'cc cream', 'foundation', 'base', 'powder',
                'che khuyết điểm', 'concealer', 'phấn tươi', 'phấn nước'
            ]
        },
        {
            id: 'eyes',
            name: 'Mắt',
            keywords: [
                'mascara', 'eyeliner', 'eyeshadow', 'phấn mắt', 'kẻ mắt',
                'chì kẻ mắt', 'bút kẻ mắt', 'eye shadow', 'eye liner',
                'lông mi', 'mi giả', 'keo dán mi'
            ]
        },
        {
            id: 'lips',
            name: 'Môi',
            keywords: [
                'son môi', 'son kem', 'son lì', 'son bóng', 'son thỏi',
                'lip tint', 'lipstick', 'lip gloss', 'lip balm', 'son dưỡng',
                'rouge', 'tint', 'velvet lip'
            ]
        },
        {
            id: 'cheeks',
            name: 'Má',
            keywords: [
                'phấn má', 'blush', 'má hồng', 'highlight', 'highlighter',
                'bronzer', 'contour', 'phấn tạo khối'
            ]
        },
        {
            id: 'brushes',
            name: 'Cọ',
            keywords: [
                'cọ trang điểm', 'cọ makeup', 'brush set', 'bàn chải trang điểm',
                'cọ phấn', 'cọ nền', 'cọ má'
            ]
        },
        {
            id: 'skincare',
            name: 'Chăm sóc da',
            keywords: [
                'sữa rửa mặt', 'nước tẩy trang', 'micellar', 'cleanser',
                'serum', 'kem dưỡng', 'kem chống nắng', 'sunscreen',
                'toner', 'nước hoa hồng', 'mặt nạ', 'mask',
                'tẩy tế bào chết', 'essence', 'ampoule', 'moisturizer',
                'sữa dưỡng', 'gel dưỡng', 'niacinamide', 'vitamin c'
            ]
        },
        {
            id: 'accessories',
            name: 'Phụ kiện',
            keywords: [
                'bông tẩy trang', 'bông phấn', 'gương trang điểm', 'túi đựng',
                'hộp đựng', 'giấy thấm dầu', 'kẹp mi', 'dụng cụ',
                'phụ kiện trang điểm', 'que lăn', 'bọt biển'
            ]
        }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [products, selectedCategory, priceRange, selectedProductTypes, sortBy]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [productsData, categoriesData] = await Promise.all([
                ProductService.getAllProducts(),
                CategoryService.getAllCategories()
            ]);

            setProducts(productsData);
            const formattedCategories = [
                { id: 'all', name: 'Tất cả', count: productsData.length },
                ...categoriesData.map(cat => ({
                    id: cat.id,
                    name: cat.name,
                    count: productsData.filter(p => p.category_id === cat.id).length
                }))
            ];
            setCategories(formattedCategories);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    const matchesProductType = (product, typeId) => {
        const productType = productTypes.find(type => type.id === typeId);
        if (!productType) return false;
        const description = (product.description || '').toLowerCase();
        const name = (product.name || '').toLowerCase();
        const matchInDescription = productType.keywords.some(keyword =>
            description.includes(keyword.toLowerCase())
        );
        if (matchInDescription) return true;

        return productType.keywords.some(keyword =>
            name.includes(keyword.toLowerCase())
        );
    };

    const applyFilters = () => {
        let filtered = [...products];
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(p => p.category_id === parseInt(selectedCategory));
        }
        filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
        if (selectedProductTypes.length > 0) {
            filtered = filtered.filter(product =>
                selectedProductTypes.some(typeId =>
                    matchesProductType(product, typeId)
                )
            );
        }
        switch (sortBy) {
            case 'price-asc':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                filtered.sort((a, b) => b.id - a.id);
                break;
            default:
                break;
        }

        setFilteredProducts(filtered);
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const toggleProductType = (typeId) => {
        setSelectedProductTypes(prev =>
            prev.includes(typeId)
                ? prev.filter(t => t !== typeId)
                : [...prev, typeId]
        );
    };

    const clearFilters = () => {
        setSelectedCategory('all');
        setPriceRange([0, 5000000]);
        setSelectedProductTypes([]);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

    if (loading) {
        return (
            <LayoutDefault>
                <div className="collection">
                    <div className="collection__container">
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Đang tải sản phẩm...</p>
                        </div>
                    </div>
                </div>
            </LayoutDefault>
        );
    }

    if (error) {
        return (
            <LayoutDefault>
                <div className="collection">
                    <div className="collection__container">
                        <div className="error-state">
                            <p>{error}</p>
                            <button onClick={fetchData} className="retry-button">
                                Thử lại
                            </button>
                        </div>
                    </div>
                </div>
            </LayoutDefault>
        );
    }

    return (
        <LayoutDefault>
            <div className="collection">
                <div className="collection__hero">
                    <div className="collection__hero-content">
                        <h1>BỘ SƯU TẬP</h1>
                        <p>
                            Khám phá bộ sưu tập trang điểm cao cấp với công thức độc quyền,
                            mang đến vẻ đẹp hoàn hảo cho làn da của bạn
                        </p>
                    </div>
                </div>

                <div className="collection__container">
                    <aside className="collection__sidebar">
                        <div className="collection__filter-header">
                            <h3>Bộ lọc</h3>
                            <button onClick={clearFilters} className="collection__clear-btn">
                                Xóa tất cả
                            </button>
                        </div>
                        <CategoryFilter
                            categories={categories}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            isExpanded={expandedSections.category}
                            toggleExpanded={() => toggleSection('category')}
                        />
                        <PriceFilter
                            priceRange={priceRange}
                            setPriceRange={setPriceRange}
                            isExpanded={expandedSections.price}
                            toggleExpanded={() => toggleSection('price')}
                        />
                        <ProductTypeFilter
                            productTypes={productTypes}
                            selectedProductTypes={selectedProductTypes}
                            toggleProductType={toggleProductType}
                            isExpanded={expandedSections.productType}
                            toggleExpanded={() => toggleSection('productType')}
                        />
                    </aside>
                    <main className="collection__main">
                        <div className="collection__toolbar">
                            <p className="collection__results">
                                Hiển thị {filteredProducts.length} sản phẩm
                            </p>
                            <div className="collection__sort">
                                <label htmlFor="sort">Sắp xếp:</label>
                                <select
                                    id="sort"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="featured">Nổi bật</option>
                                    <option value="price-asc">Giá: Thấp đến cao</option>
                                    <option value="price-desc">Giá: Cao đến thấp</option>
                                    <option value="newest">Mới nhất</option>
                                </select>
                            </div>
                        </div>
                        {filteredProducts.length === 0 ? (
                            <div className="collection__empty">
                                <p>Không tìm thấy sản phẩm nào phù hợp với bộ lọc</p>
                            </div>
                        ) : (
                            <div className="collection__grid">
                                {filteredProducts.map(product => (
                                    <Link
                                        to={`/product/${product.id}`}
                                        key={product.id}
                                        className="collection__product-card"
                                    >
                                        {product.status === 'active' && (
                                            <span className="collection__badge collection__badge--new">
                                                Mới
                                            </span>
                                        )}

                                        <div className="collection__product-image">
                                            <img
                                                src={ProductService.getImageUrl(product.image)}
                                                alt={product.name}
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
                                                }}
                                            />
                                        </div>

                                        <div className="collection__product-info">
                                            <p className="collection__product-brand">
                                                {product.brand || 'LUMIÈRE'}
                                            </p>
                                            <h3 className="collection__product-name">{product.name}</h3>

                                            <div className="collection__product-price">
                                                <span className="collection__price-current">
                                                    {formatPrice(product.price)}₫
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
            <ChatboxAI />
        </LayoutDefault>
    );
};

export default Collection;