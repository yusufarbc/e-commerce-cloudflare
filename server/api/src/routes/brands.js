import express from 'express';
import { brandController } from '../container.js';

const router = express.Router();

// Marka Listeleme
router.get('/', brandController.getBrands);

// Marka Detay (Slug ile)
router.get('/slug/:slug', brandController.getBrandBySlug);

// Marka Detay (ID ile)
router.get('/:id', brandController.getBrand);

export default router;
