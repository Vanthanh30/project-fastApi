import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.scss';

const Pagination = ({
    currentPage = 1,
    totalItems = 0,
    itemsPerPage = 10,
    onPageChange,
    showIfLessThan = 4
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalItems < showIfLessThan) {
        return null;
    }
    if (totalPages <= 1) {
        return null;
    }

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            onPageChange(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (currentPage > 3) {
                pages.push('...');
            }
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) {
                    pages.push(i);
                }
            }

            if (currentPage < totalPages - 2) {
                pages.push('...');
            }
            if (!pages.includes(totalPages)) {
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="pagination">
            <div className="pagination__info">
                Hiển thị <span className="pagination__info-number">{startItem}</span> đến{' '}
                <span className="pagination__info-number">{endItem}</span> trong tổng số{' '}
                <span className="pagination__info-number">{totalItems}</span> kết quả
            </div>

            <div className="pagination__controls">
                <button
                    className="pagination__btn pagination__btn--prev"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    title="Trang trước"
                >
                    <ChevronLeft size={18} />
                    <span className="pagination__btn-text">Trước</span>
                </button>

                <div className="pagination__numbers">
                    {pageNumbers.map((page, index) => {
                        if (page === '...') {
                            return (
                                <span key={`dots-${index}`} className="pagination__dots">
                                    ...
                                </span>
                            );
                        }

                        return (
                            <button
                                key={page}
                                className={`pagination__number ${currentPage === page ? 'pagination__number--active' : ''
                                    }`}
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </button>
                        );
                    })}
                </div>

                <button
                    className="pagination__btn pagination__btn--next"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    title="Trang sau"
                >
                    <span className="pagination__btn-text">Sau</span>
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;