import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Search.scss";

const Search = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const searchRef = useRef(null);
    const navigate = useNavigate();

    // Tìm kiếm sản phẩm
    useEffect(() => {
        const searchProducts = async () => {
            if (searchQuery.trim().length < 2) {
                setSearchResults([]);
                setShowResults(false);
                return;
            }

            setIsSearching(true);
            try {
                const response = await axios.get(
                    `http://localhost:8000/products/search?q=${encodeURIComponent(searchQuery)}`
                );
                setSearchResults(response.data || []);
                setShowResults(true);
            } catch (error) {
                console.error("Search error:", error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        };

        const debounceTimer = setTimeout(() => {
            searchProducts();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    // Click outside để đóng dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Xử lý chọn sản phẩm
    const handleSelectProduct = (productId) => {
        setSearchQuery("");
        setShowResults(false);
        navigate(`/product/${productId}`);
    };

    // Xử lý Enter
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && searchResults.length > 0) {
            handleSelectProduct(searchResults[0].id);
        }
    };

    // Highlight text khớp
    const highlightText = (text, query) => {
        if (!query.trim()) return text;

        const parts = text.split(new RegExp(`(${query})`, "gi"));
        return parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase() ? (
                <strong key={index}>{part}</strong>
            ) : (
                part
            )
        );
    };

    return (
        <div className="search" ref={searchRef}>
            <div className="search__input-wrapper">
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.trim().length >= 2 && setShowResults(true)}
                    onKeyDown={handleKeyDown}
                    className="search__input"
                />
                <svg
                    className="search__icon"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                >
                    <path
                        d="M7 12C9.76142 12 12 9.76142 12 7C12 4.23858 9.76142 2 7 2C4.23858 2 2 4.23858 2 7C2 9.76142 4.23858 12 7 12Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M14 14L10.5 10.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                {isSearching && (
                    <div className="search__loading">
                        <div className="search__spinner"></div>
                    </div>
                )}
            </div>

            {showResults && searchQuery.trim().length >= 2 && (
                <div className="search__results">
                    {searchResults.length > 0 ? (
                        <>
                            {searchResults.map((product) => (
                                <div
                                    key={product.id}
                                    className="search__item"
                                    onClick={() => handleSelectProduct(product.id)}
                                >
                                    <div className="search__item-image">
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} />
                                        ) : (
                                            <div className="search__item-placeholder">
                                                <svg
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                >
                                                    <rect
                                                        x="3"
                                                        y="3"
                                                        width="18"
                                                        height="18"
                                                        rx="2"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                    />
                                                    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                                                    <path
                                                        d="M21 15L16 10L5 21"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="search__item-info">
                                        <div className="search__item-name">
                                            {highlightText(product.name, searchQuery)}
                                        </div>
                                        {product.brand && (
                                            <div className="search__item-brand">
                                                {product.brand}
                                            </div>
                                        )}
                                        {product.category && (
                                            <div className="search__item-category">
                                                <svg
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                >
                                                    <path
                                                        d="M4 7H20M4 12H20M4 17H20"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                                <span>{product.category}</span>
                                            </div>
                                        )}
                                        {product.description && (
                                            <div className="search__item-description">
                                                {product.description.length > 60
                                                    ? product.description.substring(0, 60) + "..."
                                                    : product.description}
                                            </div>
                                        )}
                                    </div>
                                    <div className="search__item-price">
                                        {new Intl.NumberFormat("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        }).format(product.price)}
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="search__no-results">
                            <svg
                                width="48"
                                height="48"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="search__no-results-icon"
                            >
                                <path
                                    d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M21 21L16.65 16.65"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <p>Không tìm thấy sản phẩm "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Search;