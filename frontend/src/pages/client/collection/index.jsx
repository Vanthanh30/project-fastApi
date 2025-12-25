import React, { useState } from 'react';
import { ChevronDown, ChevronRight, X } from 'lucide-react';
import LayoutDefault from '../layout_default/layout_default';
import './collection.scss';

const Collection = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [priceRange, setPriceRange] = useState([0, 5000000]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [sortBy, setSortBy] = useState('featured');
    const [expandedSections, setExpandedSections] = useState({
        category: true,
        price: true,
        color: true,
        brand: true
    });

    const categories = [
        { id: 'all', name: 'Tất cả', count: 48 },
        { id: 'makeup', name: 'Trang điểm', count: 24 },
        { id: 'skincare', name: 'Chăm sóc da', count: 16 },
        { id: 'lipstick', name: 'Son môi', count: 8 }
    ];

    const colors = [
        { id: 'red', name: 'Đỏ', hex: '#DC2626' },
        { id: 'pink', name: 'Hồng', hex: '#EC4899' },
        { id: 'nude', name: 'Nude', hex: '#D4A373' },
        { id: 'brown', name: 'Nâu', hex: '#92400E' },
        { id: 'orange', name: 'Cam', hex: '#EA580C' },
        { id: 'coral', name: 'Coral', hex: '#FB923C' }
    ];

    const brands = [
        { id: 'chanel', name: 'Chanel' },
        { id: 'dior', name: 'Dior' },
        { id: 'lancome', name: 'Lancôme' },
        { id: 'mac', name: 'MAC' },
        { id: 'nars', name: 'NARS' }
    ];

    const products = [
        {
            id: 1,
            name: 'Radiant Soft Cover',
            brand: 'Chanel',
            price: 1850000,
            originalPrice: null,
            image: '/product1.jpg',
            badge: 'Best Seller',
            colors: ['nude', 'brown'],
            rating: 4.5
        },
        {
            id: 2,
            name: 'Airspun Longwear Blush',
            brand: 'Dior',
            price: 950000,
            originalPrice: 1200000,
            image: '/product2.jpg',
            badge: null,
            colors: ['pink', 'coral'],
            rating: 4.8
        },
        {
            id: 3,
            name: 'Velvet Spanishblack',
            brand: 'MAC',
            price: 450000,
            originalPrice: null,
            image: '/product3.jpg',
            badge: null,
            colors: ['red', 'brown'],
            rating: 4.3
        },
        {
            id: 4,
            name: 'Volcanic Bronzing',
            brand: 'NARS',
            price: 680000,
            originalPrice: 850000,
            image: '/product4.jpg',
            badge: 'Sale',
            colors: ['brown', 'nude'],
            rating: 4.6
        },
        {
            id: 5,
            name: 'Carbon Water Lash',
            brand: 'Lancôme',
            price: 1250000,
            originalPrice: null,
            image: '/product5.jpg',
            badge: null,
            colors: ['brown'],
            rating: 4.7
        },
        {
            id: 6,
            name: 'Velvet Matte Lipstick',
            brand: 'Dior',
            price: 890000,
            originalPrice: 1100000,
            image: '/product6.jpg',
            badge: 'New',
            colors: ['red', 'pink', 'nude'],
            rating: 4.9
        }
    ];

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const toggleColor = (colorId) => {
        setSelectedColors(prev =>
            prev.includes(colorId)
                ? prev.filter(c => c !== colorId)
                : [...prev, colorId]
        );
    };

    const toggleBrand = (brandId) => {
        setSelectedBrands(prev =>
            prev.includes(brandId)
                ? prev.filter(b => b !== brandId)
                : [...prev, brandId]
        );
    };

    const clearFilters = () => {
        setSelectedCategory('all');
        setPriceRange([0, 5000000]);
        setSelectedColors([]);
        setSelectedBrands([]);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <LayoutDefault>
            <div className="collection">
                {/* Hero Section */}
                <div className="collection__hero">
                    <div className="collection__hero-content">
                        <h1>LỚP NỀN HOÀN HẢO</h1>
                        <p>
                            Khám phá bộ sưu tập trang điểm cao cấp với công thức độc quyền,
                            mang đến vẻ đẹp hoàn hảo cho làn da của bạn
                        </p>
                    </div>
                </div>

                <div className="collection__container">
                    {/* Sidebar Filter */}
                    <aside className="collection__sidebar">
                        <div className="collection__filter-header">
                            <h3>Bộ lọc</h3>
                            <button onClick={clearFilters} className="collection__clear-btn">
                                Xóa tất cả
                            </button>
                        </div>

                        {/* Category Filter */}
                        <div className="collection__filter-group">
                            <button
                                className="collection__filter-title"
                                onClick={() => toggleSection('category')}
                            >
                                <span>Danh mục</span>
                                {expandedSections.category ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                            </button>
                            {expandedSections.category && (
                                <div className="collection__filter-content">
                                    {categories.map(cat => (
                                        <label key={cat.id} className="collection__checkbox">
                                            <input
                                                type="radio"
                                                name="category"
                                                checked={selectedCategory === cat.id}
                                                onChange={() => setSelectedCategory(cat.id)}
                                            />
                                            <span className="collection__checkbox-label">
                                                {cat.name} <span className="collection__count">({cat.count})</span>
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Price Filter */}
                        <div className="collection__filter-group">
                            <button
                                className="collection__filter-title"
                                onClick={() => toggleSection('price')}
                            >
                                <span>Khoảng giá</span>
                                {expandedSections.price ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                            </button>
                            {expandedSections.price && (
                                <div className="collection__filter-content">
                                    <div className="collection__price-range">
                                        <input
                                            type="range"
                                            min="0"
                                            max="5000000"
                                            step="100000"
                                            value={priceRange[1]}
                                            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                            className="collection__range-slider"
                                        />
                                        <div className="collection__price-values">
                                            <span>{formatPrice(priceRange[0])}</span>
                                            <span>{formatPrice(priceRange[1])}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Color Filter */}
                        <div className="collection__filter-group">
                            <button
                                className="collection__filter-title"
                                onClick={() => toggleSection('color')}
                            >
                                <span>Màu sắc</span>
                                {expandedSections.color ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                            </button>
                            {expandedSections.color && (
                                <div className="collection__filter-content">
                                    <div className="collection__colors">
                                        {colors.map(color => (
                                            <button
                                                key={color.id}
                                                className={`collection__color ${selectedColors.includes(color.id) ? 'active' : ''}`}
                                                style={{ backgroundColor: color.hex }}
                                                onClick={() => toggleColor(color.id)}
                                                title={color.name}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Brand Filter */}
                        <div className="collection__filter-group">
                            <button
                                className="collection__filter-title"
                                onClick={() => toggleSection('brand')}
                            >
                                <span>Thương hiệu</span>
                                {expandedSections.brand ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                            </button>
                            {expandedSections.brand && (
                                <div className="collection__filter-content">
                                    {brands.map(brand => (
                                        <label key={brand.id} className="collection__checkbox">
                                            <input
                                                type="checkbox"
                                                checked={selectedBrands.includes(brand.id)}
                                                onChange={() => toggleBrand(brand.id)}
                                            />
                                            <span className="collection__checkbox-label">{brand.name}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="collection__main">
                        {/* Toolbar */}
                        <div className="collection__toolbar">
                            <p className="collection__results">Hiển thị {products.length} sản phẩm</p>
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
                                    <option value="rating">Đánh giá cao</option>
                                </select>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className="collection__grid">
                            {products.map(product => (
                                <div key={product.id} className="collection__product-card">
                                    {product.badge && (
                                        <span className={`collection__badge collection__badge--${product.badge.toLowerCase().replace(' ', '-')}`}>
                                            {product.badge}
                                        </span>
                                    )}

                                    <div className="collection__product-image">
                                        <div className="collection__image-placeholder">
                                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                                <circle cx="8.5" cy="8.5" r="1.5" />
                                                <path d="M21 15l-5-5L5 21" />
                                            </svg>
                                        </div>
                                        <div className="collection__product-overlay">
                                            <button className="collection__quick-view">Xem nhanh</button>
                                        </div>
                                    </div>

                                    <div className="collection__product-info">
                                        <p className="collection__product-brand">{product.brand}</p>
                                        <h3 className="collection__product-name">{product.name}</h3>

                                        <div className="collection__product-rating">
                                            <div className="collection__stars">
                                                {'★'.repeat(Math.floor(product.rating))}
                                                {'☆'.repeat(5 - Math.floor(product.rating))}
                                            </div>
                                            <span>({product.rating})</span>
                                        </div>

                                        <div className="collection__product-price">
                                            <span className="collection__price-current">{formatPrice(product.price)}</span>
                                            {product.originalPrice && (
                                                <span className="collection__price-original">{formatPrice(product.originalPrice)}</span>
                                            )}
                                        </div>

                                        <div className="collection__product-colors">
                                            {product.colors.map(colorId => {
                                                const color = colors.find(c => c.id === colorId);
                                                return (
                                                    <span
                                                        key={colorId}
                                                        className="collection__product-color"
                                                        style={{ backgroundColor: color?.hex }}
                                                        title={color?.name}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="collection__pagination">
                            <button className="collection__page-btn collection__page-btn--prev" disabled>
                                Trước
                            </button>
                            <button className="collection__page-btn active">1</button>
                            <button className="collection__page-btn">2</button>
                            <button className="collection__page-btn">3</button>
                            <button className="collection__page-btn">4</button>
                            <button className="collection__page-btn collection__page-btn--next">
                                Sau
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        </LayoutDefault>
    );
};

export default Collection;