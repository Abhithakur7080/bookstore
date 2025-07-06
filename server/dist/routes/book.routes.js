"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const book_controller_1 = __importDefault(require("../controllers/book.controller"));
const router = express_1.default.Router();
const asyncHandler = (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};
router.get("/", asyncHandler(book_controller_1.default.getBooks));
router.get("/:slug", asyncHandler(book_controller_1.default.getBook));
router.patch("/:id/featured", asyncHandler(book_controller_1.default.toggleFeatured));
const secured = router.use(auth_middleware_1.authenticate);
secured.use(auth_middleware_1.isAdmin);
secured.post("/", asyncHandler(book_controller_1.default.createBook));
secured.put("/:id", asyncHandler(book_controller_1.default.updateBook));
secured.delete("/:id", asyncHandler(book_controller_1.default.deleteBook));
exports.default = router;
