import express from 'express';
import { paymentController } from '../container.js';

const router = express.Router();

/**
 * Param POS Payment Callback Endpoints
 * Param redirects customer to these URLs after 3D Secure verification
 */

// Success callback - called when 3D verification is successful
router.post('/param/success', paymentController.handleParamSuccess);

// Error callback - called when 3D verification fails
router.post('/param/error', paymentController.handleParamError);

// Initiate payment with card details (AJAX from frontend)
router.post('/param/initiate', paymentController.initiatePayment);

// Get installment options for a card BIN
router.get('/param/installments', paymentController.getInstallments);

export default router;

