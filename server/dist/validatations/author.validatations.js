"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAuthorSchema = exports.createAuthorSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema to validate payload for creating a new author
 */
exports.createAuthorSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, "Name must be at least 2 characters"),
    bio: zod_1.z
        .string()
        .optional(),
    image: zod_1.z
        .string()
        .url("Image must be a valid URL")
        .optional(),
});
/**
 * Schema to validate payload for updating an existing author
 * All fields are optional to allow partial updates
 */
exports.updateAuthorSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, "Name must be at least 2 characters")
        .optional(),
    bio: zod_1.z
        .string()
        .optional(),
    image: zod_1.z
        .string()
        .url("Image must be a valid URL")
        .optional(),
});
