"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartItemParamSchema = exports.mergeCartSchema = exports.addToCartSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema for adding a single item to the cart
 */
exports.addToCartSchema = zod_1.z.object({
    productId: zod_1.z.string().min(1, "Product ID is required"),
    quantity: zod_1.z
        .number({
        required_error: "Quantity is required",
        invalid_type_error: "Quantity must be a number",
    })
        .int("Quantity must be an integer")
        .min(1, "Quantity must be at least 1"),
});
/**
 * Schema for merging guest cart into user cart
 */
exports.mergeCartSchema = zod_1.z.array(zod_1.z.object({
    product: zod_1.z.custom(),
    quantity: zod_1.z.number().int().min(1, "Quantity must be at least 1"),
    addedAt: zod_1.z.string().datetime("Invalid date format"),
}));
/**
 * Schema for validating product ID from route params (e.g., for removal)
 */
exports.cartItemParamSchema = zod_1.z.object({
    productId: zod_1.z
        .string()
        .min(1, "Product ID is required")
        .regex(/^[a-fA-F0-9]{24}$/, "Invalid product ID format"),
});
