import express, { Request, Response, NextFunction } from "express";
import authorController from "../controllers/author.controllers";
import { authenticate, isAdmin } from "../middlewares/auth.middleware";

const router = express.Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

// Public
router.get("/", asyncHandler(authorController.getAuthors));
router.get("/:id", asyncHandler(authorController.getAuthor));

// Admin protected
const secured = router.use(
  authenticate as (req: Request, res: Response, next: NextFunction) => void
);
secured.use(
  isAdmin as (req: Request, res: Response, next: NextFunction) => void
);

secured.post("/", asyncHandler(authorController.createAuthor));
secured.put("/:id", asyncHandler(authorController.updateAuthor));
secured.delete("/:id", asyncHandler(authorController.deleteAuthor));

export default router;
