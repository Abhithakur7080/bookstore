import { z } from "zod";
import { createBookSchema } from "./book.validatations";

/**
 * Schema for adding a single item to the cart
 */
export const addToCartSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),

  quantity: z
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
export const mergeCartSchema = z.array(
  z.object({
    product: z.custom<Record<string, any>>(), 
    quantity: z.number().int().min(1, "Quantity must be at least 1"),
    addedAt: z.string().datetime("Invalid date format"),
  })
);
export type MergeCart = z.infer<typeof mergeCartSchema>;
/**
 * Schema for validating product ID from route params (e.g., for removal)
 */
export const cartItemParamSchema = z.object({
  productId: z
    .string()
    .min(1, "Product ID is required")
    .regex(/^[a-fA-F0-9]{24}$/, "Invalid product ID format"),
});
