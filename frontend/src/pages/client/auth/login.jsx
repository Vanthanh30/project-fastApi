import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LuEye, LuEyeOff } from "react-icons/lu";
import axios from "axios";
import Alert from "../../../components/Alert/Alert";
import "./auth.scss";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (location.state?.message) {
      setInfoMessage(location.state.message);

      if (location.state?.registeredEmail) {
        setFormData((prev) => ({
          ...prev,
          email: location.state.registeredEmail,
        }));
      }

      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrorMessage("");
    setShowResendButton(false);
  };

  const handleResendVerification = async () => {
    if (!formData.email) {
      setErrorMessage("Vui lòng nhập email");
      return;
    }

    setIsResending(true);
    setErrorMessage("");
    setInfoMessage("");

    try {
      await axios.post(
        `http://localhost:8000/auth/resend-verification?email=${formData.email}`
      );

      setInfoMessage(
        "Email xác nhận đã được gửi lại. Vui lòng kiểm tra hộp thư của bạn."
      );
      setShowResendButton(false);
    } catch (error) {
      console.error("Resend failed:", error);

      if (error.response?.data?.detail) {
        setErrorMessage(error.response.data.detail);
      } else {
        setErrorMessage("Không thể gửi email. Vui lòng thử lại sau.");
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setInfoMessage("");
    setShowResendButton(false);

    try {
      const response = await axios.post("http://localhost:8000/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const { access_token } = response.data;
      localStorage.setItem("access_token", access_token);

      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);

      if (error.response) {
        const status = error.response.status;
        const detail = error.response.data?.detail;

        if (status === 404) {
          setErrorMessage(
            "Tài khoản chưa tồn tại trong hệ thống. Vui lòng kiểm tra lại email hoặc đăng ký mới."
          );
        } else if (status === 403) {
          setErrorMessage(detail || "Bạn không có quyền đăng nhập.");

          if (detail && detail.toLowerCase().includes("xác thực")) {
            setShowResendButton(true);
          }
        } else if (status === 401) {
          setErrorMessage("Mật khẩu không chính xác. Vui lòng thử lại.");
        } else {
          setErrorMessage(
            detail || "Đăng nhập thất bại. Vui lòng thử lại sau."
          );
        }
      } else {
        setErrorMessage(
          "Không thể kết nối đến server. Vui lòng kiểm tra đường truyền."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://127.0.0.1:8000/auth/google";
  };

  const handleFacebookLogin = () => {
    window.location.href = "http://localhost:8000/auth/facebook";
  };

  return (
    <div className="auth">
      <div className="auth__container">
        <div className="auth__box">
          <div className="auth__section">
            <h2 className="auth__title">Đăng Nhập</h2>
            <p className="auth__subtitle">
              Chào mừng trở lại. Vui lòng đăng nhập vào tài khoản của bạn
            </p>

            {infoMessage && (
              <Alert
                type="info"
                message={infoMessage}
                onClose={() => setInfoMessage("")}
              />
            )}

            {errorMessage && (
              <Alert
                type="error"
                message={errorMessage}
                onClose={() => {
                  setErrorMessage("");
                  setShowResendButton(false);
                }}
              />
            )}

            {showResendButton && (
              <div className="auth__resend-section">
                <button
                  type="button"
                  className="auth__resend-btn"
                  onClick={handleResendVerification}
                  disabled={isResending}
                >
                  {isResending ? "Đang gửi..." : "Gửi lại email xác nhận"}
                </button>
              </div>
            )}

            <div className="auth__social">
              <button
                type="button"
                className="auth__social-btn auth__social-btn--google"
                onClick={handleGoogleLogin}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
                    fill="#4285F4"
                  />
                  <path
                    d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
                    fill="#34A853"
                  />
                  <path
                    d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button>
              <button
                type="button"
                className="auth__social-btn auth__social-btn--facebook"
                onClick={handleFacebookLogin}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.4921 3.29117 17.2155 7.59375 17.8907V11.6016H5.30859V9H7.59375V7.01719C7.59375 4.76156 8.93742 3.51562 10.9932 3.51562C11.9776 3.51562 13.0078 3.69141 13.0078 3.69141V5.90625H11.8729C10.7549 5.90625 10.4062 6.60001 10.4062 7.3125V9H12.9023L12.5033 11.6016H10.4062V17.8907C14.7088 17.2155 18 13.4921 18 9Z"
                    fill="#1877F2"
                  />
                </svg>
                Facebook
              </button>
            </div>

            <div className="auth__divider">
              <span>Hoặc đăng nhập bằng email</span>
            </div>

            <form onSubmit={handleSubmit} className="auth__form">
              <div className="auth__form-group">
                <label className="auth__label">Email/Tên đăng nhập</label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="auth__input"
                  placeholder="example@email.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="auth__form-group">
                <div className="auth__label-row">
                  <label className="auth__label">Mật khẩu</label>
                  <Link
                    to="/forgotpassword"
                    className="auth__link auth__link--forgot"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="auth__password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="auth__input auth__input--password"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
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

              <div className="auth__form-group auth__form-group--checkbox">
                <label className="auth__checkbox">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <span className="auth__checkbox-custom"></span>
                  <span className="auth__checkbox-label">
                    Ghi nhớ đăng nhập
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="auth__submit"
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Đăng Nhập"}
              </button>

              <div className="auth__footer">
                <p className="auth__footer-text">
                  Chưa có tài khoản?{" "}
                  <Link to="/register" className="auth__link">
                    Đăng ký ngay
                  </Link>
                </p>
              </div>
            </form>
          </div>

          <div className="auth__section auth__section--image" data-page="login">
            <Link to="/" className="auth__brand-logo">
              <span className="auth__brand-star">★</span>
              <span className="auth__brand-text">LUMIÈRE</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
