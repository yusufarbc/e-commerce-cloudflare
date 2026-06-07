import express from 'express';
import { categoryController } from '../container.js';

const router = express.Router();

// Kategori Listeleme Endpoint'i
router.get('/', categoryController.getCategories);

export default router;
