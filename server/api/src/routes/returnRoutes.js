import express from 'express';
import { ReturnController } from '../controllers/returnController.js';

const router = express.Router();
const returnController = new ReturnController();

router.post('/request', (req, res) => returnController.createReturnRequest(req, res));
router.get('/status', (req, res) => returnController.getReturnStatus(req, res));

export default router;
