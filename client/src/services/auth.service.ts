import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResetRequest,
  ResetResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyEmailRequest,
  GenericResponse,
} from "@/types/auth";
import { createCustomBaseQuery } from "./customBaseQuery";

/**
 * RTK Query API slice for authentication-related endpoints
 */
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: createCustomBaseQuery("/auth"),
  endpoints: (builder) => ({
    /**
     * Register a new user
     */
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
    }),

    /**
     * Verify user email using token and email
     */
    verifyEmail: builder.query<GenericResponse, VerifyEmailRequest>({
      query: ({ token, email }) => ({
        url: `/verify-email?token=${token}&email=${encodeURIComponent(email)}`,
        method: "GET",
      }),
    }),

    /**
     * Login user with email and password
     */
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),

    /**
     * Request a password reset link
     */
    requestReset: builder.mutation<ResetResponse, ResetRequest>({
      query: (body) => ({
        url: "/request-password-reset",
        method: "POST",
        body,
      }),
    }),

    /**
     * Reset user password using token
     */
    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
      query: (body) => ({
        url: "/reset-password",
        method: "POST",
        body,
      }),
    }),

    /**
     * Logout the current user session
     */
    logout: builder.mutation<GenericResponse, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
  }),
});

// Exporting hooks for component usage
export const {
  useRegisterMutation,
  useVerifyEmailQuery,
  useLoginMutation,
  useRequestResetMutation,
  useResetPasswordMutation,
  useLogoutMutation,
} = authApi;
