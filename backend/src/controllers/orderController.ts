import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createOrderHandler(req: Request, res: Response) {
  const userId = req.user!.userId;
  const { address } = req.body as { address: string };
  const cartItems = await prisma.cartItem.findMany({ where: { userId }, include: { product: true } });
  if (cartItems.length === 0) return res.status(400).json({ message: 'Cart is empty' });
  const totalAmount = cartItems.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({ data: { userId, address, totalAmount } });
    await tx.orderItem.createMany({
      data: cartItems.map((ci) => ({ orderId: created.id, productId: ci.productId, quantity: ci.quantity, price: ci.product.price }))
    });
    await tx.cartItem.deleteMany({ where: { userId } });
    return created;
  });
  return res.status(201).json(order);
}

export async function listMyOrdersHandler(req: Request, res: Response) {
  const userId = req.user!.userId;
  const orders = await prisma.order.findMany({ where: { userId }, include: { items: { include: { product: true } } }, orderBy: { createdAt: 'desc' } });
  return res.json(orders);
}

export async function getOrderHandler(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const order = await prisma.order.findUnique({ where: { id: Number(id) }, include: { items: { include: { product: true } }, user: true } });
  if (!order) return res.status(404).json({ message: 'Not found' });
  if (req.user!.role !== 'ADMIN' && order.userId !== req.user!.userId) return res.status(403).json({ message: 'Forbidden' });
  return res.json(order);
}

export async function listAllOrdersHandler(_req: Request, res: Response) {
  const orders = await prisma.order.findMany({ include: { items: true, user: true }, orderBy: { createdAt: 'desc' } });
  return res.json(orders);
}

export async function updateOrderStatusHandler(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const { status } = req.body as { status: 'PENDING' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELED' };
  const updated = await prisma.order.update({ where: { id: Number(id) }, data: { status } });
  return res.json(updated);
}


