import { Hono } from 'hono';
import { orderController } from '../container.js';
import { adapt } from '../utils/honoAdapter.js';

const router = new Hono();

router.post('/checkout', adapt(orderController.createCheckoutSession));
router.get('/track', adapt(orderController.trackOrder));
router.post('/cancel', adapt(orderController.cancelOrder));

export default router;
