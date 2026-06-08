import { Hono } from 'hono';
import { paymentController } from '../container.js';
import { adapt } from '../utils/honoAdapter.js';

const router = new Hono();

router.post('/success', adapt(paymentController.handleParamSuccess));
router.post('/error', adapt(paymentController.handleParamError));
router.post('/initiate', adapt(paymentController.initiatePayment));
router.get('/installments', adapt(paymentController.getInstallments));

export default router;
