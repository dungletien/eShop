import { useState, useEffect } from "react";
import { api } from "../shared/api";

export const useWishlist = () => {
    const [wishlistItems, setWishlistItems] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    // Load wishlist từ server
    const loadWishlist = async () => {
        try {
            const response = await api.get("/wishlist");
            const items = response.data.map((item: any) => item.productId);
            setWishlistItems(items);
        } catch (error) {
            // Nếu chưa đăng nhập thì không load wishlist
            setWishlistItems([]);
        }
    };

    // Thêm sản phẩm vào wishlist
    const addToWishlist = async (productId: number) => {
        setLoading(true);
        try {
            await api.post("/wishlist", { productId });
            setWishlistItems((prev) => [...prev, productId]);
            // Dispatch event for other components to listen
            window.dispatchEvent(new CustomEvent("wishlistChanged"));
            return {
                success: true,
                message: "Đã thêm vào danh sách yêu thích",
            };
        } catch (error: any) {
            const message =
                error.response?.data?.error ||
                "Vui lòng đăng nhập để thêm vào wishlist";
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    // Xóa sản phẩm khỏi wishlist
    const removeFromWishlist = async (productId: number) => {
        setLoading(true);
        try {
            await api.delete(`/wishlist/${productId}`);
            setWishlistItems((prev) => prev.filter((id) => id !== productId));
            return {
                success: true,
                message: "Đã xóa khỏi danh sách yêu thích",
            };
        } catch (error: any) {
            const message = error.response?.data?.error || "Có lỗi xảy ra";
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    // Toggle wishlist (thêm nếu chưa có, xóa nếu đã có)
    const toggleWishlist = async (productId: number) => {
        if (wishlistItems.includes(productId)) {
            return await removeFromWishlist(productId);
        } else {
            return await addToWishlist(productId);
        }
    };

    // Kiểm tra sản phẩm có trong wishlist không
    const isInWishlist = (productId: number) => {
        return wishlistItems.includes(productId);
    };

    useEffect(() => {
        loadWishlist();
    }, []);

    return {
        wishlistItems,
        loading,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        loadWishlist,
    };
};
