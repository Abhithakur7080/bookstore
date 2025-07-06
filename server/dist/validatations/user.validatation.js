"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNewsletterSchema = exports.toggleNewsletterSchema = exports.updateUserSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema for validating user profile update data
 * All fields are optional to allow partial updates
 */
exports.updateUserSchema = zod_1.z.object({
    fullName: zod_1.z
        .string()
        .min(3, "Full name must be at least 3 characters")
        .max(100, "Full name must be under 100 characters")
        .optional(),
    phone: zod_1.z
        .string()
        .regex(/^\d{10}$/, "Phone must be 10 digits")
        .optional(),
    gender: zod_1.z.enum(["male", "female", "other"]).optional(),
    dob: zod_1.z.string().optional(),
    avatarUrl: zod_1.z.string().url("Invalid avatar URL").optional(),
    preferences: zod_1.z
        .object({
        newsletterSubscribed: zod_1.z.boolean().optional(),
        favoriteGenres: zod_1.z.array(zod_1.z.string()).optional(),
        language: zod_1.z.string().optional(),
        currency: zod_1.z.string().optional(),
    })
        .optional(),
});
exports.toggleNewsletterSchema = zod_1.z.object({
    subscribed: zod_1.z.boolean({
        required_error: "Subscription status is required",
        invalid_type_error: "Subscribed must be a boolean",
    }),
});
exports.sendNewsletterSchema = zod_1.z.object({
    subject: zod_1.z
        .string({ required_error: "Subject is required" })
        .min(3, "Subject must be at least 3 characters"),
    html: zod_1.z
        .string({ required_error: "HTML content is required" })
        .min(10, "Newsletter content must be at least 10 characters"),
});
