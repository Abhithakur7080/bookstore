import express, { Request, Response, NextFunction } from "express";
import CartController from "../controllers/cart.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

const asyncHandler = (fn: any) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.use(authenticate as (req: Request, res: Response, next: NextFunction) => void);

router.get("/", asyncHandler(CartController.getCart));

router.post("/add", asyncHandler(CartController.addToCart));

router.post("/merge", asyncHandler(CartController.mergeCart));

router.delete("/remove/:productId", asyncHandler(CartController.removeFromCart));

router.patch("/increase/:productId", asyncHandler(CartController.increaseQuantity));

router.patch("/decrease/:productId", asyncHandler(CartController.decreaseQuantity));

router.delete("/clear", asyncHandler(CartController.clearCart));

export default router;
