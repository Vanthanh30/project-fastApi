import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ShieldCheck, MapPin, User, CreditCard, Banknote } from "lucide-react";
import LayoutDefault from "../layout_default/layout_default";
import "./payment.scss";

const API_BASE_URL = "http://localhost:8000";

const CITIES = ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ"];

const PAYMENT_METHOD_MAPPING = {
  cod: "Thanh toán khi nhận hàng",
};

const PAYMENT_METHODS = [
  {
    id: "cod",
    name: "Thanh toán khi nhận hàng (COD)",
    icon: Banknote,
    description: "Thanh toán bằng tiền mặt khi nhận hàng.",
  },
];

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    ward: "",
    note: "",
    paymentMethod: "cod",
  });

  const [errors, setErrors] = useState({});

  const totalCartPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  useEffect(() => {
    const initPaymentData = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      if (location.state?.selectedItems?.length > 0) {
        setCartItems(location.state.selectedItems);
        try {
          const res = await axios.get(`${API_BASE_URL}/auth/me`, {
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
          console.error("Lỗi lấy thông tin user:", e);
        }
      } else {
        alert("Vui lòng chọn sản phẩm từ giỏ hàng để thanh toán!");
        navigate("/cart");
      }
    };

    initPaymentData();
  }, [navigate, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /^[0-9]{10,11}$/;

    if (!formData.fullName.trim()) newErrors.fullName = "Vui lòng nhập họ tên";

    if (!formData.email.trim()) newErrors.email = "Vui lòng nhập email";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Email không hợp lệ";

    if (!formData.phone.trim()) newErrors.phone = "Vui lòng nhập SĐT";
    else if (!phoneRegex.test(formData.phone))
      newErrors.phone = "SĐT không hợp lệ";

    if (!formData.address.trim()) newErrors.address = "Nhập địa chỉ";
    if (!formData.city) newErrors.city = "Chọn Tỉnh/TP";
    if (!formData.ward.trim()) newErrors.ward = "Nhập Phường/Xã";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    const token = localStorage.getItem("access_token");

    const fullAddress = `${formData.address}, ${formData.ward}, ${formData.city}`;
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
      await axios.post(`${API_BASE_URL}/orders/`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Đặt hàng thành công!");
      navigate("/order");
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      alert(error.response?.data?.detail || "Đặt hàng thất bại.");
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

  const renderInput = (
    id,
    label,
    placeholder,
    type = "text",
    wrapperClass = ""
  ) => (
    <div className={`form-group ${wrapperClass}`}>
      <label htmlFor={id}>
        {label} <span className="required">*</span>
      </label>
      <input
        type={type}
        id={id}
        name={id}
        value={formData[id]}
        onChange={handleChange}
        placeholder={placeholder}
        className={errors[id] ? "error" : ""}
      />
      {errors[id] && <span className="error-message">{errors[id]}</span>}
    </div>
  );

  return (
    <LayoutDefault>
      <div className="payment">
        <div className="container">
          <div className="payment__header">
            <h1 className="payment__title">THANH TOÁN</h1>
            <div className="payment__breadcrumb">
              <a href="/cart">Giỏ hàng</a> <span>/</span>{" "}
              <span>Thanh toán</span>
            </div>
          </div>

          <div className="payment__content">
            <div className="payment__form">
              <section className="payment__section">
                <h2 className="payment__section-title">
                  <User size={20} /> Thông tin liên hệ
                </h2>
                <div className="form-grid form-grid--2">
                  {renderInput("fullName", "Họ và tên", "Nguyễn Văn A")}
                  {renderInput("phone", "Số điện thoại", "0912345678", "tel")}
                </div>
                {renderInput("email", "Email", "email@example.com", "email")}
              </section>

              <section className="payment__section">
                <h2 className="payment__section-title">
                  <MapPin size={20} /> Địa chỉ giao hàng
                </h2>

                <div className="address-row">
                  <div className="form-group address-specific">
                    <label htmlFor="address">
                      Địa chỉ cụ thể <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Số nhà, đường"
                      className={errors.address ? "error" : ""}
                    />
                    {errors.address && (
                      <span className="error-message">{errors.address}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="city">
                      Tỉnh/TP <span className="required">*</span>
                    </label>
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={errors.city ? "error" : ""}
                    >
                      <option value="">Chọn</option>
                      {CITIES.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    {errors.city && (
                      <span className="error-message">{errors.city}</span>
                    )}
                  </div>

                  {renderInput("ward", "Phường/Xã", "Phường...")}
                </div>

                <div className="form-group mt-3">
                  <label htmlFor="note">Ghi chú (tuỳ chọn)</label>
                  <textarea
                    id="note"
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Ví dụ: Giao giờ hành chính..."
                    rows="3"
                  />
                </div>
              </section>

              <section className="payment__section">
                <h2 className="payment__section-title">
                  <CreditCard size={20} /> Phương thức thanh toán
                </h2>
                <div className="payment-methods">
                  {PAYMENT_METHODS.map((method) => (
                    <label key={method.id} className="payment-method">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={formData.paymentMethod === method.id}
                        onChange={handleChange}
                      />
                      <span className="payment-method__icon">
                        <method.icon size={20} />
                      </span>
                      <span className="payment-method__info">
                        <span className="payment-method__name">
                          {method.name}
                        </span>
                        <span className="payment-method__description">
                          {method.description}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </section>
            </div>

            <div className="payment__summary">
              <div className="payment__summary-sticky">
                <h2 className="payment__summary-title">
                  Đơn hàng ({cartItems.length} sản phẩm)
                </h2>
                <div className="order-items">
                  {cartItems.map((item) => (
                    <div key={item.id} className="order-item">
                      <div className="order-item__image">
                        {item.product?.image || item.image ? (
                          <img
                            src={item.product?.image || item.image}
                            alt={item.product?.name || item.name}
                          />
                        ) : (
                          <div className="order-item__image-placeholder"></div>
                        )}
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

                <div className="price-summary">
                  <div className="price-summary__row">
                    <span>Tạm tính</span>
                    <span>{formatPrice(totalCartPrice)}</span>
                  </div>
                  <div className="price-summary__row">
                    <span>Vận chuyển</span>
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
                  <ShieldCheck size={16} />{" "}
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
