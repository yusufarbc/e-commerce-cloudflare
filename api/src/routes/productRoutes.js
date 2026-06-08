import { Hono } from 'hono';
import { productController } from '../container.js';
import { adapt } from '../utils/honoAdapter.js';

const router = new Hono();

router.get('/', async (c) => {
    console.log('[DEBUG] GET /api/v1/products route handler hit!');
    return adapt(productController.getProducts)(c);
});
router.get('/slug/:slug', adapt(productController.getProductBySlug));
router.get('/:id', adapt(productController.getProduct));

export default router;
