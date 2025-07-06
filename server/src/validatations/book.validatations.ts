import { z } from "zod";

/**
 * Schema to validate input for creating a new book
 */
export const createBookSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required"),

  author: z
    .string()
    .min(1, "Author is required"),

  description: z
    .string()
    .optional(),

  price: z
    .number()
    .min(0, "Price must be non-negative"),

  discountPrice: z
    .number()
    .min(0, "Discount price must be non-negative"),

  categories: z
    .array(z.string())
    .optional(),

  publishedDate: z
    .string()
    .optional(),

  coverImage: z
    .string()
    .url("Invalid cover image URL")
    .optional(),

  stock: z
    .number()
    .int()
    .min(0, "Stock must be non-negative")
    .optional(),

  isFeatured: z
    .boolean()
    .optional(),

  slug: z
    .string()
    .optional(),

  publisher: z
    .string()
    .min(1, "Publisher is required"),

  ISBN: z
    .string()
    .min(10, "ISBN must be at least 10 characters"),

  pages: z
    .number()
    .int()
    .min(1, "Pages must be at least 1"),
});

/**
 * Schema to validate input for updating an existing book
 * All fields are optional to support partial updates
 */
export const updateBookSchema = z.object({
  title: z.string().min(1).optional(),
  author: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().min(0).optional(),
  discountPrice: z.number().min(0).optional(),
  categories: z.array(z.string()).optional(),
  publishedDate: z.string().optional(),
  coverImage: z.string().url("Invalid cover image URL").optional(),
  stock: z.number().int().min(0).optional(),
  isFeatured: z.boolean().optional(),
  slug: z.string().optional(),
  publisher: z.string().min(1).optional(),
  ISBN: z.string().min(10).optional(),
  pages: z.number().int().min(1).optional(),
});

/**
 * Schema to validate query params for book search
 */
export const searchBooksSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  author: z.string().optional(),
  page: z
    .string()
    .regex(/^\d+$/, "Page must be a number")
    .optional(),

  limit: z
    .string()
    .regex(/^\d+$/, "Limit must be a number")
    .optional(),

  isFeatured: z.string().optional(),

  sort: z
    .enum(["createdAt_desc", "publishedDate_desc", "popular"])
    .optional(),

  price: z.string().optional(),
  rating: z.string().optional(),
});
