import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { baseUrl } from "@/constant";

/**
 * Creates a customized baseQuery with built-in token refresh handling.
 * 
 * @param customPath - Specific path to append to the base URL for this query.
 * @returns A baseQuery function that can be used in createApi, with automatic handling of token expiration.
 */
export const createCustomBaseQuery = (
  customPath: string
): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> => {
  // Main base query for specific endpoints (e.g. /auth, /book)
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: `${baseUrl}${customPath}`,
    credentials: "include", // Send cookies with request (for refresh tokens, etc.)
  });

  // Fallback base query for refreshing token
  const refreshBaseQuery = fetchBaseQuery({
    baseUrl: `${baseUrl}`, // Generic root base URL
    credentials: "include",
  });

  // Wrapper function to handle token expiration and retry logic
  return async (args, api, extraOptions) => {
    // Initial request
    let result = await rawBaseQuery(args, api, extraOptions);

    // If access token has expired or is invalid
    if (
      result.error &&
      (result.error.status === 401 || result.error.status === 498 || result.error.status === 419)
    ) {
      console.warn("Access token expired. Attempting refresh...");

      // Attempt to refresh token
      const refreshResult = await refreshBaseQuery(
        {
          url: "/auth/refresh-token",
          method: "POST",
        },
        api,
        extraOptions
      );

      // If refresh successful, retry original request
      if (refreshResult.data) {
        console.info("Refresh successful. Retrying original request...");
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        // If refresh fails, dispatch logout
        console.error("Refresh failed:", refreshResult.error);
        api.dispatch({ type: "auth/logout" });
      }
    }

    // Return final result (either from original or retry)
    return result;
  };
};
