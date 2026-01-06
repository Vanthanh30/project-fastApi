import React from 'react';
import { Search } from 'lucide-react';
import PropTypes from 'prop-types';

const ProductFilter = ({
    searchTerm,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    categories
}) => {
    return (
        <div className="product-page__toolbar">
            <div className="product-page__search">
                <Search className="product-page__search-icon" size={18} />
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên, ID, hoặc thương hiệu..."
                    value={searchTerm}
                    onChange={onSearchChange}
                    className="product-page__search-input"
                />
            </div>
            <select
                className="product-page__category-select"
                value={selectedCategory}
                onChange={onCategoryChange}
            >
                <option value="all">Tất cả danh mục</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                        {category.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

ProductFilter.propTypes = {
    searchTerm: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    selectedCategory: PropTypes.string.isRequired,
    onCategoryChange: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
};

export default ProductFilter;