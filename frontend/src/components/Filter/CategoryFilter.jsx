import React from 'react';
import { Search } from 'lucide-react';
import PropTypes from 'prop-types';

const CategoryFilter = ({
    searchTerm,
    onSearchChange
}) => {
    return (
        <div className="category-page__toolbar">
            <div className="category-page__search" style={{ maxWidth: '800px' }}>
                <Search className="category-page__search-icon" size={18} />
                <input
                    type="text"
                    placeholder="Tìm kiếm danh mục theo tên, mô tả..."
                    value={searchTerm}
                    onChange={onSearchChange}
                    className="category-page__search-input"
                />
            </div>
        </div>
    );
};

CategoryFilter.propTypes = {
    searchTerm: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func.isRequired,
};

export default CategoryFilter;