import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import PropTypes from "prop-types";

const PriceFilter = ({
  priceRange = [0, 5000000],
  setPriceRange,
  isExpanded,
  toggleExpanded,
}) => {
  const MAX_PRICE = 5000000;

  const percentage = (priceRange[1] / MAX_PRICE) * 100;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const handlePriceChange = (value) => {
    setPriceRange([0, parseInt(value)]);
  };

  return (
    <div className="collection__filter-group">
      <button
        className="collection__filter-title"
        onClick={toggleExpanded}
        aria-expanded={isExpanded}
      >
        <span>Khoảng giá</span>
        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </button>

      <div
        className={`collection__filter-content ${!isExpanded ? "closing" : ""}`}
      >
        {isExpanded && (
          <div className="collection__price-range">
            <input
              type="range"
              min="0"
              max={MAX_PRICE}
              step="100000"
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(e.target.value)}
              className="collection__range-slider"
              style={{ "--value": `${percentage}%` }}
            />
            <div className="collection__price-values">
              <span>{formatPrice(priceRange[0])}₫</span>
              <span>{formatPrice(priceRange[1])}₫</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

PriceFilter.propTypes = {
  priceRange: PropTypes.arrayOf(PropTypes.number).isRequired,
  setPriceRange: PropTypes.func.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  toggleExpanded: PropTypes.func.isRequired,
};

export default PriceFilter;
