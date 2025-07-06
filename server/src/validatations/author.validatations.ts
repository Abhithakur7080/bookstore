import { z } from "zod";

/**
 * Schema to validate payload for creating a new author
 */
export const createAuthorSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters"),

  bio: z
    .string()
    .optional(),

  image: z
    .string()
    .url("Image must be a valid URL")
    .optional(),
});

/**
 * Schema to validate payload for updating an existing author
 * All fields are optional to allow partial updates
 */
export const updateAuthorSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .optional(),

  bio: z
    .string()
    .optional(),

  image: z
    .string()
    .url("Image must be a valid URL")
    .optional(),
});
