import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getCartHandler, addToCartHandler, updateCartItemHandler, removeFromCartHandler, clearCartHandler } from '../controllers/cartController';

export const router = Router();

router.use(requireAuth);

router.get('/', getCartHandler);
router.post('/', addToCartHandler);
router.put('/:productId', updateCartItemHandler);
router.delete('/:productId', removeFromCartHandler);
router.delete('/', clearCartHandler);


