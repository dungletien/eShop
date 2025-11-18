"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// Lấy danh sách wishlist của user
router.get("/", auth_1.requireAuth, async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const wishlistItems = await prisma.wishlistItem.findMany({
            where: { userId },
            include: {
                product: {
                    include: {
                        category: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        res.json(wishlistItems);
    }
    catch (error) {
        console.error("Error fetching wishlist:", error);
        res.status(500).json({ error: "Failed to fetch wishlist" });
    }
});
// Thêm sản phẩm vào wishlist
router.post("/", auth_1.requireAuth, async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { productId } = req.body;
        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        if (!productId) {
            return res.status(400).json({ error: "Product ID is required" });
        }
        // Kiểm tra xem sản phẩm có tồn tại không
        const product = await prisma.product.findUnique({
            where: { id: parseInt(productId) },
        });
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        // Kiểm tra xem đã có trong wishlist chưa
        const existingItem = await prisma.wishlistItem.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId: parseInt(productId),
                },
            },
        });
        if (existingItem) {
            return res
                .status(400)
                .json({ error: "Product already in wishlist" });
        }
        // Thêm vào wishlist
        const wishlistItem = await prisma.wishlistItem.create({
            data: {
                userId,
                productId: parseInt(productId),
            },
            include: {
                product: {
                    include: {
                        category: true,
                    },
                },
            },
        });
        res.status(201).json(wishlistItem);
    }
    catch (error) {
        console.error("Error adding to wishlist:", error);
        res.status(500).json({ error: "Failed to add to wishlist" });
    }
});
// Xóa sản phẩm khỏi wishlist
router.delete("/:productId", auth_1.requireAuth, async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { productId } = req.params;
        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const deletedItem = await prisma.wishlistItem.delete({
            where: {
                userId_productId: {
                    userId,
                    productId: parseInt(productId),
                },
            },
        });
        res.json({ message: "Product removed from wishlist", deletedItem });
    }
    catch (error) {
        if (error?.code === "P2025") {
            return res
                .status(404)
                .json({ error: "Product not found in wishlist" });
        }
        console.error("Error removing from wishlist:", error);
        res.status(500).json({ error: "Failed to remove from wishlist" });
    }
});
// Kiểm tra sản phẩm có trong wishlist không
router.get("/check/:productId", auth_1.requireAuth, async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { productId } = req.params;
        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const wishlistItem = await prisma.wishlistItem.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId: parseInt(productId),
                },
            },
        });
        res.json({ isInWishlist: !!wishlistItem });
    }
    catch (error) {
        console.error("Error checking wishlist:", error);
        res.status(500).json({ error: "Failed to check wishlist" });
    }
});
exports.default = router;
