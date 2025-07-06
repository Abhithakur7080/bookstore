import express, { Request, Response, NextFunction } from "express";
import { authenticate, isAdmin } from "../middlewares/auth.middleware";
import bookController from "../controllers/book.controller";

const router = express.Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

router.get("/", asyncHandler(bookController.getBooks));
router.get("/:slug", asyncHandler(bookController.getBook));
router.patch(
  "/:id/featured",
  asyncHandler(bookController.toggleFeatured)
);
const secured = router.use(
  authenticate as (req: Request, res: Response, next: NextFunction) => void
);
secured.use(
  isAdmin as (req: Request, res: Response, next: NextFunction) => void
);

secured.post("/", asyncHandler(bookController.createBook));
secured.put("/:id", asyncHandler(bookController.updateBook));
secured.delete("/:id", asyncHandler(bookController.deleteBook));

export default router;
