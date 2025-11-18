"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerHandler = registerHandler;
exports.loginHandler = loginHandler;
exports.meHandler = meHandler;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
async function registerHandler(req, res) {
    const { email, password, fullName } = req.body;
    if (!email || !password || !fullName)
        return res.status(400).json({ message: 'Missing fields' });
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
        return res.status(409).json({ message: 'Email already in use' });
    const passwordHash = await bcryptjs_1.default.hash(password, 10);
    const user = await prisma.user.create({ data: { email, passwordHash, fullName } });
    return res.status(201).json({ id: user.id, email: user.email, fullName: user.fullName, role: user.role });
}
async function loginHandler(req, res) {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: 'Missing credentials' });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
        return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!ok)
        return res.status(401).json({ message: 'Invalid credentials' });
    const secret = process.env.JWT_SECRET || 'dev_secret';
    const options = { expiresIn: process.env.JWT_EXPIRES_IN ?? '7d' };
    const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, secret, options);
    return res.json({ token });
}
async function meHandler(req, res) {
    const id = req.user?.userId;
    if (!id)
        return res.status(401).json({ message: 'Unauthorized' });
    const user = await prisma.user.findUnique({ where: { id }, select: { id: true, email: true, fullName: true, role: true, createdAt: true } });
    return res.json(user);
}
