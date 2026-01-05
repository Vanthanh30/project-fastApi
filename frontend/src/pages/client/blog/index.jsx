import React, { useState } from 'react';
import LayoutDefault from '../layout_default/layout_default';
import './blog.scss';

const Blog = () => {
    return (
        <LayoutDefault>
            <div className="blog">

                {/* HERO */}
                <section className="blog-hero">
                    <div className="blog-hero__image">
                        <img src="../src/assets/3.jpg" alt="Blog hero" />
                    </div>

                    <div className="blog-hero__content">
                        <span className="blog-hero__tag">BEAUTY</span>
                        <h1>Nghệ Thuật Của Đôi Môi Đỏ</h1>
                        <p>
                            Khám phá xu hướng, cảm hứng làm đẹp và nghệ thuật
                            trang điểm cao cấp từ Lumé.
                        </p>
                        <button>ĐỌC NGAY</button>
                    </div>
                </section>

                {/* FILTER */}
                <section className="blog-filter container">
                    <button className="active">Tất cả</button>
                    <button>Trang điểm</button>
                    <button>Chăm sóc da</button>
                    <button>Phong cách</button>
                    <button>Insights</button>
                </section>

                {/* FEATURED */}
                <section className="blog-section container">
                    <h2>Bài Viết Mới Nhất</h2>

                    <div className="blog-grid featured">
                        <article className="blog-card">
                            <img src="../src/assets/1.jpg" />
                            <span className="tag">FEATURED</span>
                            <h3>Bí Quyết Chăm Sóc Da Mùa Hè</h3>
                            <p>Những bước chăm sóc da giúp bạn luôn rạng rỡ.</p>
                        </article>

                        <article className="blog-card">
                            <img src="../src/assets/2.jpg" />
                            <span className="tag">MAKEUP</span>
                            <h3>Xu Hướng Makeup 2025</h3>
                            <p>Phong cách trang điểm tự nhiên lên ngôi.</p>
                        </article>

                        <article className="blog-card">
                            <img src="../src/assets/3.jpg" />
                            <span className="tag">SKINCARE</span>
                            <h3>Serum Phục Hồi Da</h3>
                            <p>Sản phẩm được yêu thích nhất năm nay.</p>
                        </article>
                    </div>
                </section>

                {/* SUBSCRIBE */}
                <section className="blog-subscribe container">
                    <div className="blog-subscribe__box">
                        <div>
                            <h3>Tham Gia Cùng Inner Circle</h3>
                            <p>
                                Nhận bài viết độc quyền, xu hướng mới nhất từ Lumé
                            </p>
                        </div>

                        <form>
                            <input placeholder="Email của bạn" />
                            <button>Đăng ký</button>
                        </form>
                    </div>
                </section>

                {/* MORE POSTS */}
                <section className="blog-section container">
                    <div className="blog-grid">
                        <article className="blog-card small">
                            <img src="../src/assets/2.jpg" />
                            <h4>Gợi Ý Trang Điểm Dự Tiệc</h4>
                        </article>

                        <article className="blog-card small">
                            <img src="../src/assets/1.jpg" />
                            <h4>Nước Hoa Cao Cấp</h4>
                        </article>

                        <article className="blog-card small">
                            <img src="../src/assets/4.jpg" />
                            <h4>Bí Quyết Dưỡng Da Ban Đêm</h4>
                        </article>
                    </div>

                    <div className="blog-more">
                        <button>Xem thêm bài viết</button>
                    </div>
                </section>

            </div>
        </LayoutDefault>
    );
};

export default Blog;
