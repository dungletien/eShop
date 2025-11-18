import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../shared/api";
import Breadcrumb from "../components/Breadcrumb";
import { useWishlist } from "../hooks/useWishlist";
import { Heart, ShoppingCart, Star, User } from "lucide-react";

export default function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedColor, setSelectedColor] = useState<string>("");
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
    const [showReviewForm, setShowReviewForm] = useState(false);

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

    // Xử lý colors từ nhiều định dạng khác nhau
    const getAllColors = (): string[] => {
        if (product?.colors) {
            if (Array.isArray(product.colors) && product.colors.length > 0) {
                return product.colors;
            } else if (typeof product.colors === "string") {
                try {
                    // Thử parse JSON
                    const parsedColors = JSON.parse(product.colors);
                    if (
                        Array.isArray(parsedColors) &&
                        parsedColors.length > 0
                    ) {
                        return parsedColors;
                    }
                } catch {
                    // Nếu không parse được, coi như là màu đơn
                    return [product.colors];
                }
            }
        }
        return [];
    };

    // Lấy tên màu từ hex code
    const getColorName = (colorHex: string): string => {
        const colorMap: { [key: string]: string } = {
            "#000000": "Đen",
            "#FFFFFF": "Trắng",
            "#FF0000": "Đỏ",
            "#0000FF": "Xanh dương",
            "#00FF00": "Xanh lá",
            "#FFFF00": "Vàng",
            "#FFA500": "Cam",
            "#800080": "Tím",
            "#FFC0CB": "Hồng",
            "#808080": "Xám",
            "#A52A2A": "Nâu",
            "#000080": "Xanh navy",
        };
        return colorMap[colorHex.toUpperCase()] || colorHex;
    };

    // Render rating stars
    const renderStars = (rating: number, size: string = "w-4 h-4") => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`${size} ${
                            star <= rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                        }`}
                    />
                ))}
            </div>
        );
    };

    // Calculate average rating
    const averageRating =
        reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) /
              reviews.length
            : 0;

    // Handle submit review
    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newReview.comment.trim()) {
            alert("Vui lòng nhập nội dung đánh giá");
            return;
        }

        // Giả lập thêm review mới (trong thực tế sẽ gọi API)
        const review = {
            id: reviews.length + 1,
            rating: newReview.rating,
            comment: newReview.comment,
            userName: "Khách hàng",
            createdAt: new Date().toISOString(),
        };

        setReviews([review, ...reviews]);
        setNewReview({ rating: 5, comment: "" });
        setShowReviewForm(false);
        alert("Đánh giá của bạn đã được gửi!");
    };

    useEffect(() => {
        if (!id) return;
        loadProductData();
    }, [id, navigate]);

    const loadProductData = async () => {
        try {
            const productRes = await api.get(`/products/${id}`);
            const productData = productRes.data;
            setProduct(productData);

            // Set màu đầu tiên làm mặc định nếu có
            const colors = productData.colors;
            if (colors) {
                let availableColors: string[] = [];
                if (Array.isArray(colors)) {
                    availableColors = colors;
                } else if (typeof colors === "string") {
                    try {
                        const parsed = JSON.parse(colors);
                        availableColors = Array.isArray(parsed)
                            ? parsed
                            : [colors];
                    } catch {
                        availableColors = [colors];
                    }
                }
                if (availableColors.length > 0) {
                    setSelectedColor(availableColors[0]);
                }
            }

            // Load sản phẩm liên quan (cùng danh mục)
            if (productData.categoryId) {
                try {
                    const relatedRes = await api.get("/products", {
                        params: {
                            categoryId: productData.categoryId,
                            pageSize: 5, // Load 5 để có thể filter ra sản phẩm hiện tại
                        },
                    });
                    const related =
                        relatedRes.data.items
                            ?.filter((p: any) => p.id !== productData.id)
                            .slice(0, 4) || [];
                    setRelatedProducts(related);
                } catch (error) {
                    console.error("Error loading related products:", error);
                }
            }

            // Load reviews giả lập (trong thực tế sẽ có API riêng)
            setReviews([
                {
                    id: 1,
                    rating: 5,
                    comment: "Sản phẩm chất lượng tốt, giao hàng nhanh!",
                    userName: "Nguyễn Văn A",
                    createdAt: "2024-11-10T00:00:00.000Z",
                },
                {
                    id: 2,
                    rating: 4,
                    comment: "Đóng gói cẩn thận, sản phẩm đúng mô tả.",
                    userName: "Trần Thị B",
                    createdAt: "2024-11-08T00:00:00.000Z",
                },
                {
                    id: 3,
                    rating: 5,
                    comment: "Rất hài lòng với sản phẩm này!",
                    userName: "Lê Văn C",
                    createdAt: "2024-11-05T00:00:00.000Z",
                },
            ]);
        } catch (error) {
            navigate("/products");
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        try {
            const data: any = { productId: product.id, quantity: 1 };
            if (selectedColor) {
                data.selectedColor = selectedColor;
            }
            await api.post("/cart", data);
            alert(
                `Đã thêm vào giỏ hàng${
                    selectedColor ? ` (màu ${getColorName(selectedColor)})` : ""
                }`
            );
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

                    {/* Lựa chọn màu sắc */}
                    {getAllColors().length > 0 && (
                        <div className="flex flex-col gap-3">
                            <h3 className="text-lg font-medium">
                                Màu sắc:{" "}
                                {selectedColor && (
                                    <span className="text-gray-600 font-normal">
                                        {getColorName(selectedColor)}
                                    </span>
                                )}
                            </h3>
                            <div className="flex gap-3 flex-wrap">
                                {getAllColors().map(
                                    (color: string, index: number) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                setSelectedColor(color)
                                            }
                                            className={`w-12 h-12 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                                                selectedColor === color
                                                    ? "border-black shadow-lg scale-110"
                                                    : "border-gray-300 hover:border-gray-400"
                                            }`}
                                            style={{ backgroundColor: color }}
                                            title={getColorName(color)}
                                        >
                                            {/* Thêm dấu tick cho màu được chọn */}
                                            {selectedColor === color && (
                                                <span
                                                    className={`text-lg font-bold ${
                                                        color === "#FFFFFF" ||
                                                        color === "#FFFF00" ||
                                                        color === "#FFC0CB"
                                                            ? "text-black"
                                                            : "text-white"
                                                    }`}
                                                >
                                                    ✓
                                                </span>
                                            )}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    )}

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

            {/* Phần đánh giá và sản phẩm liên quan */}
            <div className="mt-16 space-y-12">
                {/* Đánh giá sản phẩm */}
                <div className="bg-white rounded-lg border border-gray-200 p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-semibold mb-2">
                                Đánh giá sản phẩm
                            </h2>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    {renderStars(
                                        Math.round(averageRating),
                                        "w-5 h-5"
                                    )}
                                    <span className="text-lg font-medium">
                                        {averageRating.toFixed(1)}
                                    </span>
                                    <span className="text-gray-600">
                                        ({reviews.length} đánh giá)
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowReviewForm(!showReviewForm)}
                            className="bg-black text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
                        >
                            Viết đánh giá
                        </button>
                    </div>

                    {/* Form đánh giá */}
                    {showReviewForm && (
                        <form
                            onSubmit={handleSubmitReview}
                            className="mb-8 p-6 bg-gray-50 rounded-lg"
                        >
                            <h3 className="text-lg font-medium mb-4">
                                Viết đánh giá của bạn
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Đánh giá:
                                    </label>
                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() =>
                                                    setNewReview({
                                                        ...newReview,
                                                        rating: star,
                                                    })
                                                }
                                                className="p-1"
                                            >
                                                <Star
                                                    className={`w-6 h-6 ${
                                                        star <= newReview.rating
                                                            ? "text-yellow-400 fill-yellow-400"
                                                            : "text-gray-300"
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Nội dung:
                                    </label>
                                    <textarea
                                        value={newReview.comment}
                                        onChange={(e) =>
                                            setNewReview({
                                                ...newReview,
                                                comment: e.target.value,
                                            })
                                        }
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                                        required
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        className="bg-black text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
                                    >
                                        Gửi đánh giá
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowReviewForm(false)}
                                        className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    {/* Danh sách đánh giá */}
                    <div className="space-y-6">
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="border-b border-gray-200 pb-6 last:border-b-0"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                            <User className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="font-medium">
                                                    {review.userName}
                                                </span>
                                                {renderStars(review.rating)}
                                                <span className="text-sm text-gray-500">
                                                    {new Date(
                                                        review.createdAt
                                                    ).toLocaleDateString(
                                                        "vi-VN"
                                                    )}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 leading-relaxed">
                                                {review.comment}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                Chưa có đánh giá nào cho sản phẩm này
                            </div>
                        )}
                    </div>
                </div>

                {/* Sản phẩm liên quan */}
                {relatedProducts.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-6">
                            Sản phẩm liên quan
                        </h2>
                        <div className="grid grid-cols-5 gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <div
                                    key={relatedProduct.id}
                                    className="group cursor-pointer"
                                >
                                    <div
                                        className="bg-[#f6f6f6] rounded-lg p-4 mb-4 aspect-square flex items-center justify-center group-hover:opacity-90 transition"
                                        onClick={() =>
                                            navigate(
                                                `/products/${relatedProduct.id}`
                                            )
                                        }
                                    >
                                        <img
                                            src={getImageUrl(
                                                Array.isArray(
                                                    relatedProduct.images
                                                )
                                                    ? relatedProduct.images[0]
                                                    : relatedProduct.images
                                            )}
                                            alt={relatedProduct.name}
                                            className="max-w-full max-h-full object-contain"
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    "https://via.placeholder.com/200x200?text=No+Image";
                                            }}
                                        />
                                    </div>
                                    <div className="text-center">
                                        <h3
                                            className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-black transition cursor-pointer"
                                            onClick={() =>
                                                navigate(
                                                    `/products/${relatedProduct.id}`
                                                )
                                            }
                                        >
                                            {relatedProduct.name}
                                        </h3>
                                        <p className="text-lg font-semibold">
                                            {Number(
                                                relatedProduct.price
                                            ).toLocaleString("vi-VN")}{" "}
                                            ₫
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
