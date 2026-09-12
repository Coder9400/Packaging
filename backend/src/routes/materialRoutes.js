import { Router } from 'express';
import { getMaterials, getCategories } from '../controllers/materialController.js';

const router = Router();

router.get('/', getMaterials);
router.get('/baseline', getMaterials);
router.get('/categories', getCategories);

export default router;
