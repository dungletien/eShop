import { Link, useLocation } from "react-router-dom";
import {
    Search,
    Heart,
    ShoppingCart,
    User,
    ChevronDown,
    LogOut,
    Package,
    Menu,
    X,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { api } from "../shared/api";

export default function Header() {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [user, setUser] = useState<any>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    // Lấy thông tin user thực từ API
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            // Lấy thông tin user từ API
            api.get("/users/me")
                .then((response) => {
                    setUser({
                        name: response.data.fullName,
                        email: response.data.email,
                    });
                })
                .catch((error) => {
                    console.error("Error fetching user info:", error);
                    // Nếu token không hợp lệ, xóa token
                    localStorage.removeItem("token");
                    setUser(null);
                });
        }
    }, []);

    // Đóng menu khi click bên ngoài
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target as Node)
            ) {
                setShowUserMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        setShowUserMenu(false);
        window.location.href = "/login";
    };

    return (
        <header className="bg-white border-b border-[#b5b5b5]">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-20 xl:px-40 py-4">
                {/* Main Header */}
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-semibold text-black">
                        cyber
                    </Link>

                    {/* Desktop Search Bar */}
                    <div className="hidden md:flex items-center gap-2 bg-neutral-100 rounded-lg px-4 py-3 h-12 w-full max-w-sm lg:max-w-md xl:max-w-lg mx-8">
                        <Search className="w-5 h-5 text-[#656565]" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="bg-transparent flex-1 outline-none text-sm font-medium text-[#656565] placeholder:text-[#656565] placeholder:opacity-50"
                        />
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8 xl:gap-[52px] text-base font-medium text-black">
                        <Link
                            to="/"
                            className={`transition-colors ${
                                location.pathname === "/"
                                    ? "text-black"
                                    : "opacity-30 hover:opacity-70"
                            }`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/about"
                            className={`transition-colors ${
                                location.pathname === "/about"
                                    ? "text-black"
                                    : "opacity-30 hover:opacity-70"
                            }`}
                        >
                            About
                        </Link>
                        <Link
                            to="/contact"
                            className={`transition-colors ${
                                location.pathname === "/contact"
                                    ? "text-black"
                                    : "opacity-30 hover:opacity-70"
                            }`}
                        >
                            Contact Us
                        </Link>
                        <Link
                            to="/blog"
                            className={`transition-colors ${
                                location.pathname === "/blog"
                                    ? "text-black"
                                    : "opacity-30 hover:opacity-70"
                            }`}
                        >
                            Blog
                        </Link>
                    </nav>

                    {/* Desktop Icons */}
                    <div className="hidden md:flex items-center gap-4 lg:gap-6">
                        {/* Mobile Search Toggle */}
                        <button
                            className="md:hidden"
                            onClick={() =>
                                setShowMobileSearch(!showMobileSearch)
                            }
                        >
                            <Search className="w-6 h-6 cursor-pointer hover:opacity-70" />
                        </button>

                        <Link to="/wishlist">
                            <Heart className="w-6 h-6 lg:w-8 lg:h-8 cursor-pointer hover:opacity-70 transition-opacity" />
                        </Link>
                        <Link to="/cart">
                            <ShoppingCart className="w-6 h-6 lg:w-8 lg:h-8 cursor-pointer hover:opacity-70 transition-opacity" />
                        </Link>

                        {/* User Menu */}
                        <div className="relative" ref={userMenuRef}>
                            {user ? (
                                <button
                                    onClick={() =>
                                        setShowUserMenu(!showUserMenu)
                                    }
                                    className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
                                >
                                    <User className="w-6 h-6 lg:w-8 lg:h-8" />
                                </button>
                            ) : (
                                <Link to="/login">
                                    <User className="w-6 h-6 lg:w-8 lg:h-8 cursor-pointer hover:opacity-70 transition-opacity" />
                                </Link>
                            )}

                            {/* Desktop User Dropdown Menu */}
                            {showUserMenu && user && (
                                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                    <div className="p-4 border-b border-gray-200">
                                        <p className="font-medium text-gray-900">
                                            {user.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {user.email}
                                        </p>
                                    </div>
                                    <div className="py-2">
                                        <Link
                                            to="/orders"
                                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                                            onClick={() =>
                                                setShowUserMenu(false)
                                            }
                                        >
                                            <Package className="w-5 h-5" />
                                            <span>Đơn hàng của tôi</span>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            <span>Đăng xuất</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Icons */}
                    <div className="flex md:hidden items-center gap-4">
                        <button
                            onClick={() =>
                                setShowMobileSearch(!showMobileSearch)
                            }
                        >
                            <Search className="w-6 h-6 cursor-pointer hover:opacity-70" />
                        </button>
                        <Link to="/wishlist">
                            <Heart className="w-6 h-6 cursor-pointer hover:opacity-70" />
                        </Link>
                        <Link to="/cart">
                            <ShoppingCart className="w-6 h-6 cursor-pointer hover:opacity-70" />
                        </Link>
                        {user ? (
                            <User
                                className="w-6 h-6 cursor-pointer hover:opacity-70"
                                onClick={() => setShowUserMenu(!showUserMenu)}
                            />
                        ) : (
                            <Link to="/login">
                                <User className="w-6 h-6 cursor-pointer hover:opacity-70" />
                            </Link>
                        )}
                        <button
                            className="lg:hidden"
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                        >
                            {showMobileMenu ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                {showMobileSearch && (
                    <div className="md:hidden mt-4 flex items-center gap-2 bg-neutral-100 rounded-lg px-4 py-3">
                        <Search className="w-5 h-5 text-[#656565]" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="bg-transparent flex-1 outline-none text-sm font-medium text-[#656565] placeholder:text-[#656565] placeholder:opacity-50"
                        />
                    </div>
                )}

                {/* Mobile Menu */}
                {showMobileMenu && (
                    <div className="lg:hidden mt-4 py-4 border-t border-gray-200">
                        <nav className="flex flex-col gap-4">
                            <Link
                                to="/"
                                className={`text-base font-medium transition-colors ${
                                    location.pathname === "/"
                                        ? "text-black"
                                        : "text-gray-600 hover:text-black"
                                }`}
                                onClick={() => setShowMobileMenu(false)}
                            >
                                Home
                            </Link>
                            <Link
                                to="/about"
                                className={`text-base font-medium transition-colors ${
                                    location.pathname === "/about"
                                        ? "text-black"
                                        : "text-gray-600 hover:text-black"
                                }`}
                                onClick={() => setShowMobileMenu(false)}
                            >
                                About
                            </Link>
                            <Link
                                to="/contact"
                                className={`text-base font-medium transition-colors ${
                                    location.pathname === "/contact"
                                        ? "text-black"
                                        : "text-gray-600 hover:text-black"
                                }`}
                                onClick={() => setShowMobileMenu(false)}
                            >
                                Contact Us
                            </Link>
                            <Link
                                to="/blog"
                                className={`text-base font-medium transition-colors ${
                                    location.pathname === "/blog"
                                        ? "text-black"
                                        : "text-gray-600 hover:text-black"
                                }`}
                                onClick={() => setShowMobileMenu(false)}
                            >
                                Blog
                            </Link>

                            {/* Mobile User Menu Items */}
                            {user && (
                                <>
                                    <div className="border-t border-gray-200 pt-4 mt-4">
                                        <div className="mb-3">
                                            <p className="font-medium text-gray-900">
                                                {user.name}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {user.email}
                                            </p>
                                        </div>
                                        <Link
                                            to="/orders"
                                            className="flex items-center gap-3 py-2 text-gray-700 hover:text-black transition"
                                            onClick={() => {
                                                setShowMobileMenu(false);
                                                setShowUserMenu(false);
                                            }}
                                        >
                                            <Package className="w-5 h-5" />
                                            <span>Đơn hàng của tôi</span>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setShowMobileMenu(false);
                                            }}
                                            className="flex items-center gap-3 py-2 text-gray-700 hover:text-black transition"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            <span>Đăng xuất</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
