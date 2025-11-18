"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderHandler = createOrderHandler;
exports.listMyOrdersHandler = listMyOrdersHandler;
exports.getOrderHandler = getOrderHandler;
exports.listAllOrdersHandler = listAllOrdersHandler;
exports.updateOrderStatusHandler = updateOrderStatusHandler;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function createOrderHandler(req, res) {
    const userId = req.user.userId;
    const { address, customerInfo, paymentMethod } = req.body;
    const cartItems = await prisma.cartItem.findMany({
        where: { userId },
        include: { product: true },
    });
    if (cartItems.length === 0)
        return res.status(400).json({ message: "Cart is empty" });
    const totalAmount = cartItems.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
    const order = await prisma.$transaction(async (tx) => {
        const created = await tx.order.create({
            data: {
                userId,
                address: customerInfo?.address || address,
                customerName: customerInfo?.fullName,
                customerPhone: customerInfo?.phone,
                customerEmail: customerInfo?.email,
                paymentMethod,
                totalAmount,
            },
        });
        await tx.orderItem.createMany({
            data: cartItems.map((ci) => ({
                orderId: created.id,
                productId: ci.productId,
                quantity: ci.quantity,
                price: ci.product.price,
            })),
        });
        await tx.cartItem.deleteMany({ where: { userId } });
        return created;
    });
    return res.status(201).json(order);
}
async function listMyOrdersHandler(req, res) {
    const userId = req.user.userId;
    const orders = await prisma.order.findMany({
        where: { userId },
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
    });
    return res.json(orders);
}
async function getOrderHandler(req, res) {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
        where: { id: Number(id) },
        include: { items: { include: { product: true } }, user: true },
    });
    if (!order)
        return res.status(404).json({ message: "Not found" });
    if (req.user.role !== "ADMIN" && order.userId !== req.user.userId)
        return res.status(403).json({ message: "Forbidden" });
    return res.json(order);
}
async function listAllOrdersHandler(_req, res) {
    const orders = await prisma.order.findMany({
        include: { items: { include: { product: true } }, user: true },
        orderBy: { createdAt: "desc" },
    });
    return res.json(orders);
}
async function updateOrderStatusHandler(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await prisma.order.update({
        where: { id: Number(id) },
        data: { status },
    });
    return res.json(updated);
}
