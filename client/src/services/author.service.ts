import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  AuthorListResponse,
  AuthorResponse,
  AuthorCreateInput,
  AuthorUpdateInput,
} from "@/types/author";
import type { MessageResponse } from "@/types/custom";
import { createCustomBaseQuery } from "./customBaseQuery";

/**
 * RTK Query API slice for author-related operations
 */
export const authorApi = createApi({
  reducerPath: "authorApi", // Unique key to identify this slice
  baseQuery: createCustomBaseQuery("/author"),  // Custom base query with /author as prefix
  tagTypes: ["Author"], // Used for caching and invalidation
  endpoints: (builder) => ({
    
    /**
     * Fetch all authors
     */
    getAuthors: builder.query<AuthorListResponse, void>({
      query: () => "/",
      providesTags: ["Author"], // Re-fetch if "Author" tag is invalidated
    }),

    /**
     * Fetch a single author by ID
     */
    getAuthor: builder.query<AuthorResponse, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Author", id }], // Tag this author by ID
    }),

    /**
     * Create a new author
     */
    createAuthor: builder.mutation<AuthorResponse, AuthorCreateInput>({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Author"], // Invalidate list to refetch authors
    }),

    /**
     * Update an existing author
     */
    updateAuthor: builder.mutation<AuthorResponse, AuthorUpdateInput>({
      query: (data) => ({
        url: `/${data._id}`, // Use _id to build dynamic route
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { _id }) => [{ type: "Author", id: _id }],
    }),

    /**
     * Delete an author by ID
     */
    deleteAuthor: builder.mutation<MessageResponse, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Author"], // Invalidate list to refetch
    }),
  }),
});

// Auto-generated React hooks for consuming endpoints in components
export const {
  useGetAuthorsQuery,
  useGetAuthorQuery,
  useCreateAuthorMutation,
  useUpdateAuthorMutation,
  useDeleteAuthorMutation,
} = authorApi;
