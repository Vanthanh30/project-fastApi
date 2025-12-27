import Login from "../../pages/admin/login";
import CategoryPage from "../../pages/admin/category/index";
import CategoryCreate from "../../pages/admin/category/create";
import CategoryEdit from "../../pages/admin/category/edit";
import AccountPage from "../../pages/admin/account/index";
import AccountCreate from "../../pages/admin/account/create";
import AccountEdit from "../../pages/admin/account/edit";
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
        element: <AccountPage />
    },
    {
        path: "/admin/account/create",
        element: <AccountCreate />
    },
    {
        path: "/admin/account/edit/:id",
        element: <AccountEdit />
    }
];