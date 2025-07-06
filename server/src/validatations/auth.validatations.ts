import { z } from "zod";

/**
 * User registration validation schema
 */
export const registerSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/,
      {
        message:
          "Password must include uppercase, lowercase, number, and special character",
      }
    ),

  fullName: z
    .string()
    .min(3, { message: "Full name must be at least 3 characters" }),

  phone: z
    .string()
    .regex(/^\d{10}$/, { message: "Phone must be 10 digits" }),
});

/**
 * Login validation schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email" }),

  password: z
    .string()
    .min(1, { message: "Password is required" }),
});

/**
 * Email verification query validation
 */
export const verifyEmailQuerySchema = z.object({
  token: z
    .string()
    .min(1, { message: "Token is required" }),

  email: z
    .string()
    .email({ message: "Invalid email address" }),
});

/**
 * Request schema for initiating password reset
 */
export const resetPasswordRequestSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" }),
});

/**
 * Final password reset validation schema
 */
export const resetPasswordSchema = z.object({
  token: z
    .string()
    .min(1, { message: "Token is required" }),

  email: z
    .string()
    .email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});
