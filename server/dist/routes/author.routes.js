"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const author_controllers_1 = __importDefault(require("../controllers/author.controllers"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
const asyncHandler = (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};
// Public
router.get("/", asyncHandler(author_controllers_1.default.getAuthors));
router.get("/:id", asyncHandler(author_controllers_1.default.getAuthor));
// Admin protected
const secured = router.use(auth_middleware_1.authenticate);
secured.use(auth_middleware_1.isAdmin);
secured.post("/", asyncHandler(author_controllers_1.default.createAuthor));
secured.put("/:id", asyncHandler(author_controllers_1.default.updateAuthor));
secured.delete("/:id", asyncHandler(author_controllers_1.default.deleteAuthor));
exports.default = router;
