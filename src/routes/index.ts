import { Router } from "express";
import authRoutes from "./auth";
import userRoutes from "./user";

import { authenticate } from "../middleware/authMiddleware";

const router = Router();
const protectedRouter = Router();


router.use("/auth", authRoutes);
// Protected routes
protectedRouter.use("/user", userRoutes);


// Apply authentication middleware to protected routes
router.use(authenticate, protectedRouter);

export default router;
