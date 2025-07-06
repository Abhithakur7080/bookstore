"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchBooksSchema = exports.updateBookSchema = exports.createBookSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema to validate input for creating a new book
 */
exports.createBookSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(1, "Title is required"),
    author: zod_1.z
        .string()
        .min(1, "Author is required"),
    description: zod_1.z
        .string()
        .optional(),
    price: zod_1.z
        .number()
        .min(0, "Price must be non-negative"),
    discountPrice: zod_1.z
        .number()
        .min(0, "Discount price must be non-negative"),
    categories: zod_1.z
        .array(zod_1.z.string())
        .optional(),
    publishedDate: zod_1.z
        .string()
        .optional(),
    coverImage: zod_1.z
        .string()
        .url("Invalid cover image URL")
        .optional(),
    stock: zod_1.z
        .number()
        .int()
        .min(0, "Stock must be non-negative")
        .optional(),
    isFeatured: zod_1.z
        .boolean()
        .optional(),
    slug: zod_1.z
        .string()
        .optional(),
    publisher: zod_1.z
        .string()
        .min(1, "Publisher is required"),
    ISBN: zod_1.z
        .string()
        .min(10, "ISBN must be at least 10 characters"),
    pages: zod_1.z
        .number()
        .int()
        .min(1, "Pages must be at least 1"),
});
/**
 * Schema to validate input for updating an existing book
 * All fields are optional to support partial updates
 */
exports.updateBookSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).optional(),
    author: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().optional(),
    price: zod_1.z.number().min(0).optional(),
    discountPrice: zod_1.z.number().min(0).optional(),
    categories: zod_1.z.array(zod_1.z.string()).optional(),
    publishedDate: zod_1.z.string().optional(),
    coverImage: zod_1.z.string().url("Invalid cover image URL").optional(),
    stock: zod_1.z.number().int().min(0).optional(),
    isFeatured: zod_1.z.boolean().optional(),
    slug: zod_1.z.string().optional(),
    publisher: zod_1.z.string().min(1).optional(),
    ISBN: zod_1.z.string().min(10).optional(),
    pages: zod_1.z.number().int().min(1).optional(),
});
/**
 * Schema to validate query params for book search
 */
exports.searchBooksSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    author: zod_1.z.string().optional(),
    page: zod_1.z
        .string()
        .regex(/^\d+$/, "Page must be a number")
        .optional(),
    limit: zod_1.z
        .string()
        .regex(/^\d+$/, "Limit must be a number")
        .optional(),
    isFeatured: zod_1.z.string().optional(),
    sort: zod_1.z
        .enum(["createdAt_desc", "publishedDate_desc", "popular"])
        .optional(),
    price: zod_1.z.string().optional(),
    rating: zod_1.z.string().optional(),
});
