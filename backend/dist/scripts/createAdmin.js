"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function createAdmin() {
    try {
        // Thông tin tài khoản admin mặc định
        const adminEmail = "admin@example.com";
        const adminPassword = "admin123";
        const adminFullName = "Administrator";
        // Kiểm tra xem admin đã tồn tại chưa
        const existingAdmin = await prisma.user.findUnique({
            where: { email: adminEmail },
        });
        if (existingAdmin) {
            console.log("Admin account already exists!");
            console.log("Email:", adminEmail);
            console.log("Password: admin123");
            return;
        }
        // Tạo hash cho mật khẩu
        const passwordHash = await bcryptjs_1.default.hash(adminPassword, 10);
        // Tạo tài khoản admin
        const admin = await prisma.user.create({
            data: {
                email: adminEmail,
                passwordHash,
                fullName: adminFullName,
                role: "ADMIN",
            },
        });
        console.log("Admin account created successfully!");
        console.log("Email:", admin.email);
        console.log("Password:", adminPassword);
        console.log("Role:", admin.role);
    }
    catch (error) {
        console.error("Error creating admin:", error);
    }
    finally {
        await prisma.$disconnect();
    }
}
createAdmin();
