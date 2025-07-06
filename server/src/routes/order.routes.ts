import express, { NextFunction, Request, Response } from "express";
import orderController from "../controllers/order.controller";
import { authenticate } from "../middlewares/auth.middleware"; // Assuming JWT auth

const router = express.Router();

// Middleware to catch async errors
const asyncHandler = (fn: any) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Protected Routes
router.use(authenticate as (req: Request, res: Response, next: NextFunction) => void);


// 👉 Place COD Order
router.post("/place-cod-order", asyncHandler(orderController.placeCODOrder));
router.post("/create-checkout-session", asyncHandler(orderController.createCheckoutSession));
router.post("/complete-stripe-order", asyncHandler(orderController.completeStripeOrder));



export default router;
