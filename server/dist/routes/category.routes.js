"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = __importDefault(require("../controllers/category.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
// Async handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};
// Public routes
router.get("/", asyncHandler(category_controller_1.default.getCategories));
router.get("/:id", asyncHandler(category_controller_1.default.getCategory));
// Secured admin routes
const secured = router.use(auth_middleware_1.authenticate);
secured.use(auth_middleware_1.isAdmin);
secured.post("/", asyncHandler(category_controller_1.default.createCategory));
secured.put("/:id", asyncHandler(category_controller_1.default.updateCategory));
secured.delete("/:id", asyncHandler(category_controller_1.default.deleteCategory));
exports.default = router;
