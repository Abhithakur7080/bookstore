import express, { Request, Response, NextFunction } from "express";
import { authenticate, isAdmin } from "../middlewares/auth.middleware";
import userController from "../controllers/user.controller";

const router = express.Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
	return Promise.resolve(fn(req, res, next)).catch(next);
};

router.use(authenticate as (req: Request, res: Response, next: NextFunction) => void);

router.get("/", asyncHandler(userController.getProfile))
router.put("/", asyncHandler(userController.updateProfile))
router.delete("/", asyncHandler(userController.deleteAccount))
router.post("/newsletter/toggle",  asyncHandler(userController.toggleNewsletter));
const adminroute = router.use(
  isAdmin as (req: Request, res: Response, next: NextFunction) => void
);
adminroute.post("/newsletter/send",  asyncHandler(userController.sendNewsletter));
adminroute.get("/newsletter/subscribers",  asyncHandler(userController.getAllNewsletterSubscribers));


export default router