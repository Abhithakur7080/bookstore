"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const statusCodes_1 = require("../utils/statusCodes");
/**
 * Middleware: Authenticates user by verifying JWT from cookies or Authorization header
 */
const authenticate = (req, res, next) => {
    var _a, _b;
    const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken) ||
        (((_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.startsWith("Bearer "))
            ? req.headers.authorization.split(" ")[1]
            : undefined);
    if (!token) {
        return res
            .status(statusCodes_1.StatusCode.Unauthorized)
            .json({ message: "Not authenticated" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.serverConfig.jwtSecret);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res
            .status(statusCodes_1.StatusCode.Unauthorized)
            .json({ message: "Invalid or expired token" });
    }
};
exports.authenticate = authenticate;
/**
 * Middleware: Checks if the authenticated user has admin privileges
 */
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        return next();
    }
    return res
        .status(statusCodes_1.StatusCode.Forbidden)
        .json({ message: "Admin access required" });
};
exports.isAdmin = isAdmin;
