import express from 'express';
import { settingsController } from '../controllers/settingsController.js';

const router = express.Router();

router.get('/', settingsController.getSettings);

export default router;
