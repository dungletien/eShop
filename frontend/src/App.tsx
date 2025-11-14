import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminLayout from "./components/admin/AdminLayout";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
import WishlistPage from "./pages/WishlistPage";

export default function App() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route
                path="/*"
                element={
                    <div className="min-h-screen flex flex-col bg-neutral-50">
                        <Header />
                        <main className="flex-1">
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route
                                    path="/products"
                                    element={<ProductsPage />}
                                />
                                <Route
                                    path="/products/:id"
                                    element={<ProductDetailPage />}
                                />
                                <Route
                                    path="/wishlist"
                                    element={<WishlistPage />}
                                />
                                <Route path="/cart" element={<CartPage />} />
                                <Route
                                    path="/checkout"
                                    element={<CheckoutPage />}
                                />
                                <Route
                                    path="/orders"
                                    element={<OrdersPage />}
                                />
                                <Route path="/login" element={<LoginPage />} />
                                <Route
                                    path="/register"
                                    element={<RegisterPage />}
                                />
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                }
            />

            {/* Admin Routes */}
            <Route path="/admin/*" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="categories" element={<AdminCategoriesPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="users" element={<AdminUsersPage />} />
            </Route>
        </Routes>
    );
}
