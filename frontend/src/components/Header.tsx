import { Link } from "react-router-dom";
import { Search, Heart, ShoppingCart, User } from "lucide-react";

export default function Header() {
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
                    <Link to="/" className="hover:opacity-70">
                        Home
                    </Link>
                    <Link
                        to="/products"
                        className="opacity-30 hover:opacity-70"
                    >
                        About
                    </Link>
                    <Link
                        to="/products"
                        className="opacity-30 hover:opacity-70"
                    >
                        Contact Us
                    </Link>
                    <Link
                        to="/products"
                        className="opacity-30 hover:opacity-70"
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
                    <Link to="/login">
                        <User className="w-8 h-8 cursor-pointer hover:opacity-70" />
                    </Link>
                </div>
            </div>
        </header>
    );
}
