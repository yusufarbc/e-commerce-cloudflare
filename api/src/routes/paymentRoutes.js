import { Hono } from 'hono';
import { paymentController } from '../container.js';
import { adapt } from '../utils/honoAdapter.js';

/**
 * Payment Routes
 *
 * All routes are mounted under /api/v1/payment in app.js.
 * The active payment provider is determined at runtime by PAYMENT_PROVIDER env var
 * via PaymentService (Strategy pattern) — these routes are provider-agnostic.
 *
 * Route overview:
 *   POST /initiate                  → Start a 3D Secure payment session
 *   GET  /installments              → Query installment options for a card BIN
 *   POST /callback/param/success    → Param POS 3D success redirect
 *   POST /callback/param/error      → Param POS 3D failure/cancel redirect
 *   POST /callback/iyzico           → iyzico 3D Secure callback
 *   POST /callback/paytr            → PayTR server-to-server notification
 */
const router = new Hono();

/** Initiates a 3D Secure payment using the active provider strategy. */
router.post('/initiate', adapt(paymentController.initiatePayment));

/** Returns available installment plans for a card BIN + amount pair. */
router.get('/installments', adapt(paymentController.getInstallments));

/** Handles a successful 3D Secure redirect from Param POS gateway. */
router.post('/callback/param/success', adapt(paymentController.handleParamSuccess));

/** Handles a failed or cancelled 3D Secure redirect from Param POS gateway. */
router.post('/callback/param/error', adapt(paymentController.handleParamError));

/** Handles the iyzico 3D Secure post-payment callback. */
router.post('/callback/iyzico', adapt(paymentController.handleIyzicoCallback));

/** Handles the PayTR server-to-server payment notification (IPN). */
router.post('/callback/paytr', adapt(paymentController.handlePaytrCallback));

export default router;
