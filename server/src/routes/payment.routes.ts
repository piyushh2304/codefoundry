import { Router } from 'express';
import { createOrder, verifyPayment } from '../controller/payment.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/create-order', authenticateToken, createOrder);
router.post('/verify-payment', authenticateToken, verifyPayment);

export default router;
