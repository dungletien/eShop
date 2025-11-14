import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

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
        const passwordHash = await bcrypt.hash(adminPassword, 10);

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
    } catch (error) {
        console.error("Error creating admin:", error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
