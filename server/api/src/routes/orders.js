import express from 'express';
import { orderController } from '../container.js';

const router = express.Router();

import { validateRequest } from '../middlewares/validationMiddleware.js';
import { checkoutSchema } from '../validators/orderValidator.js';

// Checkout (Ödeme Başlatma) Endpoint'i - Validasyonlu
router.post('/checkout', validateRequest(checkoutSchema), orderController.createCheckoutSession);

// Sipariş Takip Endpoint'i
router.get('/track', orderController.trackOrder);

// Sipariş İptal Endpoint'i
router.post('/cancel', orderController.cancelOrder);

export default router;
