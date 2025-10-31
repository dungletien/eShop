import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getCartHandler(req: Request, res: Response) {
  const userId = req.user!.userId;
  const items = await prisma.cartItem.findMany({ where: { userId }, include: { product: true } });
  return res.json(items);
}

export async function addToCartHandler(req: Request, res: Response) {
  const userId = req.user!.userId;
  const { productId, quantity } = req.body as { productId: number; quantity?: number };
  const item = await prisma.cartItem.upsert({
    where: { userId_productId: { userId, productId } },
    create: { userId, productId, quantity: quantity ?? 1 },
    update: { quantity: { increment: quantity ?? 1 } }
  });
  return res.status(201).json(item);
}

export async function updateCartItemHandler(req: Request, res: Response) {
  const userId = req.user!.userId;
  const productId = Number(req.params.productId);
  const { quantity } = req.body as { quantity: number };
  const updated = await prisma.cartItem.update({
    where: { userId_productId: { userId, productId } },
    data: { quantity }
  });
  return res.json(updated);
}

export async function removeFromCartHandler(req: Request, res: Response) {
  const userId = req.user!.userId;
  const productId = Number(req.params.productId);
  await prisma.cartItem.delete({ where: { userId_productId: { userId, productId } } });
  return res.status(204).send();
}

export async function clearCartHandler(req: Request, res: Response) {
  const userId = req.user!.userId;
  await prisma.cartItem.deleteMany({ where: { userId } });
  return res.status(204).send();
}


