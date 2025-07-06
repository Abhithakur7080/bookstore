import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./auth.service";
import { userApi } from "./user.service";
import { categoryApi } from "./category.service";
import { authorApi } from "./author.service";
import { bookApi } from "./book.service";
import { cartApi } from "./cart.service";
import { contactApi } from "./contact.service";
import { orderApi } from "./order.service";
import cartReducer from "@/features/cartSlice"; 

/**
 * Redux store configuration using RTK (Redux Toolkit)
 * Combines API slices and custom reducers
 */
export const store = configureStore({
  reducer: {
    // Custom reducer for cart state
    cart: cartReducer,

    // Inject API reducers for RTK Query
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [authorApi.reducerPath]: authorApi.reducer,
    [bookApi.reducerPath]: bookApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
  },

  // Adds middleware for each RTK Query API to handle caching, invalidation, polling, etc.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      categoryApi.middleware,
      authorApi.middleware,
      bookApi.middleware,
      cartApi.middleware,
      contactApi.middleware,
      orderApi.middleware
    ),
});

/**
 * Types for accessing state and dispatch with TypeScript
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
