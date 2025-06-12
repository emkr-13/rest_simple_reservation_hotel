import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './user';
import roomTypeRoutes from './roomType';
import roomRoutes from './room';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();
const protectedRouter = Router();

router.use('/auth', authRoutes);

// Protected routes
protectedRouter.use('/user', userRoutes);
protectedRouter.use('/roomType', roomTypeRoutes);
protectedRouter.use('/room', roomRoutes);
// Apply authentication middleware to protected routes
router.use(authenticate, protectedRouter);

export default router;
