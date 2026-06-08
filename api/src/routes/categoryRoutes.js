import { Hono } from 'hono';
import { categoryController } from '../container.js';
import { adapt } from '../utils/honoAdapter.js';

const router = new Hono();

router.get('/', adapt(categoryController.getCategories));

export default router;
