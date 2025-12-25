import React from 'react';
import Header from './header';
import Footer from './footer';
import './layout_default.scss';

const LayoutDefault = ({ children }) => {
    return (
        <div className="layout-default">
            <Header />
            <main className="layout-default__content">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default LayoutDefault;