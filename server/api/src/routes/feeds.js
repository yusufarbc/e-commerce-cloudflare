import express from 'express';
import { getGoogleShoppingFeed, getFeedStats } from '../controllers/feedController.js';

const router = express.Router();

/**
 * @route   GET /api/v1/feeds/google
 * @desc    Google Shopping XML Feed for Merchant Center
 * @access  Public
 */
router.get('/google', getGoogleShoppingFeed);

/**
 * @route   GET /api/v1/feeds/google/stats
 * @desc    Feed statistics for admin monitoring
 * @access  Public (consider adding auth for production)
 */
router.get('/google/stats', getFeedStats);

export default router;
