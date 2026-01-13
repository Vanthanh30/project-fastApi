import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import PropTypes from 'prop-types';

const ProductTypeFilter = ({
    productTypes = [],
    selectedProductTypes = [],
    toggleProductType,
    isExpanded,
    toggleExpanded
}) => {
    return (
        <div className="collection__filter-group">
            <button
                className="collection__filter-title"
                onClick={toggleExpanded}
            >
                <span>Loại sản phẩm</span>
                {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>

            {isExpanded && (
                <div className="collection__filter-content">
                    {productTypes && productTypes.length > 0 ? (
                        productTypes.map(type => (
                            <label key={type.id} className="collection__checkbox">
                                <input
                                    type="checkbox"
                                    checked={selectedProductTypes.includes(type.id)}
                                    onChange={() => toggleProductType(type.id)}
                                />
                                <span className="collection__checkbox-label">{type.name}</span>
                            </label>
                        ))
                    ) : (
                        <p className="collection__empty-filter">Không có loại sản phẩm</p>
                    )}
                </div>
            )}
        </div>
    );
};

ProductTypeFilter.propTypes = {
    productTypes: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        })
    ).isRequired,
    selectedProductTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    toggleProductType: PropTypes.func.isRequired,
    isExpanded: PropTypes.bool.isRequired,
    toggleExpanded: PropTypes.func.isRequired
};

export default ProductTypeFilter;