import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  ShieldCheck,
  MapPin,
  User,
  CreditCard,
  Banknote,
  Building2,
  Smartphone,
  Wallet,
} from "lucide-react";
import LayoutDefault from "../layout_default/layout_default";
import "./payment.scss";

const Payment = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalCartPrice, setTotalCartPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    note: "",
    paymentMethod: "cod",
  });

  const [errors, setErrors] = useState({});

  const cities = [
    "Hà Nội",
    "TP. Hồ Chí Minh",
    "Đà Nẵng",
    "Hải Phòng",
    "Cần Thơ",
  ];

  const PAYMENT_METHOD_MAPPING = {
    cod: "Thanh toán khi nhận hàng",
    bank: "Chuyển khoản ngân hàng",
    momo: "Ví Momo",
    card: "Thẻ tín dụng ghi nợ",
  };

  const paymentMethods = [
    {
      id: "cod",
      name: "Thanh toán khi nhận hàng (COD)",
      icon: Banknote,
      description: "",
    },
    {
      id: "bank",
      name: "Chuyển khoản ngân hàng",
      icon: Building2,
      description: "",
      logos: [
        { name: "Vietcombank", image: "../src/assets/bank1.jpg" },
        { name: "Techcombank", image: "../src/assets/bank2.png" },
        { name: "VPBank", image: "../src/assets/bank3.jpg" },
        { name: "BIDV", image: "../src/assets/bank4.jpg" },
      ],
    },
    {
      id: "momo",
      name: "Ví MoMo",
      image: "../src/assets/payment2.jpg",
      description: "",
    },
    {
      id: "card",
      name: "Thẻ tín dụng/ghi nợ",
      icon: CreditCard,
      description: "",
      logos: [
        { name: "Visa", image: "../src/assets/payment1.jpg" },
        { name: "Mastercard", image: "../src/assets/payment5.png" },
        { name: "JCB", image: "../src/assets/payment6.png" },
      ],
    },
  ];

  const fetchUserInfo = async (token) => {
    try {
      const res = await axios.get("http://localhost:8000/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData((prev) => ({
        ...prev,
        fullName: res.data.name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        address: res.data.address || "",
      }));
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const initPaymentData = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      if (
        location.state?.selectedItems &&
        location.state.selectedItems.length > 0
      ) {
        const items = location.state.selectedItems;
        setCartItems(items);

        // Tính tổng tiền dựa trên các món ĐƯỢC CHỌN
        const total = items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        setTotalCartPrice(total);

        // Lấy thông tin user để điền form
        fetchUserInfo(token);
      } else {
        alert("Vui lòng chọn sản phẩm từ giỏ hàng để thanh toán!");
        navigate("/cart");
      }
    };

    initPaymentData();
  }, [navigate, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Vui lòng nhập họ tên";
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }
    if (!formData.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ";
    if (!formData.city) newErrors.city = "Vui lòng chọn tỉnh/thành phố";
    if (!formData.district.trim())
      newErrors.district = "Vui lòng nhập quận/huyện";
    if (!formData.ward.trim()) newErrors.ward = "Vui lòng nhập phường/xã";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    const token = localStorage.getItem("access_token");

    const fullAddress = `${formData.address}, ${formData.ward}, ${formData.district}, ${formData.city}`;
    const cartItemIds = cartItems.map((item) => item.id);

    const orderData = {
      full_name: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      address: fullAddress,
      payment_method: PAYMENT_METHOD_MAPPING[formData.paymentMethod],
      cart_item_ids: cartItemIds,
    };

    try {
      await axios.post("http://localhost:8000/orders/", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Đặt hàng thành công!");
      navigate("/order");
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      const msg =
        error.response?.data?.detail || "Đặt hàng thất bại. Vui lòng thử lại.";
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <LayoutDefault>
      <div className="payment">
        <div className="container">
          <div className="payment__header">
            <h1 className="payment__title">THANH TOÁN</h1>
            <div className="payment__breadcrumb">
              <a href="/cart">Giỏ hàng</a>
              <span>/</span>
              <span>Thanh toán</span>
            </div>
          </div>

          <div className="payment__content">
            <div className="payment__form">
              <section className="payment__section">
                <h2 className="payment__section-title">
                  <User size={20} />
                  Thông tin liên hệ
                </h2>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="fullName">
                      Họ và tên <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Nguyễn Văn A"
                      className={errors.fullName ? "error" : ""}
                    />
                    {errors.fullName && (
                      <span className="error-message">{errors.fullName}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">
                      Số điện thoại <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0912345678"
                      className={errors.phone ? "error" : ""}
                    />
                    {errors.phone && (
                      <span className="error-message">{errors.phone}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className={errors.email ? "error" : ""}
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>
              </section>

              <section className="payment__section">
                <h2 className="payment__section-title">
                  <MapPin size={20} />
                  Địa chỉ giao hàng
                </h2>

                <div className="form-group">
                  <label htmlFor="address">
                    Địa chỉ cụ thể <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Số nhà, tên đường"
                    className={errors.address ? "error" : ""}
                  />
                  {errors.address && (
                    <span className="error-message">{errors.address}</span>
                  )}
                </div>

                <div className="form-grid form-grid--3">
                  <div className="form-group">
                    <label htmlFor="city">
                      Tỉnh/Thành phố <span className="required">*</span>
                    </label>
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={errors.city ? "error" : ""}
                    >
                      <option value="">Chọn tỉnh/thành phố</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    {errors.city && (
                      <span className="error-message">{errors.city}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="district">
                      Quận/Huyện <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="district"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      placeholder="Quận/Huyện"
                      className={errors.district ? "error" : ""}
                    />
                    {errors.district && (
                      <span className="error-message">{errors.district}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="ward">
                      Phường/Xã <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="ward"
                      name="ward"
                      value={formData.ward}
                      onChange={handleChange}
                      placeholder="Phường/Xã"
                      className={errors.ward ? "error" : ""}
                    />
                    {errors.ward && (
                      <span className="error-message">{errors.ward}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="note">Ghi chú đơn hàng (tuỳ chọn)</label>
                  <textarea
                    id="note"
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn"
                    rows="4"
                  />
                </div>
              </section>

              <section className="payment__section">
                <h2 className="payment__section-title">
                  <CreditCard size={20} />
                  Phương thức thanh toán
                </h2>

                <div className="payment-methods">
                  {paymentMethods.map((method) => {
                    return (
                      <label key={method.id} className="payment-method">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={handleChange}
                        />
                        <span className="payment-method__icon">
                          {method.image ? (
                            <img
                              src={method.image}
                              alt={method.name}
                              style={{
                                width: "20px",
                                height: "20px",
                                objectFit: "contain",
                              }}
                            />
                          ) : (
                            React.createElement(method.icon, { size: 20 })
                          )}
                        </span>
                        <span className="payment-method__info">
                          <span className="payment-method__name">
                            {method.name}
                          </span>
                          {method.logos && method.logos.length > 0 && (
                            <span className="payment-method__logos">
                              {method.logos.map((logo, index) => (
                                <img
                                  key={index}
                                  src={logo.image}
                                  alt={logo.name}
                                  title={logo.name}
                                />
                              ))}
                            </span>
                          )}
                          {method.description && (
                            <span className="payment-method__description">
                              {method.description}
                            </span>
                          )}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </section>
            </div>

            <div className="payment__summary">
              <div className="payment__summary-sticky">
                <h2 className="payment__summary-title">Đơn hàng của bạn</h2>

                <div className="order-items">
                  {cartItems.map((item) => (
                    <div key={item.id} className="order-item">
                      <div className="order-item__image">
                        <div className="order-item__image-placeholder"></div>
                      </div>
                      <div className="order-item__details">
                        <h3 className="order-item__name">{item.name}</h3>
                        <p className="order-item__variant">
                          {item.color} × {item.quantity}
                        </p>
                      </div>
                      <div className="order-item__price">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="coupon-box">
                  <input
                    type="text"
                    placeholder="Mã giảm giá"
                    className="coupon-box__input"
                  />
                  <button type="button" className="coupon-box__btn">
                    Áp dụng
                  </button>
                </div>

                <div className="price-summary">
                  <div className="price-summary__row">
                    <span>Tạm tính</span>
                    <span>{formatPrice(totalCartPrice)}</span>
                  </div>
                  <div className="price-summary__row">
                    <span>Phí vận chuyển</span>
                    <span className="text-success">Miễn phí</span>
                  </div>
                  <div className="price-summary__divider"></div>
                  <div className="price-summary__row price-summary__total">
                    <span>Tổng cộng</span>
                    <span className="price-summary__total-amount">
                      {formatPrice(totalCartPrice)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  className="payment__submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? "ĐANG XỬ LÝ..." : "ĐẶT HÀNG NGAY"}
                </button>

                <div className="payment__security">
                  <ShieldCheck size={16} />
                  <span>Thanh toán bảo mật & mã hoá</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutDefault>
  );
};

export default Payment;
