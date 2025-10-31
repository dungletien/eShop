import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { createOrderHandler, listMyOrdersHandler, getOrderHandler, listAllOrdersHandler, updateOrderStatusHandler } from '../controllers/orderController';

export const router = Router();

router.use(requireAuth);

router.post('/', createOrderHandler);
router.get('/me', listMyOrdersHandler);
router.get('/:id', getOrderHandler);

router.get('/', requireAdmin, listAllOrdersHandler);
router.put('/:id/status', requireAdmin, updateOrderStatusHandler);


