import express from "express";
import contactController from "../controllers/contact.controller";

const router = express.Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

router.post("/send", asyncHandler(contactController.sendContact));

export default router;
