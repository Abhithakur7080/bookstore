import { createApi } from "@reduxjs/toolkit/query/react";
import type { AddToCart, CartItem, GetCarts } from "@/types/cart";
import { createCustomBaseQuery } from "./customBaseQuery";
import type { MessageResponse } from "@/types/custom";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: createCustomBaseQuery("/cart"),
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    getCart: builder.query<GetCarts, void>({
      query: () => "/",
      providesTags: ["Cart"],
    }),

    mergeCart: builder.mutation<GetCarts, CartItem[]>({
      query: (body) => ({
        url: "/merge",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),

    addToCart: builder.mutation<MessageResponse, AddToCart>({
      query: (data) => ({
        url: "/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),

    removeFromCart: builder.mutation<MessageResponse, string>({
      query: (bookId) => ({
        url: `/remove/${bookId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    increaseCartItem: builder.mutation<MessageResponse, string>({
      query: (bookId) => ({
        url: `/increase/${bookId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Cart"],
    }),
    decreaseCartItem: builder.mutation<MessageResponse, string>({
      query: (bookId) => ({
        url: `/decrease/${bookId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Cart"],
    }),

    clearCart: builder.mutation<MessageResponse, void>({
      query: () => ({
        url: "/clear",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useMergeCartMutation,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
  useDecreaseCartItemMutation,
  useIncreaseCartItemMutation,
} = cartApi;
