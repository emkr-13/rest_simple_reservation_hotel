import { Router } from 'express';
import { login, logout, register } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/login', login);
router.post('/logout', authenticate, logout);
router.post('/register', register);

export default router;
