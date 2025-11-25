import { useEffect, useState } from "react";
import { api } from "../shared/api";
import ProductCard from "../components/ProductCard";
import Breadcrumb from "../components/Breadcrumb";
import { useWishlist } from "../hooks/useWishlist";

export default function WishlistPage() {
    const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { loadWishlist } = useWishlist();

    const loadWishlistProducts = async () => {
        setLoading(true);
        try {
            const response = await api.get("/wishlist");
            setWishlistProducts(response.data.map((item: any) => item.product));
        } catch (error) {
            console.error("Error loading wishlist:", error);
            setWishlistProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadWishlistProducts();
    }, []);

    // Reload when wishlist changes
    useEffect(() => {
        const handleWishlistChange = () => {
            loadWishlistProducts();
        };

        // Listen for wishlist changes (we'll implement this later)
        window.addEventListener("wishlistChanged", handleWishlistChange);

        return () => {
            window.removeEventListener("wishlistChanged", handleWishlistChange);
        };
    }, []);

    return (
        <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-40 py-6 md:py-10">
            <Breadcrumb items={[{ label: "Sản phẩm yêu thích" }]} />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-6 md:mb-8">
                Sản phẩm yêu thích
            </h1>

            {loading ? (
                <div className="text-center py-12 md:py-20 text-sm md:text-base">
                    Đang tải...
                </div>
            ) : wishlistProducts.length === 0 ? (
                <div className="text-center py-12 md:py-20 px-4">
                    <div className="text-gray-500 text-base md:text-lg mb-4">
                        Bạn chưa có sản phẩm yêu thích nào
                    </div>
                    <a
                        href="/products"
                        className="bg-black text-white px-6 md:px-8 py-2 md:py-3 rounded-lg font-medium hover:opacity-90 transition inline-block text-sm md:text-base"
                    >
                        Khám phá sản phẩm
                    </a>
                </div>
            ) : (
                <div>
                    <div className="mb-4 md:mb-6 text-gray-600 text-sm md:text-base">
                        {wishlistProducts.length} sản phẩm
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {wishlistProducts.map((product) => (
                            <div key={product.id} className="w-full">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
