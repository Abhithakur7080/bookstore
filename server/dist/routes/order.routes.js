"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = __importDefault(require("../controllers/order.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware"); // Assuming JWT auth
const router = express_1.default.Router();
// Middleware to catch async errors
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
// Protected Routes
router.use(auth_middleware_1.authenticate);
// 👉 Place COD Order
router.post("/place-cod-order", asyncHandler(order_controller_1.default.placeCODOrder));
router.post("/create-checkout-session", asyncHandler(order_controller_1.default.createCheckoutSession));
router.post("/complete-stripe-order", asyncHandler(order_controller_1.default.completeStripeOrder));
exports.default = router;
