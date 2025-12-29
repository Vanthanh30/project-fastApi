import React from "react";

const FooterComponent = () => {
    return (
        <div className="footer-area footer-padding">
            <div className="container">
                <div className="row d-flex justify-content-between">
                    {/* Logo + Intro */}
                    <div className="col-xl-3 col-lg-3 col-md-5 col-sm-6">
                        <div className="single-footer-caption mb-50">
                            <div className="single-footer-caption mb-30">
                                {/* Logo */}
                                <div className="footer-logo">
                                    <a href="/">
                                        <img src="/assets/img/logo/logo2_footer.png" alt="logo" />
                                    </a>
                                </div>
                                <div className="footer-tittle">
                                    <div className="footer-pera">
                                        <p>
                                            Vẻ đẹp thực sự không nằm ở lớp son phấn dày cộm hay khuôn mẫu hoàn hảo mà 
                                            xã hội đặt ra, mà nó tỏa ra từ sự tự tin và chấp nhận chính mình.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-xl-3 col-lg-3 col-md-3 col-sm-5">
                        <div className="single-footer-caption mb-50">
                            <div className="footer-tittle">
                                <h4>Thông tin</h4>
                                <ul>
                                    <li><a href="/about">Về chúng tôi</a></li>
                                    <li><a href="#">Những ưu đãi hot</a></li>
                                    <li><a href="#">Nhận phiếu giảm giá</a></li>
                                    <li><a href="/contact">Tâm sự với chúng tôi</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* New Products */}
                    <div className="col-xl-3 col-lg-3 col-md-4 col-sm-7">
                        <div className="single-footer-caption mb-50">
                            <div className="footer-tittle">
                                <h4>Mỹ phẩm mới</h4>
                                <ul>
                                    <li><a href="#">Trang điểm</a></li>
                                    <li><a href="#">Chăm sóc da</a></li>
                                    <li><a href="#">Chăm sóc tóc</a></li>
                                    <li><a href="#">Chăm sóc cơ thể</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Support */}
                    <div className="col-xl-3 col-lg-3 col-md-5 col-sm-7">
                        <div className="single-footer-caption mb-50">
                            <div className="footer-tittle">
                                <h4>Hãy ủng hộ chúng tôi</h4>
                                <ul>
                                    <li><a href="#">Những câu hỏi</a></li>
                                    <li><a href="#">Quy định và điều khoản</a></li>
                                    <li><a href="#">Chính sách bảo mật</a></li>
                                    <li><a href="#">Báo cáo vấn đề</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="row">
                    <div className="col-xl-7 col-lg-7 col-md-7">
                    </div>

                    <div className="col-xl-5 col-lg-5 col-md-5">
                        <div className="footer-copy-right f-right">
                            <div className="footer-social">
                                <a href="#"><i className="fab fa-twitter fa-lg" style={{ fontSize: '32px' }}></i></a>
                                <a href="#"><i className="fab fa-facebook-f fa-2x"style={{ fontSize: '32px' }}></i></a>
                                <a href="#"><i className="fab fa-instagram fa-2x"style={{ fontSize: '32px' }}></i></a>
                                <a href="#"><i className="fas fa-globe fa-2x"style={{ fontSize: '32px' }}></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FooterComponent;
