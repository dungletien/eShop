"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCategoriesHandler = listCategoriesHandler;
exports.createCategoryHandler = createCategoryHandler;
exports.updateCategoryHandler = updateCategoryHandler;
exports.deleteCategoryHandler = deleteCategoryHandler;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function listCategoriesHandler(_req, res) {
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
async function createCategoryHandler(req, res) {
    const { name, parentId } = req.body;
    const created = await prisma.category.create({
        data: { name, parentId: parentId ?? null },
    });
    return res.status(201).json(created);
}
async function updateCategoryHandler(req, res) {
    const { id } = req.params;
    const { name, parentId } = req.body;
    const data = {};
    if (typeof name === "string")
        data.name = name;
    if (parentId === null)
        data.parentId = null;
    if (typeof parentId === "number")
        data.parentId = parentId;
    const updated = await prisma.category.update({
        where: { id: Number(id) },
        data,
    });
    return res.json(updated);
}
async function deleteCategoryHandler(req, res) {
    const { id } = req.params;
    await prisma.category.delete({ where: { id: Number(id) } });
    return res.status(204).send();
}
