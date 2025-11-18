import { Link, useLocation } from "react-router-dom";
import { Search, Heart, ShoppingCart, User, ChevronDown, LogOut, Package } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { api } from "../shared/api";

export default function Header() {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [user, setUser] = useState<any>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    // Lấy thông tin user thực từ API
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Lấy thông tin user từ API
            api.get('/users/me')
                .then(response => {
                    setUser({
                        name: response.data.fullName,
                        email: response.data.email
                    });
                })
                .catch(error => {
                    console.error('Error fetching user info:', error);
                    // Nếu token không hợp lệ, xóa token
                    localStorage.removeItem('token');
                    setUser(null);
                });
        }
    }, []);

    // Đóng menu khi click bên ngoài
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setShowUserMenu(false);
        window.location.href = '/login';
    };

    return (
        <header className="bg-white border-b border-[#b5b5b5]">
            <div className="container mx-auto px-40 py-4 flex items-center justify-between">
                <Link to="/" className="text-2xl font-semibold text-black">
                    cyber
                </Link>

                <div className="flex items-center gap-2 bg-neutral-100 rounded-lg px-4 py-4 h-14 w-[372px]">
                    <Search className="w-6 h-6 text-[#656565]" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="bg-transparent flex-1 outline-none text-sm font-medium text-[#656565] placeholder:text-[#656565] placeholder:opacity-50"
                    />
                </div>

                <nav className="flex items-center gap-[52px] text-base font-medium text-black">
                    <Link 
                        to="/" 
                        className={location.pathname === "/" ? "text-black" : "opacity-30 hover:opacity-70"}
                    >
                        Home
                    </Link>
                    <Link
                        to="/about"
                        className={location.pathname === "/about" ? "text-black" : "opacity-30 hover:opacity-70"}
                    >
                        About
                    </Link>
                    <Link
                        to="/contact"
                        className={location.pathname === "/contact" ? "text-black" : "opacity-30 hover:opacity-70"}
                    >
                        Contact Us
                    </Link>
                    <Link
                        to="/blog"
                        className={location.pathname === "/blog" ? "text-black" : "opacity-30 hover:opacity-70"}
                    >
                        Blog
                    </Link>
                </nav>

                <div className="flex items-center gap-6">
                    <Link to="/wishlist">
                        <Heart className="w-8 h-8 cursor-pointer hover:opacity-70" />
                    </Link>
                    <Link to="/cart">
                        <ShoppingCart className="w-8 h-8 cursor-pointer hover:opacity-70" />
                    </Link>
                    
                    {/* User Menu */}
                    <div className="relative" ref={userMenuRef}>
                        {user ? (
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 cursor-pointer hover:opacity-70"
                            >
                                <User className="w-8 h-8" />
                                
                            </button>
                        ) : (
                            <Link to="/login">
                                <User className="w-8 h-8 cursor-pointer hover:opacity-70" />
                            </Link>
                        )}

                        {/* Dropdown Menu */}
                        {showUserMenu && user && (
                            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                <div className="p-4 border-b border-gray-200">
                                    <p className="font-medium text-gray-900">{user.name}</p>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                </div>
                                <div className="py-2">
                                    <Link
                                        to="/orders"
                                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                                        onClick={() => setShowUserMenu(false)}
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
            </div>
        </header>
    );
}

