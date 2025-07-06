import { createApi } from "@reduxjs/toolkit/query/react";
import { createCustomBaseQuery } from "./customBaseQuery";
import type { CartItem } from "@/types/cart";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: createCustomBaseQuery("/order"),
  endpoints: (builder) => ({
    // 👉 Stripe Payment Intent
    createPaymentIntent: builder.mutation<{ clientSecret: string }, { amount: number; name: string; address: string }>({
      query: (body) => ({
        url: "/create-payment-intent",
        method: "POST",
        body,
      }),
    }),
    createCheckoutSession: builder.mutation<
  { url: string },
  {
    items: CartItem[];
    name: string;
    address: string;
    totalAmount: number;
  }
>({
  query: (body) => ({
    url: "/create-checkout-session",
    method: "POST",
    body,
  }),
}),

completeStripeOrder: builder.mutation<
  { message: string; order: any },
  { sessionId: string }
>({
  query: ({ sessionId }) => ({
    url: `/complete-stripe-order`,
    method: "POST",
    body: { sessionId },
  }),
}),

    // 👉 Place COD Order
    placeCODOrder: builder.mutation<
      { message: string; order: any },
      {
        items: CartItem[];
        name: string;
        address: string;
        totalAmount: number;
      }
    >({
      query: (body) => ({
        url: "/place-cod-order",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreatePaymentIntentMutation, usePlaceCODOrderMutation, useCreateCheckoutSessionMutation, useCompleteStripeOrderMutation } = orderApi;
