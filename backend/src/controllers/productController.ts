import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function listProductsHandler(req: Request, res: Response) {
  const { q, category, page = '1', pageSize = '12' } = req.query as Record<string, string>;
  const currentPage = Math.max(parseInt(page) || 1, 1);
  const size = Math.min(Math.max(parseInt(pageSize) || 12, 1), 100);
  const where: any = {};
  if (q) where.OR = [{ name: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }];
  if (category) where.category = { slug: category };
  const [items, total] = await Promise.all([
    prisma.product.findMany({ where, include: { category: true }, skip: (currentPage - 1) * size, take: size, orderBy: { createdAt: 'desc' } }),
    prisma.product.count({ where })
  ]);
  return res.json({ items, total, page: currentPage, pageSize: size });
}

export async function getProductHandler(req: Request, res: Response) {
  const { slug } = req.params as { slug: string };
  const product = await prisma.product.findUnique({ where: { slug }, include: { category: true } });
  if (!product) return res.status(404).json({ message: 'Not found' });
  return res.json(product);
}

export async function createProductHandler(req: Request, res: Response) {
  const { name, slug, description, price, stock, images, categoryId } = req.body;
  const created = await prisma.product.create({ data: { name, slug, description, price, stock, images, categoryId } });
  return res.status(201).json(created);
}

export async function updateProductHandler(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const updated = await prisma.product.update({ where: { id: Number(id) }, data: req.body });
  return res.json(updated);
}

export async function deleteProductHandler(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  await prisma.product.delete({ where: { id: Number(id) } });
  return res.status(204).send();
}


