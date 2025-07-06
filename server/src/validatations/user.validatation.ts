import { z } from "zod";

/**
 * Schema for validating user profile update data
 * All fields are optional to allow partial updates
 */
export const updateUserSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters")
    .max(100, "Full name must be under 100 characters")
    .optional(),

  phone: z
    .string()
    .regex(/^\d{10}$/, "Phone must be 10 digits")
    .optional(),

  gender: z.enum(["male", "female", "other"]).optional(),

  dob: z.string().optional(),

  avatarUrl: z.string().url("Invalid avatar URL").optional(),

  preferences: z
    .object({
      newsletterSubscribed: z.boolean().optional(),
      favoriteGenres: z.array(z.string()).optional(),
      language: z.string().optional(),
      currency: z.string().optional(),
    })
    .optional(),
});
export const toggleNewsletterSchema = z.object({
  subscribed: z.boolean({
    required_error: "Subscription status is required",
    invalid_type_error: "Subscribed must be a boolean",
  }),
});

export const sendNewsletterSchema = z.object({
  subject: z
    .string({ required_error: "Subject is required" })
    .min(3, "Subject must be at least 3 characters"),

  html: z
    .string({ required_error: "HTML content is required" })
    .min(10, "Newsletter content must be at least 10 characters"),
});
