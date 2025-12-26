import Home from "../../pages/client/home";
import Login from "../../pages/client/auth/login";
import Register from "../../pages/client/auth/register";
import Profile from "../../pages/client/auth/profile";
import ProductDetail from "../../pages/client/product_detail";
import Cart from "../../pages/client/cart";
import Contact from "../../pages/client/contact";
import Collection from "../../pages/client/collection";
import About from "../../pages/client/about";
import Blog from "../../pages/client/blog";
import Help from "../../pages/client/help";

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
];
