import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt, { Secret, SignOptions } from "jsonwebtoken";

const prisma = new PrismaClient();

export async function registerHandler(req: Request, res: Response) {
    const { email, password, fullName } = req.body as {
        email: string;
        password: string;
        fullName: string;
    };
    if (!email || !password || !fullName)
        return res.status(400).json({ message: "Missing fields" });
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
        return res.status(409).json({ message: "Email already in use" });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: { email, passwordHash, fullName },
    });
    return res
        .status(201)
        .json({
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
        });
}

export async function loginHandler(req: Request, res: Response) {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password)
        return res.status(400).json({ message: "Missing credentials" });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    const secret: Secret = process.env.JWT_SECRET || "dev_secret";
    const options = {
        expiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
    } as unknown as SignOptions;
    const token = jwt.sign(
        { userId: user.id, role: user.role },
        secret,
        options
    );
    return res.json({ token });
}

export async function meHandler(req: Request, res: Response) {
    const id = req.user?.userId;
    if (!id) return res.status(401).json({ message: "Unauthorized" });
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
            createdAt: true,
        },
    });
    return res.json(user);
}
