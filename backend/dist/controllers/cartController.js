"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCartHandler = getCartHandler;
exports.addToCartHandler = addToCartHandler;
exports.updateCartItemHandler = updateCartItemHandler;
exports.removeFromCartHandler = removeFromCartHandler;
exports.clearCartHandler = clearCartHandler;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function getCartHandler(req, res) {
    const userId = req.user.userId;
    const items = await prisma.cartItem.findMany({ where: { userId }, include: { product: true } });
    return res.json(items);
}
async function addToCartHandler(req, res) {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;
    const item = await prisma.cartItem.upsert({
        where: { userId_productId: { userId, productId } },
        create: { userId, productId, quantity: quantity ?? 1 },
        update: { quantity: { increment: quantity ?? 1 } }
    });
    return res.status(201).json(item);
}
async function updateCartItemHandler(req, res) {
    const userId = req.user.userId;
    const productId = Number(req.params.productId);
    const { quantity } = req.body;
    const updated = await prisma.cartItem.update({
        where: { userId_productId: { userId, productId } },
        data: { quantity }
    });
    return res.json(updated);
}
async function removeFromCartHandler(req, res) {
    const userId = req.user.userId;
    const productId = Number(req.params.productId);
    await prisma.cartItem.delete({ where: { userId_productId: { userId, productId } } });
    return res.status(204).send();
}
async function clearCartHandler(req, res) {
    const userId = req.user.userId;
    await prisma.cartItem.deleteMany({ where: { userId } });
    return res.status(204).send();
}
