import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function listCategoriesHandler(_req: Request, res: Response) {
    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
        include: {
            children: {
                orderBy: { name: "asc" },
            },
        },
    });
    return res.json(categories);
}

export async function createCategoryHandler(req: Request, res: Response) {
    const { name, parentId } = req.body as { name: string; parentId?: number };
    const created = await prisma.category.create({
        data: { name, parentId: parentId ?? null },
    });
    return res.status(201).json(created);
}

export async function updateCategoryHandler(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    const { name, parentId } = req.body as {
        name?: string;
        parentId?: number | null;
    };
    const data: any = {};
    if (typeof name === "string") data.name = name;
    if (parentId === null) data.parentId = null;
    if (typeof parentId === "number") data.parentId = parentId;
    const updated = await prisma.category.update({
        where: { id: Number(id) },
        data,
    });
    return res.json(updated);
}

export async function deleteCategoryHandler(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    await prisma.category.delete({ where: { id: Number(id) } });
    return res.status(204).send();
}
