"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
/**
 * Schema for validating category creation input
 */
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, "Category name must be at least 2 characters"),
    description: zod_1.z
        .string()
        .optional(),
});
/**
 * Schema for validating category update input
 * All fields are optional to support partial updates
 */
exports.updateCategorySchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, "Category name must be at least 2 characters")
        .optional(),
    description: zod_1.z
        .string()
        .optional(),
});
