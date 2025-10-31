import { Router } from 'express';
import { listCategoriesHandler, createCategoryHandler, updateCategoryHandler, deleteCategoryHandler } from '../controllers/categoryController';
import { requireAdmin } from '../middleware/auth';

export const router = Router();

router.get('/', listCategoriesHandler);
router.post('/', requireAdmin, createCategoryHandler);
router.put('/:id', requireAdmin, updateCategoryHandler);
router.delete('/:id', requireAdmin, deleteCategoryHandler);


