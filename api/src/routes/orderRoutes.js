import { Hono } from 'hono';
import { orderController } from '../container.js';
import { adapt } from '../utils/honoAdapter.js';
import { validateRequest } from '../middlewares/validationMiddleware.js';
import { checkoutSchema } from '../validators/orderValidator.js';

const router = new Hono();

// The checkout body is validated before it reaches the service; the adapter hands
// the parsed (coerced) body to the controller instead of the raw JSON.
router.post('/checkout', validateRequest(checkoutSchema), adapt(orderController.createCheckoutSession));
router.get('/track', adapt(orderController.trackOrder));
router.post('/cancel', adapt(orderController.cancelOrder));

export default router;
