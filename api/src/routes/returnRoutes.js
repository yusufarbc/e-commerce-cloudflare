import { Hono } from 'hono';
import { returnController } from '../container.js';
import { adapt } from '../utils/honoAdapter.js';

const router = new Hono();

router.post('/request', adapt(returnController.createReturnRequest));
router.get('/status', adapt(returnController.getReturnStatus));

export default router;
