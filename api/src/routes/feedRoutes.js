import { Hono } from 'hono';
import { feedController } from '../container.js';
import { adapt } from '../utils/honoAdapter.js';

const router = new Hono();

router.get('/google', adapt(feedController.getGoogleShoppingFeed));
router.get('/google/stats', adapt(feedController.getFeedStats));

export default router;
