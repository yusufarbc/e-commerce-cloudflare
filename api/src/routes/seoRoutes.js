import { Hono } from 'hono';
import { seoController } from '../container.js';
import { adapt } from '../utils/honoAdapter.js';

const router = new Hono();

router.get('/sitemap.xml', adapt(seoController.getSitemap));

export default router;
