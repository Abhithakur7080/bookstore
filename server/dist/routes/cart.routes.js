"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_controller_1 = __importDefault(require("../controllers/cart.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.use(auth_middleware_1.authenticate);
router.get("/", asyncHandler(cart_controller_1.default.getCart));
router.post("/add", asyncHandler(cart_controller_1.default.addToCart));
router.post("/merge", asyncHandler(cart_controller_1.default.mergeCart));
router.delete("/remove/:productId", asyncHandler(cart_controller_1.default.removeFromCart));
router.patch("/increase/:productId", asyncHandler(cart_controller_1.default.increaseQuantity));
router.patch("/decrease/:productId", asyncHandler(cart_controller_1.default.decreaseQuantity));
router.delete("/clear", asyncHandler(cart_controller_1.default.clearCart));
exports.default = router;
