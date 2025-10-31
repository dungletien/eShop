import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function listUsersHandler(_req: Request, res: Response) {
  const users = await prisma.user.findMany({ select: { id: true, email: true, fullName: true, role: true, createdAt: true } });
  return res.json(users);
}


