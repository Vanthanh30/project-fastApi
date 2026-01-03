import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuEye, LuEyeOff } from "react-icons/lu";
import axios from "axios";
import "./auth.scss";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (!formData.agreeToTerms) {
      setErrorMessage("Vui lòng đồng ý với điều khoản dịch vụ!");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const payload = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      };

      const response = await axios.post(
        "http://localhost:8000/auth/register",
        payload
      );

      const { access_token } = response.data;
      localStorage.setItem("access_token", access_token);

      navigate("/");
    } catch (error) {
      console.error("Register failed:", error);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.detail || "Đăng ký thất bại");
      } else {
        setErrorMessage("Không thể kết nối đến server");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="auth">
      <div className="auth__container">
        <div className="auth__box">
          <div
            className="auth__section auth__section--image"
            data-page="register"
          >
            <Link to="/" className="auth__brand-logo">
              <span className="auth__brand-star">★</span>
              <span className="auth__brand-text">LUMIÈRE</span>
            </Link>
          </div>

          <div className="auth__section">
            <h2 className="auth__title">Đăng Ký</h2>
            <p className="auth__subtitle">
              Tạo tài khoản mới để trải nghiệm tích điểm và nhận ưu đãi độc
              quyền
            </p>

            {errorMessage && (
              <div
                style={{
                  color: "red",
                  marginBottom: "15px",
                  fontSize: "14px",
                  textAlign: "center",
                  backgroundColor: "#ffe6e6",
                  padding: "10px",
                  borderRadius: "4px",
                }}
              >
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth__form">
              <div className="auth__form-group">
                <label className="auth__label">Họ và tên</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="auth__input"
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>

              <div className="auth__form-group">
                <label className="auth__label">Địa chỉ Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="auth__input"
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div className="auth__form-group">
                <label className="auth__label">Mật khẩu</label>

                <div className="auth__password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="auth__input auth__input--password"
                    placeholder="••••••••"
                    required
                    minLength="6"
                  />

                  {showPassword ? (
                    <LuEye
                      className="auth__eye-icon"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <LuEyeOff
                      className="auth__eye-icon"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowPassword(true)}
                    />
                  )}
                </div>
              </div>

              <div className="auth__form-group">
                <label className="auth__label">Xác nhận mật khẩu</label>

                <div className="auth__password-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="auth__input auth__input--password"
                    placeholder="••••••••"
                    required
                    minLength="6"
                  />

                  {showConfirmPassword ? (
                    <LuEye
                      className="auth__eye-icon"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowConfirmPassword(false)}
                    />
                  ) : (
                    <LuEyeOff
                      className="auth__eye-icon"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowConfirmPassword(true)}
                    />
                  )}
                </div>
              </div>

              <div className="auth__form-group auth__form-group--checkbox">
                <label className="auth__checkbox">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    required
                  />
                  <span className="auth__checkbox-custom"></span>
                  <span className="auth__checkbox-label">
                    Tôi đồng ý với{" "}
                    <Link to="/terms" className="auth__link">
                      Điều khoản dịch vụ
                    </Link>{" "}
                    và{" "}
                    <Link to="/privacy" className="auth__link">
                      Chính sách bảo mật
                    </Link>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="auth__submit"
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Đăng Ký"}
              </button>

              <div className="auth__footer">
                <p className="auth__footer-text">
                  Đã có tài khoản?{" "}
                  <Link to="/login" className="auth__link">
                    Đăng nhập ngay
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
