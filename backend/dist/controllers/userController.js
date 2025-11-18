"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsersHandler = listUsersHandler;
exports.getCurrentUserHandler = getCurrentUserHandler;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function listUsersHandler(_req, res) {
    const users = await prisma.user.findMany({ select: { id: true, email: true, fullName: true, role: true, createdAt: true } });
    return res.json(users);
}
async function getCurrentUserHandler(req, res) {
    const userId = req.user.userId;
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, fullName: true, role: true, createdAt: true }
    });
    if (!user)
        return res.status(404).json({ message: 'User not found' });
    return res.json(user);
}
