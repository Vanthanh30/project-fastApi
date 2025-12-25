import React from 'react';
import Header from './Header';
import Footer from './Footer';
import './layout_default.scss';

const LayoutDefault = ({ children }) => {
    return (
        <div className="layout">
            <Header />
            <main className="main-content">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default LayoutDefault;