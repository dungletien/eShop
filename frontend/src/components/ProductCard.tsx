import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { api } from "../shared/api";
import { useWishlist } from "../hooks/useWishlist";

type Product = {
    id: number;
    name: string;
    price: string;
    images?: any;
};

type ProductCardProps = {
    product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
    const { toggleWishlist, isInWishlist } = useWishlist();

    // Function để xử lý URL ảnh
    const getImageUrl = (imageUrl: string): string => {
        if (!imageUrl)
            return "https://via.placeholder.com/200x200?text=No+Image";

        // Nếu đã là URL đầy đủ (http/https)
        if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
            return imageUrl;
        }

        // Nếu là đường dẫn tương đối từ uploads
        if (imageUrl.startsWith("/uploads/")) {
            return `http://localhost:4000${imageUrl}`;
        }

        // Nếu chỉ là filename hoặc đường dẫn không có /uploads/
        if (!imageUrl.startsWith("/")) {
            return `http://localhost:4000/uploads/products/${imageUrl}`;
        }

        // Fallback
        return `http://localhost:4000${imageUrl}`;
    };

    // Xử lý images từ nhiều định dạng khác nhau
    const getFirstImage = () => {
        if (product.images) {
            if (Array.isArray(product.images) && product.images.length > 0) {
                return product.images[0];
            } else if (typeof product.images === "string") {
                try {
                    // Thử parse JSON
                    const parsedImages = JSON.parse(product.images);
                    if (
                        Array.isArray(parsedImages) &&
                        parsedImages.length > 0
                    ) {
                        return parsedImages[0];
                    }
                } catch {
                    // Nếu không parse được, coi như là URL đơn
                    return product.images;
                }
            }
        }
        return null;
    };

    const firstImage = getFirstImage();
    const imageUrl = firstImage
        ? getImageUrl(firstImage)
        : "https://via.placeholder.com/200x200?text=No+Image";

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            await api.post("/cart", { productId: product.id, quantity: 1 });
            alert("Đã thêm vào giỏ hàng");
        } catch (error) {
            alert("Vui lòng đăng nhập để thêm vào giỏ hàng");
        }
    };

    const handleWishlistClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const result = await toggleWishlist(product.id);
        if (result.message) {
            alert(result.message);
        }
    };

    return (
        <div className="bg-[#f6f6f6] rounded-lg min-w-[200px] flex flex-col items-center relative">
            {/* Icon trái tim ở góc bên phải của card */}
            <div className="absolute top-2 right-2 z-10">
                <Heart
                    className={`w-8 h-8 cursor-pointer hover:opacity-70 transition-colors ${
                        isInWishlist(product.id)
                            ? "text-red-500 fill-red-500"
                            : "text-[#919191] hover:text-red-500"
                    }`}
                    onClick={handleWishlistClick}
                />
            </div>{" "}
            <div className="flex flex-col gap-4 items-center px-4 py-6 w-full">
                <div className="w-40 h-40 relative">
                    <Link to={`/products/${product.id}`}>
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover rounded cursor-pointer"
                            onError={(e) => {
                                e.currentTarget.src =
                                    "https://via.placeholder.com/200x200?text=No+Image";
                            }}
                        />
                    </Link>
                </div>

                <div className="flex flex-col gap-6 items-center w-full">
                    <div className="flex flex-col gap-4 items-start w-full">
                        <Link
                            to={`/products/${product.id}`}
                            className="text-base font-medium text-black text-center w-full hover:underline"
                        >
                            {product.name}
                        </Link>
                        <p className="text-2xl font-semibold text-black tracking-wide">
                            {Number(product.price).toLocaleString("vi-VN")} ₫
                        </p>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className="bg-black text-white px-16 py-3 rounded-lg text-sm font-medium hover:opacity-90 transition whitespace-nowrap"
                    >
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
}
