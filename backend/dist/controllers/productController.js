"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProductsHandler = listProductsHandler;
exports.getProductHandler = getProductHandler;
exports.createProductHandler = createProductHandler;
exports.updateProductHandler = updateProductHandler;
exports.deleteProductHandler = deleteProductHandler;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function listProductsHandler(req, res) {
    const { q, categoryId, page = "1", pageSize = "12", sortBy, } = req.query;
    const currentPage = Math.max(parseInt(page) || 1, 1);
    const size = Math.min(Math.max(parseInt(pageSize) || 12, 1), 100);
    const where = {};
    if (q)
        where.OR = [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
        ];
    if (categoryId) {
        const parsedCategoryId = Number(categoryId);
        if (!Number.isNaN(parsedCategoryId)) {
            // Tìm tất cả danh mục con của danh mục được chọn
            const childCategories = await prisma.category.findMany({
                where: { parentId: parsedCategoryId },
                select: { id: true },
            });
            const categoryIds = [
                parsedCategoryId,
                ...childCategories.map((c) => c.id),
            ];
            where.categoryId = { in: categoryIds };
        }
    }
    // Xử lý sắp xếp
    let orderBy = { createdAt: "desc" };
    if (sortBy) {
        switch (sortBy) {
            case "price_asc":
                orderBy = { price: "asc" };
                break;
            case "price_desc":
                orderBy = { price: "desc" };
                break;
            case "name_asc":
                orderBy = { name: "asc" };
                break;
            case "name_desc":
                orderBy = { name: "desc" };
                break;
        }
    }
    const [items, total] = await Promise.all([
        prisma.product.findMany({
            where,
            include: { category: true },
            skip: (currentPage - 1) * size,
            take: size,
            orderBy,
        }),
        prisma.product.count({ where }),
    ]);
    return res.json({ items, total, page: currentPage, pageSize: size });
}
async function getProductHandler(req, res) {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
        where: { id: Number(id) },
        include: { category: true },
    });
    if (!product)
        return res.status(404).json({ message: "Not found" });
    return res.json(product);
}
async function createProductHandler(req, res) {
    const { name, description, price, stock, images, colors, categoryId } = req.body;
    const created = await prisma.product.create({
        data: { name, description, price, stock, images, colors, categoryId },
    });
    return res.status(201).json(created);
}
async function updateProductHandler(req, res) {
    const { id } = req.params;
    const { name, description, price, stock, images, colors, categoryId } = req.body;
    const data = {};
    if (typeof name === "string")
        data.name = name;
    if (typeof description === "string")
        data.description = description;
    if (typeof price === "number")
        data.price = price;
    if (typeof stock === "number")
        data.stock = stock;
    if (images !== undefined)
        data.images = images;
    if (colors !== undefined)
        data.colors = colors;
    if (typeof categoryId === "number")
        data.categoryId = categoryId;
    const updated = await prisma.product.update({
        where: { id: Number(id) },
        data,
    });
    return res.json(updated);
}
async function deleteProductHandler(req, res) {
    const { id } = req.params;
    const productId = Number(id);
    try {
        // Use transaction to delete related records first, then the product
        await prisma.$transaction(async (tx) => {
            // Delete related cart items
            await tx.cartItem.deleteMany({
                where: { productId }
            });
            // Delete related wishlist items
            await tx.wishlistItem.deleteMany({
                where: { productId }
            });
            // Note: We don't delete OrderItems as they represent historical data
            // Instead, we'll handle this by checking if product has orders
            const orderItems = await tx.orderItem.findMany({
                where: { productId }
            });
            if (orderItems.length > 0) {
                throw new Error("Không thể xóa sản phẩm này vì đã có đơn hàng liên quan. Hãy ngừng bán sản phẩm thay vì xóa.");
            }
            // Delete the product
            await tx.product.delete({ where: { id: productId } });
        });
        return res.status(204).send();
    }
    catch (error) {
        console.error('Delete product error:', error);
        return res.status(400).json({
            message: error.message || "Không thể xóa sản phẩm"
        });
    }
}
