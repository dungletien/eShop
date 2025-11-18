import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function listUsersHandler(_req: Request, res: Response) {
  const users = await prisma.user.findMany({ select: { id: true, email: true, fullName: true, role: true, createdAt: true } });
  return res.json(users);
}

export async function getCurrentUserHandler(req: Request, res: Response) {
  const userId = req.user!.userId;
  const user = await prisma.user.findUnique({ 
    where: { id: userId }, 
    select: { id: true, email: true, fullName: true, role: true, createdAt: true } 
  });
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json(user);
}


