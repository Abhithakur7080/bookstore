import { createApi } from "@reduxjs/toolkit/query/react";
import type { GenericResponse } from "@/types/auth";
import { createCustomBaseQuery } from "./customBaseQuery";

interface User {
  _id: string;
  email: string;
  fullName?: string;
  role: "admin" | "user";
  phone?: string;
  isVerified?: boolean;
  preferences?: {
    newsletterSubscribed?: boolean;
    language?: string;
    currency?: string;
    favoriteGenres?: string[];
  };
}

// Input types
interface ToggleNewsletterInput {
  subscribed: boolean;
}

interface SendNewsletterInput {
  subject: string;
  html: string;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: createCustomBaseQuery("/user"),
  endpoints: (builder) => ({
    // 1️⃣ Get current authenticated user's profile
    me: builder.query<GenericResponse<User>, void>({
      query: () => ({
        url: "/",
        method: "GET",
      }),
    }),

    // 2️⃣ Toggle newsletter subscription (for users)
    toggleNewsletter: builder.mutation<GenericResponse<{ subscribed: boolean }>, ToggleNewsletterInput>({
      query: (data) => ({
        url: "/newsletter/toggle",
        method: "POST",
        body: data,
      }),
    }),

    // 3️⃣ Send newsletter to subscribers (admin only)
    sendNewsletter: builder.mutation<GenericResponse<null>, SendNewsletterInput>({
      query: (data) => ({
        url: "/newsletter/send",
        method: "POST",
        body: data,
      }),
    }),

    // 4️⃣ Get a specific user by ID (admin only)
    getUser: builder.query<GenericResponse<User>, string>({
      query: (userId) => ({
        url: `/${userId}`,
        method: "GET",
      }),
    }),

    // 5️⃣ Get all users (admin only)
    getAllUsers: builder.query<GenericResponse<User[]>, void>({
      query: () => ({
        url: "/all",
        method: "GET",
      }),
    }),
    // Add this inside endpoints: (builder) => ({ ... })
getNewsletterSubscribers: builder.query<
  GenericResponse<{ count: number; subscribers: User[] }>, void>({
  query: () => ({
    url: "/newsletter/subscribers",
    method: "GET",
  }),
}),
  }),
});

export const {
  useMeQuery,
  useToggleNewsletterMutation,
  useSendNewsletterMutation,
  useGetUserQuery,
  useGetAllUsersQuery,
  useGetNewsletterSubscribersQuery
} = userApi;
