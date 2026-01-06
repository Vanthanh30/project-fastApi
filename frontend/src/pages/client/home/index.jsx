import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import LayoutDefault from '../layout_default/layout_default';
import ChatboxAI from '../../../components/Chatbox/ChatboxAI';
import ProductService from '../../../service/client/productService';
import './home.scss';

const Home = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const accessToken = searchParams.get("access_token");

    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
      navigate("/", { replace: true });
      window.location.reload();
    }
  }, [searchParams, navigate]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const products = await ProductService.getFeaturedProducts(4);

      const formatted = products.map(product => ({
        id: product.id,
        name: product.name,
        category: product.category_name || product.brand || 'Sản phẩm',
        price: ProductService.formatPrice(product.price),
        tag: product.status === 'active' && product.id ? 'MỚI NHẤT' : null,
        image: ProductService.getImageUrl(product.image),
        rawPrice: product.price
      }));

      setFeaturedProducts(formatted);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const seasonalProducts = [
    {
      id: 1,
      category: "MẶT",
      title: "Làm Nền",
      description: "Lớp nền hoàn hảo cho làn da rạng rỡ",
      image: "/seasonal/face.jpg",
    },
    {
      id: 2,
      category: "MÔI",
      title: "Màu Hồng",
      description: "Sắc màu quyến rũ bền lâu",
      image: "/seasonal/lips.jpg",
    },
    {
      id: 3,
      category: "MẮT",
      title: "Màu Nâu",
      description: "Làm nổi bật đôi mắt của bạn",
      image: "/seasonal/eyes.jpg",
    },
  ];

  return (
    <LayoutDefault>
      <div className="home">
        <section className="hero">
          <div className="hero__image-bg"></div>
          <div className="hero__content">
            <p className="hero__label">BỘ SƯU TẬP MỚI</p>
            <h1 className="hero__title">
              CHẠM NHẸ
              <br />
              TỎA NHUNG
            </h1>
            <p className="hero__description">
              Trải nghiệm chạm mịn như nhung, từ má hồng, môi hồng đến trang
              điểm hoàn thiện. Tiếp tục câu chuyện trang điểm của bạn.
            </p>
            <button className="hero__cta">MUA BỘ SƯU TẬP</button>
          </div>
        </section>
        <section className="featured">
          <div className="container">
            <div className="featured__header">
              <h2 className="featured__title">TINH HOA BIỂU TƯỢNG</h2>
              <p className="featured__subtitle">
                Những sản phẩm được yêu thích nhất, luôn chạy hàng đầu trên các
                bảng xếp hạng
              </p>
              <a href="/products" className="featured__link">
                XEM TẤT CẢ →
              </a>
            </div>

            {loading ? (
              <div className="featured__loading">
                <div className="spinner"></div>
                <p>Đang tải sản phẩm...</p>
              </div>
            ) : error ? (
              <div className="featured__error">
                <p className="error-message">{error}</p>
                <button onClick={fetchProducts} className="retry-button">
                  Thử lại
                </button>
              </div>
            ) : featuredProducts.length === 0 ? (
              <div className="featured__empty">
                <p>Chưa có sản phẩm nào</p>
              </div>
            ) : (
              <div className="featured__grid">
                {featuredProducts.map((product) => (
                  <Link
                    to={`/product/${product.id}`}
                    key={product.id}
                    className="product-card"
                  >
                    {product.tag && (
                      <span className="product-card__tag">{product.tag}</span>
                    )}
                    <div className="product-card__image">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                        }}
                      />
                    </div>
                    <div className="product-card__info">
                      <h3 className="product-card__name">{product.name}</h3>
                      <p className="product-card__category">{product.category}</p>
                      <p className="product-card__price">{product.price}₫</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
        <section className="premium">
          <div className="container">
            <div className="premium__content">
              <div className="premium__image">
                <div className="premium__image-placeholder"></div>
              </div>
              <div className="premium__text">
                <span className="premium__label">TRIẾT LÝ CỦA CHÚNG TÔI</span>
                <h2 className="premium__title">
                  Sang Trọng Thuần Khiết.
                  <br />
                  Đột Phá Khoa Học.
                </h2>
                <p className="premium__description">
                  LUMIÈRE ra đời từ niềm khao khát tạo nên một thương hiệu mỹ
                  phẩm cao cấp không chỉ mang lại vẻ đẹp ngoại hình mà còn nuôi
                  dưỡng làn da từ sâu bên trong. Chúng tôi tin rằng vẻ đẹp thực
                  sự đến từ sự tự tin và sức khỏe làn da được chăm sóc tận tâm.
                </p>
                <button className="premium__cta">
                  ĐỌC CÂU CHUYỆN CỦA CHÚNG TÔI
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className="seasonal">
          <div className="container">
            <div className="seasonal__header">
              <h2 className="seasonal__title">MUA SẮM THEO DANH MỤC</h2>
              <p className="seasonal__subtitle">
                Khám phá các sản phẩm trang điểm nguyên tắc. Sản phẩm của chúng
                tôi được nghiên cứu kỹ lưỡng và kiểm định nghiêm ngặt để đem lại
                trải nghiệm hoàn hảo.
              </p>
            </div>

            <div className="seasonal__grid">
              {seasonalProducts.map((item) => (
                <div key={item.id} className="seasonal-card">
                  <div className="seasonal-card__image">
                    <div className="seasonal-card__image-placeholder"></div>
                    <div className="seasonal-card__overlay">
                      <div className="seasonal-card__text">
                        <h3 className="seasonal-card__category">{item.category}</h3>
                        <p className="seasonal-card__title">{item.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <ChatboxAI />
    </LayoutDefault>
  );
};

export default Home;
