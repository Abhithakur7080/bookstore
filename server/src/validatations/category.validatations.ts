import { z } from "zod";

/**
 * Schema for validating category creation input
 */
export const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters"),
  description: z
    .string()
    .optional(),
});

/**
 * Schema for validating category update input
 * All fields are optional to support partial updates
 */
export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .optional(),
  description: z
    .string()
    .optional(),
});
