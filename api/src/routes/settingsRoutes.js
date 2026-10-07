import { Hono } from 'hono';
import { settingsController } from '../container.js';
import { adapt } from '../utils/honoAdapter.js';

const router = new Hono();

router.get('/', adapt(settingsController.getPublicSettings));

export default router;
