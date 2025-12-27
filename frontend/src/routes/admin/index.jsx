import Login from "../../pages/admin/login";
import CategoryPage from "../../pages/admin/category/index";
import CategoryCreate from "../../pages/admin/category/create";
import CategoryEdit from "../../pages/admin/category/edit";
import AccountPage from "../../pages/admin/account/index";
import AccountCreate from "../../pages/admin/account/create";
import AccountEdit from "../../pages/admin/account/edit";
import ProductPage from "../../pages/admin/product";
import CreateProduct from "../../pages/admin/product/create";
import OrderPage from "../../pages/admin/order";
import EditProduct from "../../pages/admin/product/edit";
import Dashboard from "../../pages/admin/dasboard";
export const adminRoute = [
  {
    path: "/admin/login",
    element: <Login />,
  },
  {
    path: "/admin/category",
    element: <CategoryPage />,
  },
  {
    path: "/admin/category/create",
    element: <CategoryCreate />,
  },
  {
    path: "/admin/category/edit/:id",
    element: <CategoryEdit />,
  },
  {
    path: "/admin/account",
    element: <AccountPage />,
  },
  {
    path: "/admin/account/create",
    element: <AccountCreate />,
  },
  {
    path: "/admin/account/edit/:id",
    element: <AccountEdit />,
  },
  {
    path: "/admin/product",
    element: <ProductPage />,
  },
  {
    path: "/admin/product/create",
    element: <CreateProduct />,
  },
  {
    path: "/admin/product/edit/:id",
    element: <EditProduct />,
  },
  {
    path: "/admin/order",
    element: <OrderPage />,
  },
  {
    path: "/admin/dashboard",
    element: <Dashboard />,
  },
];
