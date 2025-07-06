"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.resetPasswordRequestSchema = exports.verifyEmailQuerySchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
/**
 * User registration validation schema
 */
exports.registerSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .email({ message: "Invalid email address" }),
    password: zod_1.z
        .string()
        .min(6, { message: "Password must be at least 6 characters" })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/, {
        message: "Password must include uppercase, lowercase, number, and special character",
    }),
    fullName: zod_1.z
        .string()
        .min(3, { message: "Full name must be at least 3 characters" }),
    phone: zod_1.z
        .string()
        .regex(/^\d{10}$/, { message: "Phone must be 10 digits" }),
});
/**
 * Login validation schema
 */
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .email({ message: "Invalid email" }),
    password: zod_1.z
        .string()
        .min(1, { message: "Password is required" }),
});
/**
 * Email verification query validation
 */
exports.verifyEmailQuerySchema = zod_1.z.object({
    token: zod_1.z
        .string()
        .min(1, { message: "Token is required" }),
    email: zod_1.z
        .string()
        .email({ message: "Invalid email address" }),
});
/**
 * Request schema for initiating password reset
 */
exports.resetPasswordRequestSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .email({ message: "Invalid email address" }),
});
/**
 * Final password reset validation schema
 */
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z
        .string()
        .min(1, { message: "Token is required" }),
    email: zod_1.z
        .string()
        .email({ message: "Invalid email address" }),
    password: zod_1.z
        .string()
        .min(8, { message: "Password must be at least 8 characters" }),
});
