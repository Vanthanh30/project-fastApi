import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import PropTypes from 'prop-types';

const CategoryFilter = ({
    categories = [],
    selectedCategory = 'all',
    setSelectedCategory,
    isExpanded,
    toggleExpanded
}) => {
    return (
        <div className="collection__filter-group">
            <button
                className="collection__filter-title"
                onClick={toggleExpanded}
            >
                <span>Danh mục</span>
                {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>

            {isExpanded && (
                <div className="collection__filter-content">
                    {categories && categories.length > 0 ? (
                        categories.map(cat => (
                            <label key={cat.id} className="collection__checkbox">
                                <input
                                    type="radio"
                                    name="category"
                                    checked={selectedCategory === cat.id || (selectedCategory === 'all' && cat.id === 'all')}
                                    onChange={() => setSelectedCategory(cat.id)}
                                />
                                <span className="collection__checkbox-label">
                                    {cat.name} <span className="collection__count">({cat.count})</span>
                                </span>
                            </label>
                        ))
                    ) : (
                        <p className="collection__empty-filter">Đang tải danh mục...</p>
                    )}
                </div>
            )}
        </div>
    );
};

CategoryFilter.propTypes = {
    categories: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired,
            count: PropTypes.number.isRequired
        })
    ).isRequired,
    selectedCategory: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    setSelectedCategory: PropTypes.func.isRequired,
    isExpanded: PropTypes.bool.isRequired,
    toggleExpanded: PropTypes.func.isRequired
};

export default CategoryFilter;