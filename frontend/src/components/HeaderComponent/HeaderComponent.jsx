import { React, useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { CartContext } from "../../context/CartContext";

const HeaderComponent = () => {
    const [categories, setCategories] = useState([]);
    const [keyword, setKeyword] = useState("");
    const { cartCount } = useContext(CartContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/categories');
                setCategories(res.data.data.categories);
            }
            catch (e) {
                console.log('Error: ', e);
            }
        }
        fetchCategories();

        const fetchCartCount = async () => {
            try {
                let token = localStorage.getItem("token");
                if (!token) {
                    setCartCount(0);
                    return
                }

                const res = await axios.get('http://localhost:3000/api/cart/total-qty', {
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                });
                console.log("totalQty res: ", res)
                setCartCount(res.data.data.totalQuantity);
                
            }
            catch (e) {
                console.log('Error: ', e);
            }
        };
        fetchCartCount();
    }, []);

    function handleLogout() {
        localStorage.removeItem('token');
        window.location.reload();
    }

    function renderCategories() {
        return categories.map(category => (
            <li><Link to={`/prodlist?cate_id=${category._id}`}>{category.cate_name}</Link></li>
        ));
    }

    function checkLogin() {
        const token = localStorage.getItem('token');
        if (token) {
            return (
                <a href="#" className="btn header-btn" onClick={handleLogout}>
                    Đăng xuất
                </a>
            )
        }
        return (
            <Link to="/login" className="btn header-btn">
                Đăng nhập
            </Link>
        )
    }

    function handleCartClick(e) {
        const token = localStorage.getItem('token')
        if (!token) {
            e.preventDefault();
            alert('Vui lòng đăng nhập để xem giỏ hàng');
            navigate('/login');
        }
    }

    function handleIfDisplayHistory() {
        const token = localStorage.getItem('token')
        if (token) {
            return (
                <li><a href="/history">Lịch sử mua hàng</a></li>
            );
        }
    }

    function handleSearchClick(e) {
        e.preventDefault();

        navigate(`prodlist?keyword=${keyword}`)
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            handleSearchClick(e);
        }
    }


    return (
        <div className="header-area">
            <div className="main-header">
                {/* Header Bottom */}
                <div className="header-bottom header-sticky">
                    <div className="container-fluid">
                        <div className="row align-items-center">
                            {/* Logo */}
                            <div className="col-xl-1 col-lg-1 col-md-1 col-sm-3">
                                <div className="logo">
                                    <a href="/"> Cosmetics<span>.</span></a>
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="col-xl-6 col-lg-8 col-md-7 col-sm-5">
                                <div className="main-menu f-right d-none d-lg-block">
                                    <nav>
                                        <ul id="navigation">
                                            <li><a href="/">Trang chủ</a></li>
                                            <li className="hot">
                                                <Link to="/prodlist">Danh mục</Link>
                                                <ul className="submenu">
                                                    {renderCategories()}
                                                </ul>
                                            </li>

                                            {handleIfDisplayHistory()}

                                            <li><a href="#">Liên hệ</a></li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>

                            {/* Search, Cart, Buttons */}
                            <div className="col-xl-5 col-lg-3 col-md-3 col-sm-3 fix-card">
                                <ul className="header-right f-right d-none d-lg-block d-flex justify-content-between">
                                    <li className="d-none d-xl-block">
                                        <div className="form-box f-right">
                                            <input
                                                type="text"
                                                name="keyword"
                                                placeholder="Tìm kiếm..."
                                                value={keyword}
                                                onChange={(e) => setKeyword(e.target.value)}
                                                onKeyDown={handleKeyDown} />

                                            <div className="search-icon">
                                                <Link to="/prodlist" onClick={handleSearchClick}>
                                                    <i className="fas fa-search special-tag"></i>
                                                </Link>
                                            </div>
                                        </div>
                                    </li>


                                    <li>
                                        <div className="shopping-card"
                                            data-content={cartCount}
                                        >
                                            <Link to="/cart" onClick={handleCartClick}>
                                                <i className="fas fa-shopping-cart"></i>
                                            </Link>
                                        </div>
                                    </li>

                                    <li className="d-none d-lg-block">
                                        {checkLogin()}

                                    </li>
                                </ul>
                            </div>

                            {/* Mobile Menu */}
                            <div className="col-12">
                                <div className="mobile_menu d-block d-lg-none"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeaderComponent;
