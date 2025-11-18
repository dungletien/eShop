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
        <div className="container mx-auto px-40 py-10">
            <Breadcrumb items={[{ label: "Sản phẩm yêu thích" }]} />
            <h1 className="text-4xl font-semibold mb-8">Sản phẩm yêu thích</h1>

            {loading ? (
                <div className="text-center py-20">Đang tải...</div>
            ) : wishlistProducts.length === 0 ? (
                <div className="text-center py-20">
                    <div className="text-gray-500 text-lg mb-4">
                        Bạn chưa có sản phẩm yêu thích nào
                    </div>
                    <a
                        href="/products"
                        className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition inline-block"
                    >
                        Khám phá sản phẩm
                    </a>
                </div>
            ) : (
                <div>
                    <div className="mb-6 text-gray-600">
                        {wishlistProducts.length} sản phẩm
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {wishlistProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
