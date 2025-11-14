import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../shared/api";
import Breadcrumb from "../components/Breadcrumb";
import { useWishlist } from "../hooks/useWishlist";
import { Heart, ShoppingCart } from "lucide-react";

export default function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [showImageModal, setShowImageModal] = useState(false);

    // Function để xử lý URL ảnh
    const getImageUrl = (imageUrl: string): string => {
        if (!imageUrl)
            return "https://via.placeholder.com/400x400?text=No+Image";

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
    const getAllImages = () => {
        if (product?.images) {
            if (Array.isArray(product.images) && product.images.length > 0) {
                return product.images;
            } else if (typeof product.images === "string") {
                try {
                    // Thử parse JSON
                    const parsedImages = JSON.parse(product.images);
                    if (
                        Array.isArray(parsedImages) &&
                        parsedImages.length > 0
                    ) {
                        return parsedImages;
                    }
                } catch {
                    // Nếu không parse được, coi như là URL đơn
                    return [product.images];
                }
            }
        }
        return [];
    };

    useEffect(() => {
        if (!id) return;
        api.get(`/products/${id}`)
            .then((res) => setProduct(res.data))
            .catch(() => navigate("/products"))
            .finally(() => setLoading(false));
    }, [id, navigate]);

    const handleAddToCart = async () => {
        try {
            await api.post("/cart", { productId: product.id, quantity: 1 });
            alert("Đã thêm vào giỏ hàng");
        } catch (error) {
            alert("Vui lòng đăng nhập để thêm vào giỏ hàng");
        }
    };

    const handleWishlistClick = async () => {
        const result = await toggleWishlist(product.id);
        if (result.message) {
            alert(result.message);
        }
    };

    if (loading) return <div className="text-center py-20">Đang tải...</div>;
    if (!product)
        return <div className="text-center py-20">Không tìm thấy sản phẩm</div>;

    const allImages = getAllImages();
    const currentImage =
        allImages.length > 0 ? allImages[selectedImageIndex] : null;
    const imageUrl = currentImage
        ? getImageUrl(currentImage)
        : "https://via.placeholder.com/400x400?text=No+Image";

    return (
        <div className="container mx-auto px-40 py-10">
            <Breadcrumb
                items={[
                    { label: "Sản phẩm", path: "/products" },
                    { label: product?.name || "Chi tiết sản phẩm" },
                ]}
            />
            <div className="grid grid-cols-2 gap-12">
                <div className="flex flex-col gap-4">
                    {/* Ảnh chính */}
                    <div className="bg-[#f6f6f6] rounded-lg p-8 flex items-center justify-center cursor-pointer hover:opacity-90 transition">
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="max-w-full max-h-96 object-contain"
                            onClick={() => setShowImageModal(true)}
                            onError={(e) => {
                                e.currentTarget.src =
                                    "https://via.placeholder.com/400x400?text=No+Image";
                            }}
                        />
                    </div>

                    {/* Danh sách ảnh phụ */}
                    {allImages.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto">
                            {allImages.map((image: string, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${
                                        selectedImageIndex === index
                                            ? "border-black"
                                            : "border-gray-300"
                                    }`}
                                >
                                    <img
                                        src={getImageUrl(image)}
                                        alt={`${product.name} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                "https://via.placeholder.com/80x80?text=Error";
                                        }}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-6">
                    <h1 className="text-4xl font-semibold">{product.name}</h1>
                    <p className="text-3xl font-semibold text-black">
                        {Number(product.price).toLocaleString("vi-VN")} ₫
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        {product.description}
                    </p>

                    <div className="flex gap-4">
                        <button
                            onClick={handleAddToCart}
                            className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition flex items-center gap-2"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            Thêm vào giỏ
                        </button>
                        <button
                            onClick={handleWishlistClick}
                            className={`border px-8 py-3 rounded-lg font-medium transition flex items-center gap-2 ${
                                isInWishlist(product.id)
                                    ? "border-red-500 bg-red-500 text-white hover:bg-red-600"
                                    : "border-black hover:bg-black hover:text-white"
                            }`}
                        >
                            <Heart
                                className={`w-5 h-5 ${
                                    isInWishlist(product.id) ? "fill-white" : ""
                                }`}
                            />
                            {isInWishlist(product.id)
                                ? "Đã yêu thích"
                                : "Yêu thích"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal zoom ảnh */}
            {showImageModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                    onClick={() => setShowImageModal(false)}
                >
                    <div className="relative max-w-4xl max-h-4xl p-4">
                        <button
                            onClick={() => setShowImageModal(false)}
                            className="absolute -top-10 right-0 text-white text-2xl hover:opacity-70"
                        >
                            ✕
                        </button>
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="max-w-full max-h-full object-contain"
                            onClick={(e) => e.stopPropagation()}
                            onError={(e) => {
                                e.currentTarget.src =
                                    "https://via.placeholder.com/800x600?text=No+Image";
                            }}
                        />

                        {/* Navigation trong modal */}
                        {allImages.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                                {allImages.map(
                                    (_image: string, index: number) => (
                                        <button
                                            key={index}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedImageIndex(index);
                                            }}
                                            className={`w-3 h-3 rounded-full ${
                                                selectedImageIndex === index
                                                    ? "bg-white"
                                                    : "bg-white/50"
                                            }`}
                                        />
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
