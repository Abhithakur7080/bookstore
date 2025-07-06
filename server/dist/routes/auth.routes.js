"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
const asyncHandler = (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};
router.post("/register", asyncHandler(auth_controller_1.default.register));
router.post("/login", asyncHandler(auth_controller_1.default.login));
router.get("/verify-email", asyncHandler(auth_controller_1.default.verifyEmail));
router.post("/refresh-token", asyncHandler(auth_controller_1.default.refreshAccessToken));
router.post("/reset-password-request", asyncHandler(auth_controller_1.default.requestPasswordReset));
router.post("/reset-password", asyncHandler(auth_controller_1.default.resetPassword));
router.post("/logout", auth_middleware_1.authenticate, asyncHandler(auth_controller_1.default.logout));
exports.default = router;
