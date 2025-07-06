"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const router = express_1.default.Router();
const asyncHandler = (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};
router.use(auth_middleware_1.authenticate);
router.get("/", asyncHandler(user_controller_1.default.getProfile));
router.put("/", asyncHandler(user_controller_1.default.updateProfile));
router.delete("/", asyncHandler(user_controller_1.default.deleteAccount));
router.post("/newsletter/toggle", asyncHandler(user_controller_1.default.toggleNewsletter));
const adminroute = router.use(auth_middleware_1.isAdmin);
adminroute.post("/newsletter/send", asyncHandler(user_controller_1.default.sendNewsletter));
adminroute.get("/newsletter/subscribers", asyncHandler(user_controller_1.default.getAllNewsletterSubscribers));
exports.default = router;
