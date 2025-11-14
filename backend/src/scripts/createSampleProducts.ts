import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createSampleProducts() {
    try {
        // Tạo danh mục mẫu nếu chưa có
        const category = await prisma.category.upsert({
            where: { id: 1 },
            update: {},
            create: {
                name: "Electronics",
            },
        });

        // Tạo sản phẩm mẫu có ảnh
        const sampleProducts = [
            {
                name: "iPhone 15 Pro",
                description: "Latest iPhone with advanced features",
                price: 25000000,
                stock: 10,
                categoryId: category.id,
                images: [
                    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300",
                    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300",
                ],
            },
            {
                name: "Samsung Galaxy S24",
                description: "Powerful Android smartphone",
                price: 20000000,
                stock: 15,
                categoryId: category.id,
                images: [
                    "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300",
                ],
            },
            {
                name: "MacBook Air M3",
                description: "Latest MacBook with M3 chip",
                price: 35000000,
                stock: 5,
                categoryId: category.id,
                images: [
                    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300",
                    "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300",
                ],
            },
        ];

        for (const productData of sampleProducts) {
            const existingProduct = await prisma.product.findFirst({
                where: { name: productData.name },
            });

            if (!existingProduct) {
                await prisma.product.create({
                    data: productData,
                });
                console.log(`Created product: ${productData.name}`);
            } else {
                console.log(`Product already exists: ${productData.name}`);
            }
        }

        console.log("Sample products created successfully!");
    } catch (error) {
        console.error("Error creating sample products:", error);
    } finally {
        await prisma.$disconnect();
    }
}

createSampleProducts();
