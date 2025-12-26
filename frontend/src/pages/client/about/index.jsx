import React, { useEffect, useRef } from 'react';
import LayoutDefault from '../layout_default/layout_default';
import {
    Sparkles,
    ShieldCheck,
    Leaf,
    ArrowRight
} from 'lucide-react';
import './about.scss';

const useReveal = () => {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('is-visible');
                }
            },
            { threshold: 0.15 }
        );

        io.observe(el);
        return () => io.disconnect();
    }, []);

    return ref;
};

const About = () => {
    const heroRef = useReveal();
    const storyRef = useReveal();
    const valuesRef = useReveal();
    const galleryRef = useReveal();
    const newsletterRef = useReveal();

    return (
        <LayoutDefault>
            <div className="about">

                <section ref={heroRef} className="about-hero reveal">
                    <div className="about-hero__bg" />
                    <div className="about-hero__overlay" />

                    <div className="container">
                        <div className="about-hero__content">
                            <span className="about-hero__label">
                                LUXURY BEAUTY BRAND
                            </span>

                            <h1 className="about-hero__title">
                                ĐỊNH NGHĨA LẠI<br />VẺ ĐẸP HIỆN ĐẠI
                            </h1>

                            <button className="about-hero__cta">
                                Khám phá ngay <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </section>

                <section ref={storyRef} className="about-story reveal">
                    <div className="container">
                        <div className="about-story__content">
                            <div className="about-story__text">
                                <span className="about-story__label">
                                    CÂU CHUYỆN CỦA CHÚNG TÔI
                                </span>
                                <h2 className="about-story__title">
                                    Tái định nghĩa vẻ đẹp sang trọng từ năm 2004
                                </h2>
                                <p>
                                    Lumé kết hợp khoa học hiện đại và tinh hoa
                                    thiên nhiên để tạo ra trải nghiệm làm đẹp
                                    tinh tế, an toàn và bền vững.
                                </p>
                            </div>

                            <div className="about-story__image">
                                <img src="../src/assets/4.jpg" alt="Luxury cosmetic" />
                            </div>
                        </div>
                    </div>
                </section>

                <section ref={valuesRef} className="about-values reveal">
                    <div className="container">
                        <h2 className="about-values__title">
                            Giá trị cốt lõi của chúng tôi
                        </h2>

                        <div className="about-values__grid">
                            <div className="value-card">
                                <Sparkles size={36} />
                                <h3>Chất lượng tinh tuyển</h3>
                                <p>
                                    Thành phần cao cấp, được kiểm nghiệm lâm sàng
                                    nghiêm ngặt.
                                </p>
                            </div>

                            <div className="value-card">
                                <ShieldCheck size={36} />
                                <h3>An toàn tuyệt đối</h3>
                                <p>
                                    Không thử nghiệm động vật, phù hợp mọi loại da.
                                </p>
                            </div>

                            <div className="value-card">
                                <Leaf size={36} />
                                <h3>Bền vững tự nhiên</h3>
                                <p>
                                    Bao bì tái chế, thân thiện với môi trường.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section ref={galleryRef} className="about-gallery reveal">
                    <div className="about-gallery__grid">

                        <div className="gallery-item">
                            <img src="../src/assets/1.jpg" alt="Texture makeup" />
                        </div>

                        <div className="gallery-item">
                            <img src="../src/assets/2.jpg" alt="Model beauty" />
                        </div>

                        <div className="gallery-item">
                            <img src="../src/assets/3.jpg" alt="Lipstick texture" />
                        </div>

                        <div className="gallery-item gallery-item--cta">
                            <div className="gallery-cta">
                                <h3>Tham gia phong trào</h3>
                                <p>Khám phá những sản phẩm được yêu thích</p>
                                <button>MUA NGAY</button>
                            </div>
                        </div>

                    </div>
                </section>

                <section ref={newsletterRef} className="about-newsletter reveal">
                    <div className="container">
                        <h2>Luôn toả sáng</h2>
                        <p>
                            Nhận tin tức, câu chuyện và ưu đãi độc quyền từ Lumé
                        </p>

                        <form>
                            <input placeholder="Email của bạn" />
                            <button>ĐĂNG KÝ</button>
                        </form>
                    </div>
                </section>

            </div>
        </LayoutDefault>
    );
};

export default About;
