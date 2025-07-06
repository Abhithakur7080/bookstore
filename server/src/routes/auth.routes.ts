import express, { NextFunction, Request, Response } from 'express';
import authController from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
	return Promise.resolve(fn(req, res, next)).catch(next);
};

router.post("/register", asyncHandler(authController.register))
router.post("/login", asyncHandler(authController.login))
router.get("/verify-email", asyncHandler(authController.verifyEmail));
router.post("/refresh-token", asyncHandler(authController.refreshAccessToken));
router.post("/reset-password-request", asyncHandler(authController.requestPasswordReset));
router.post("/reset-password", asyncHandler(authController.resetPassword));
router.post("/logout", authenticate as (req: Request, res: Response, next: NextFunction) => void, asyncHandler(authController.logout));

export default router;