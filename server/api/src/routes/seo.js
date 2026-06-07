import express from 'express';
import { seoController } from '../controllers/seoController.js';

const router = express.Router();

/**
 * @route   GET /sitemap.xml
 * @desc    Dynamic sitemap with all products and categories
 * @access  Public
 */
router.get('/sitemap.xml', seoController.getSitemap);

export default router;
