import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuEye, LuEyeOff } from "react-icons/lu";
import axios from "axios";
import Alert from "../../../components/Alert/Alert";
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
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errorMessage) setErrorMessage("");
    if (successMessage) setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation phía client
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    if (!formData.agreeToTerms) {
      setErrorMessage("Vui lòng đồng ý với điều khoản dịch vụ!");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

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

      setSuccessMessage(
        "Đăng ký thành công! Email xác nhận đã được gửi. Vui lòng kiểm tra hộp thư để xác nhận tài khoản."
      );

      // Clear form sau khi đăng ký thành công
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
      });

      // Redirect về login sau 4 giây
      setTimeout(() => {
        navigate("/login", {
          state: {
            message: "Vui lòng xác nhận email trước khi đăng nhập",
            registeredEmail: payload.email
          },
        });
      }, 4000);

    } catch (error) {
      console.error("Register failed:", error);
      if (error.response && error.response.data) {
        const detail = error.response.data.detail;
        if (detail === "Email already exists") {
          setErrorMessage("Email này đã được đăng ký. Vui lòng sử dụng email khác hoặc đăng nhập.");
        } else {
          setErrorMessage(detail || "Đăng ký thất bại");
        }
      } else {
        setErrorMessage("Không thể kết nối đến server");
      }
    } finally {
      setIsLoading(false);
    }
  };

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
              Tạo tài khoản mới để trải nghiệm tích điểm và nhận ưu đãi độc quyền
            </p>

            {/* Success Message */}
            {successMessage && (
              <div style={{ position: 'relative' }}>
                <Alert type="success" message={successMessage} />
                <div style={{
                  fontSize: '13px',
                  color: '#059669',
                  textAlign: 'center',
                  marginTop: '-12px',
                  marginBottom: '16px',
                  fontWeight: '500'
                }}>
                  Đang chuyển đến trang đăng nhập<span className="alert__loading"></span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <Alert
                type="error"
                message={errorMessage}
                onClose={() => setErrorMessage("")}
              />
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
                  disabled={isLoading || successMessage}
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
                  disabled={isLoading || successMessage}
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
                    disabled={isLoading || successMessage}
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
                    disabled={isLoading || successMessage}
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
                    disabled={isLoading || successMessage}
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
                disabled={isLoading || successMessage}
              >
                {isLoading ? "Đang xử lý..." : successMessage ? "Thành công!" : "Đăng Ký"}
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