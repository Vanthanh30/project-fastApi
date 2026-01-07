import React from "react";
import "./alert.scss";

const Alert = ({ type = "info", message, onClose }) => {
    const icons = {
        success: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M6 10L8.5 12.5L14 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        error: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M7 7L13 13M13 7L7 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
        warning: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L2 17H18L10 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
                <path d="M10 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="10" cy="14.5" r="0.5" fill="currentColor" />
            </svg>
        ),
        info: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M10 9V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="10" cy="6" r="1" fill="currentColor" />
            </svg>
        ),
    };

    return (
        <div className={`alert alert--${type}`}>
            <div className="alert__icon">{icons[type]}</div>
            <div className="alert__content">
                <p className="alert__message">{message}</p>
            </div>
            {onClose && (
                <button className="alert__close" onClick={onClose} aria-label="Close">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default Alert;