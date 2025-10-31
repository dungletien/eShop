import { Router } from 'express';
import { requireAdmin } from '../middleware/auth';
import { listUsersHandler } from '../controllers/userController';

export const router = Router();

router.get('/', requireAdmin, listUsersHandler);


