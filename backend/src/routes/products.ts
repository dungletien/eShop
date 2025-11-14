import { Router } from 'express';
import { listProductsHandler, getProductHandler, createProductHandler, updateProductHandler, deleteProductHandler } from '../controllers/productController';
import { requireAdmin } from '../middleware/auth';

export const router = Router();

router.get('/', listProductsHandler);
router.get('/:id', getProductHandler);

router.post('/', requireAdmin, createProductHandler);
router.put('/:id', requireAdmin, updateProductHandler);
router.delete('/:id', requireAdmin, deleteProductHandler);


