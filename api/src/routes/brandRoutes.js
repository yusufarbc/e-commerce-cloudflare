import { Hono } from 'hono';
import { brandController } from '../container.js';
import { adapt } from '../utils/honoAdapter.js';

const router = new Hono();

router.get('/', adapt(brandController.getBrands));
router.get('/slug/:slug', adapt(brandController.getBrandBySlug));
router.get('/:id', adapt(brandController.getBrand));

export default router;
