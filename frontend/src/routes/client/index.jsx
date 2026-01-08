import Home from "../../pages/client/home";
import Login from "../../pages/client/auth/login";
import Register from "../../pages/client/auth/register";
import Forgot from "../../pages/client/auth/forgotpassword";
import Profile from "../../pages/client/auth/profile";
import ProductDetail from "../../pages/client/product_detail";
import Cart from "../../pages/client/cart";
import Order from "../../pages/client/order";
import Payment from "../../pages/client/payment";
import Contact from "../../pages/client/contact";
import Collection from "../../pages/client/collection";
import About from "../../pages/client/about";
import Blog from "../../pages/client/blog";
import Help from "../../pages/client/help";
import Story from "../../pages/client/story";
export const clientRoute = [
  { path: "/", element: <Home /> },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgotpassword",
    element: <Forgot />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/product/:id",
    element: <ProductDetail />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/order",
    element: <Order />,
  },
  {
    path: "/payment",
    element: <Payment />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/collection",
    element: <Collection />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/blog",
    element: <Blog />,
  },
  {
    path: "/help",
    element: <Help />,
  },
  {
    path: "/story",
    element: <Story />,
  }
];
