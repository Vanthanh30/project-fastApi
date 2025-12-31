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
import ProtectedRoute from "../../components/ProtectedRoute";

export const adminRoute = [
  // Public route - Login (không cần bảo vệ)
  {
    path: "/admin/login",
    element: <Login />,
  },

  // Protected routes - Tất cả routes khác cần đăng nhập
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/category",
    element: (
      <ProtectedRoute>
        <CategoryPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/category/create",
    element: (
      <ProtectedRoute>
        <CategoryCreate />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/category/edit/:id",
    element: (
      <ProtectedRoute>
        <CategoryEdit />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/account",
    element: (
      <ProtectedRoute>
        <AccountPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/account/create",
    element: (
      <ProtectedRoute>
        <AccountCreate />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/account/edit/:id",
    element: (
      <ProtectedRoute>
        <AccountEdit />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/product",
    element: (
      <ProtectedRoute>
        <ProductPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/product/create",
    element: (
      <ProtectedRoute>
        <CreateProduct />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/product/edit/:id",
    element: (
      <ProtectedRoute>
        <EditProduct />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/order",
    element: (
      <ProtectedRoute>
        <OrderPage />
      </ProtectedRoute>
    ),
  },
];