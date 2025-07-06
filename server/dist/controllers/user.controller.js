"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const statusCodes_1 = require("../utils/statusCodes");
const user_validatation_1 = require("../validatations/user.validatation");
const zodErrorHelper_1 = require("../utils/zodErrorHelper");
const emailService_1 = require("../utils/emailService");
class UserController {
    constructor() {
        /**
         * Get currently authenticated user's profile
         */
        this.getProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const user = yield user_model_1.default.findById(userId).select("-password -resetPasswordToken -resetPasswordExpires -emailVerificationToken -emailVerificationExpires");
                if (!user) {
                    return res
                        .status(statusCodes_1.StatusCode.NotFound)
                        .json({ message: "User not found" });
                }
                return res.status(statusCodes_1.StatusCode.OK).json({ user });
            }
            catch (error) {
                console.error("📄 Get Profile Error:", error);
                return res
                    .status(statusCodes_1.StatusCode.InternalServerError)
                    .json({ message: "Internal server error" });
            }
        });
        /**
         * Update currently authenticated user's profile
         */
        this.updateProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return res
                        .status(statusCodes_1.StatusCode.Unauthorized)
                        .json({ message: "Unauthorized request" });
                }
                const result = user_validatation_1.updateUserSchema.safeParse(req.body);
                if (!result.success) {
                    const errors = (0, zodErrorHelper_1.extractZodErrors)(result.error.errors);
                    return res.status(statusCodes_1.StatusCode.BadRequest).json({ errors });
                }
                const { fullName, phone, gender, dob, avatarUrl, preferences } = result.data;
                const user = yield user_model_1.default.findByIdAndUpdate(userId, { fullName, phone, gender, dob, avatarUrl, preferences }, { new: true, runValidators: true, fields: { password: 0 } });
                if (!user) {
                    return res
                        .status(statusCodes_1.StatusCode.NotFound)
                        .json({ message: "User not found" });
                }
                return res.status(statusCodes_1.StatusCode.OK).json({ user });
            }
            catch (error) {
                console.error("✏️ Update Profile Error:", error);
                return res
                    .status(statusCodes_1.StatusCode.InternalServerError)
                    .json({ message: "Internal server error" });
            }
        });
        /**
         * Delete currently authenticated user's account
         */
        this.deleteAccount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const user = yield user_model_1.default.findByIdAndDelete(userId);
                if (!user) {
                    return res
                        .status(statusCodes_1.StatusCode.NotFound)
                        .json({ message: "User not found" });
                }
                return res
                    .status(statusCodes_1.StatusCode.OK)
                    .json({ message: "Account deleted successfully" });
            }
            catch (error) {
                console.error("🗑️ Delete Account Error:", error);
                return res
                    .status(statusCodes_1.StatusCode.InternalServerError)
                    .json({ message: "Internal server error" });
            }
        });
        /**
         * Toggle newsletter subscription (User action)
         */
        this.toggleNewsletter = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const result = user_validatation_1.toggleNewsletterSchema.safeParse(req.body);
            if (!result.success) {
                return res
                    .status(statusCodes_1.StatusCode.BadRequest)
                    .json({ errors: (0, zodErrorHelper_1.extractZodErrors)(result.error.errors) });
            }
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const { subscribed } = req.body;
                const user = yield user_model_1.default.findByIdAndUpdate(userId, { "preferences.newsletterSubscribed": subscribed }, { new: true });
                if (!user) {
                    return res
                        .status(statusCodes_1.StatusCode.NotFound)
                        .json({ message: "User not found" });
                }
                const message = subscribed
                    ? "Subscribed to newsletter successfully"
                    : "Unsubscribed from newsletter";
                return res.status(statusCodes_1.StatusCode.OK).json({ message });
            }
            catch (error) {
                console.error("📩 Toggle Newsletter Error:", error);
                return res
                    .status(statusCodes_1.StatusCode.InternalServerError)
                    .json({ message: "Internal server error" });
            }
        });
        /**
         * Admin sends newsletter to all subscribed users
         */
        this.sendNewsletter = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = user_validatation_1.sendNewsletterSchema.safeParse(req.body);
            if (!result.success) {
                return res
                    .status(statusCodes_1.StatusCode.BadRequest)
                    .json({ errors: (0, zodErrorHelper_1.extractZodErrors)(result.error.errors) });
            }
            try {
                const { subject, html } = req.body;
                if (!subject || !html) {
                    return res.status(statusCodes_1.StatusCode.BadRequest).json({
                        message: "Subject and HTML content are required",
                    });
                }
                const users = yield user_model_1.default.find({
                    "preferences.newsletterSubscribed": true,
                }).select("email");
                if (!users.length) {
                    return res
                        .status(statusCodes_1.StatusCode.NotFound)
                        .json({ message: "No subscribed users found" });
                }
                const promises = users.map((user) => (0, emailService_1.sendMail)({
                    to: user.email,
                    subject,
                    html,
                }));
                yield Promise.all(promises);
                return res
                    .status(statusCodes_1.StatusCode.OK)
                    .json({ message: `Newsletter sent to ${users.length} users.` });
            }
            catch (error) {
                console.error("📢 Send Newsletter Error:", error);
                return res
                    .status(statusCodes_1.StatusCode.InternalServerError)
                    .json({ message: "Failed to send newsletter" });
            }
        });
        /**
       * Admin - Get all users subscribed to the newsletter
       */
        this.getAllNewsletterSubscribers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Optional: Check if requesting user is admin (you can move this to middleware if preferred)
                if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin") {
                    return res.status(statusCodes_1.StatusCode.Forbidden).json({
                        message: "Access denied. Admins only.",
                    });
                }
                const users = yield user_model_1.default.find({
                    "preferences.newsletterSubscribed": true,
                }).select("fullName email preferences");
                if (!users.length) {
                    return res
                        .status(statusCodes_1.StatusCode.NotFound)
                        .json({ message: "No subscribed users found" });
                }
                return res.status(statusCodes_1.StatusCode.OK).json({
                    count: users.length,
                    subscribers: users,
                });
            }
            catch (error) {
                console.error("📬 Get Newsletter Subscribers Error:", error);
                return res
                    .status(statusCodes_1.StatusCode.InternalServerError)
                    .json({ message: "Failed to retrieve subscribers" });
            }
        });
    }
}
exports.default = new UserController();
