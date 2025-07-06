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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const statusCodes_1 = require("../utils/statusCodes");
const auth_validatations_1 = require("../validatations/auth.validatations");
const config_1 = require("../config");
class AuthController {
    constructor() {
        /**
         * Generates JWT access and refresh tokens
         */
        this.generateTokens = (user) => {
            const accessToken = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, config_1.serverConfig.jwtSecret, { expiresIn: config_1.serverConfig.jwtExpiration });
            const refreshToken = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, config_1.serverConfig.jwtRefreshSecret, { expiresIn: config_1.serverConfig.jwtRefreshExpiration });
            return { accessToken, refreshToken };
        };
        /**
         * Registers a new user and sends verification email
         */
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = auth_validatations_1.registerSchema.safeParse(req.body);
            if (!result.success) {
                const errors = {};
                result.error.errors.forEach(err => {
                    if (err.path.length > 0)
                        errors[err.path[0]] = err.message;
                });
                return res.status(statusCodes_1.StatusCode.BadRequest).json({ errors });
            }
            const { email, password, fullName, phone } = result.data;
            try {
                const existingUser = yield user_model_1.default.findOne({ email });
                if (existingUser)
                    return res.status(statusCodes_1.StatusCode.Conflict).json({ message: "User already registered" });
                const user = new user_model_1.default({ email, password, fullName, phone });
                yield user.save();
                yield user.sendVerificationEmail();
                const { accessToken, refreshToken } = this.generateTokens(user);
                // Set cookies
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                });
                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 15 * 60 * 1000, // 15 minutes
                });
                return res.status(statusCodes_1.StatusCode.Created).json({ message: "User created" });
            }
            catch (error) {
                console.error(error);
                return res.status(statusCodes_1.StatusCode.InternalServerError).json({ message: "Internal server error" });
            }
        });
        /**
         * Verifies email using token
         */
        this.verifyEmail = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = auth_validatations_1.verifyEmailQuerySchema.safeParse(req.query);
            if (!result.success) {
                const errors = {};
                result.error.errors.forEach(err => {
                    if (err.path.length > 0)
                        errors[err.path[0]] = err.message;
                });
                return res.status(statusCodes_1.StatusCode.BadRequest).json({ errors });
            }
            const { token, email } = result.data;
            try {
                const user = yield user_model_1.default.findOne({
                    email: decodeURIComponent(email),
                    emailVerificationToken: token,
                    emailVerificationExpires: { $gt: Date.now() },
                });
                if (!user) {
                    return res.status(statusCodes_1.StatusCode.BadRequest).json({ message: "Invalid or expired token" });
                }
                user.isVerified = true;
                user.emailVerifiedAt = new Date();
                user.emailVerificationToken = undefined;
                user.emailVerificationExpires = undefined;
                //user meta
                user.loginHistory = user.loginHistory || [];
                user.loginHistory.push({
                    ip: typeof req.ip === "string"
                        ? req.ip
                        : typeof req.headers["x-forwarded-for"] === "string"
                            ? req.headers["x-forwarded-for"]
                            : req.connection.remoteAddress || "Unknown",
                    device: req.headers["user-agent"] || "Unknown",
                    timestamp: new Date(),
                });
                user.lastLogin = new Date();
                yield user.save();
                return res.json({ message: "Email verified successfully" });
            }
            catch (error) {
                return res.status(statusCodes_1.StatusCode.InternalServerError).json({ message: "Internal server error" });
            }
        });
        /**
         * Logs in the user, sets access and refresh tokens
         */
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = auth_validatations_1.loginSchema.safeParse(req.body);
            if (!result.success) {
                const errors = {};
                result.error.errors.forEach(err => {
                    if (err.path.length > 0)
                        errors[err.path[0]] = err.message;
                });
                return res.status(statusCodes_1.StatusCode.BadRequest).json({ errors });
            }
            const { email, password } = result.data;
            try {
                const user = yield user_model_1.default.findOne({ email }).select("+password");
                if (!user)
                    return res.status(statusCodes_1.StatusCode.NotFound).json({ message: "User not found" });
                const isPasswordValid = yield user.comparePassword(password);
                if (!isPasswordValid)
                    return res.status(statusCodes_1.StatusCode.Unauthorized).json({ message: "Invalid password" });
                // Record login info
                user.loginHistory = user.loginHistory || [];
                user.loginHistory.push({
                    ip: typeof req.ip === "string"
                        ? req.ip
                        : typeof req.headers["x-forwarded-for"] === "string"
                            ? req.headers["x-forwarded-for"]
                            : req.connection.remoteAddress || "Unknown",
                    device: req.headers["user-agent"] || "Unknown",
                    timestamp: new Date(),
                });
                user.lastLogin = new Date();
                yield user.save();
                const { accessToken, refreshToken } = this.generateTokens(user);
                // Set cookies
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                });
                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 15 * 60 * 1000, // 15 minutes
                });
                return res.status(statusCodes_1.StatusCode.OK).json({ accessToken, refreshToken, message: "Login successful" });
            }
            catch (error) {
                return res.status(statusCodes_1.StatusCode.InternalServerError).json({ message: "Internal server error" });
            }
        });
        /**
         * Sends password reset email
         */
        this.requestPasswordReset = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = auth_validatations_1.resetPasswordRequestSchema.safeParse(req.body);
            if (!result.success) {
                const errors = {};
                result.error.errors.forEach(err => {
                    if (err.path.length > 0)
                        errors[err.path[0]] = err.message;
                });
                return res.status(statusCodes_1.StatusCode.BadRequest).json({ errors });
            }
            const { email } = result.data;
            try {
                const user = yield user_model_1.default.findOne({ email });
                if (user)
                    yield user.sendPasswordResetEmail();
                return res.json({
                    message: "If that email is registered, a reset link has been sent.",
                });
            }
            catch (error) {
                return res.status(statusCodes_1.StatusCode.InternalServerError).json({ message: "Internal server error" });
            }
        });
        /**
         * Resets user password using token
         */
        this.resetPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = auth_validatations_1.resetPasswordSchema.safeParse(req.body);
            if (!result.success) {
                const errors = {};
                result.error.errors.forEach(err => {
                    if (err.path.length > 0)
                        errors[err.path[0]] = err.message;
                });
                return res.status(statusCodes_1.StatusCode.BadRequest).json({ errors });
            }
            const { token, email, password } = result.data;
            try {
                const user = yield user_model_1.default.findOne({
                    email: decodeURIComponent(email),
                    resetPasswordToken: token,
                    resetPasswordExpires: { $gt: Date.now() },
                });
                if (!user) {
                    return res.status(statusCodes_1.StatusCode.BadRequest).json({ message: "Invalid or expired token" });
                }
                user.password = password;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                yield user.save();
                return res.json({ message: "Password reset successful" });
            }
            catch (error) {
                return res.status(statusCodes_1.StatusCode.InternalServerError).json({ message: "Internal server error" });
            }
        });
        /**
         * Logs the user out by clearing tokens
         */
        this.logout = (_req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                res.clearCookie("accessToken", {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                });
                res.clearCookie("refreshToken", {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                });
                return res.status(statusCodes_1.StatusCode.OK).json({ message: "Logged out successfully" });
            }
            catch (error) {
                return res.status(statusCodes_1.StatusCode.InternalServerError).json({ message: "Failed to logout" });
            }
        });
        /**
         * Issues a new access token using a valid refresh token
         */
        this.refreshAccessToken = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
                if (!refreshToken) {
                    return res.status(statusCodes_1.StatusCode.Unauthorized).json({ message: "Refresh token missing" });
                }
                const decoded = jsonwebtoken_1.default.verify(refreshToken, config_1.serverConfig.jwtRefreshSecret);
                const user = yield user_model_1.default.findById(decoded.id);
                if (!user) {
                    return res.status(statusCodes_1.StatusCode.Unauthorized).json({ message: "User not found" });
                }
                const { accessToken, refreshToken: newRefreshToken } = this.generateTokens(user);
                // Rotate tokens
                res.cookie("refreshToken", newRefreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 15 * 60 * 1000,
                });
                return res.status(statusCodes_1.StatusCode.OK).json({ accessToken });
            }
            catch (error) {
                // Clear cookies on error
                res.clearCookie("accessToken");
                res.clearCookie("refreshToken");
                console.error("Refresh failed:", error.message);
                return res.status(statusCodes_1.StatusCode.Unauthorized).json({ message: "Invalid or expired refresh token" });
            }
        });
    }
}
exports.default = new AuthController();
