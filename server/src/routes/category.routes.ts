import express, { Request, Response, NextFunction } from "express";
import categoryController from "../controllers/category.controller";
import { authenticate, isAdmin } from "../middlewares/auth.middleware";

const router = express.Router();

// Async handler wrapper
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

// Public routes
router.get("/", asyncHandler(categoryController.getCategories));
router.get("/:id", asyncHandler(categoryController.getCategory));

// Secured admin routes
const secured = router.use(
  authenticate as (req: Request, res: Response, next: NextFunction) => void
);
secured.use(
  isAdmin as (req: Request, res: Response, next: NextFunction) => void
);

secured.post("/", asyncHandler(categoryController.createCategory));
secured.put("/:id", asyncHandler(categoryController.updateCategory));
secured.delete("/:id", asyncHandler(categoryController.deleteCategory));

export default router;
