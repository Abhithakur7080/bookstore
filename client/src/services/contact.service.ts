import { createApi } from "@reduxjs/toolkit/query/react";
import { createCustomBaseQuery } from "./customBaseQuery";
import type { MessageResponse } from "@/types/custom";

interface ContactRequest {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export const contactApi = createApi({
  reducerPath: "contactApi",
  baseQuery: createCustomBaseQuery("/contact"),
  endpoints: (builder) => ({
    sendContactMessage: builder.mutation<MessageResponse, ContactRequest>({
      query: (body) => ({
        url: "/send",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSendContactMessageMutation } = contactApi;
