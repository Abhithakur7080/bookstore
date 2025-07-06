import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  BookCreateInput,
  BookUpdateInput,
  BookResponse,
  BookListParams,
  GetBooksResponse,
} from "@/types/book";
import { createCustomBaseQuery } from "./customBaseQuery";
import type { MessageResponse } from "@/types/custom";

/**
 * RTK Query API slice for handling all book-related API calls
 */
export const bookApi = createApi({
  reducerPath: "bookApi", // Unique key for this slice
  baseQuery: createCustomBaseQuery("/book"), // Custom base query with /book as prefix
  tagTypes: ["Book"], // Tag used for cache invalidation
  endpoints: (builder) => ({

    /**
     * Fetch paginated and filtered list of books
     */
    getBooks: builder.query<GetBooksResponse, BookListParams>({
      query: (params) => ({
        url: `/`,
        params,
      }),
      providesTags: ["Book"], // Tag used for cache updates
    }),

    /**
     * Fetch a single book by ID
     */
    getBook: builder.query<BookResponse, string>({
      query: (slug) => `/${slug}`,
      providesTags: (_result, _err, slug) => [{ type: "Book", slug }], // Invalidate only this book on update
    }),

    /**
     * Create a new book
     */
    createBook: builder.mutation<BookResponse, BookCreateInput>({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Book"], // Refetch all books after creation
    }),

    /**
     * Update book details
     */
    updateBook: builder.mutation<BookResponse, BookUpdateInput>({
      query: (data) => ({
        url: `/${data._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { _id }) => [{ type: "Book", id: _id }], // Invalidate the specific book
    }),

    /**
     * Delete a book by ID
     */
    deleteBook: builder.mutation<MessageResponse, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Book"], // Refetch list after deletion
    }),

    /**
     * Toggle book's featured status by ID or slug
     */
    toggleFeatured: builder.mutation<BookResponse, string>({
      query: (id) => ({
        url: `/${id}/featured`,
        method: "PATCH",
      }),
      invalidatesTags: ["Book"], // Refetch to reflect new featured status
    }),

    /**
     * Fetch top 10 featured books
     */
    getFeaturedBooks: builder.query<GetBooksResponse, void>({
      query: () => ({
        url: "/",
        params: { isFeatured: true, limit: 10 },
      }),
    }),

    /**
     * Fetch latest 10 books sorted by published date
     */
    getNewArrivals: builder.query<GetBooksResponse, void>({
      query: () => ({
        url: "/",
        params: { limit: 10, sort: "publishedDate_desc" },
      }),
    }),

    /**
     * Fetch top 10 most purchased books
     */
    getPopularBooks: builder.query<GetBooksResponse, void>({
      query: () => ({
        url: "/",
        params: { sort: "popular", limit: 10 },
      }),
    }),
  }),
});

// Auto-generated React hooks for each API endpoint
export const {
  useGetBooksQuery,
  useGetBookQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useToggleFeaturedMutation,
  useGetFeaturedBooksQuery,
  useGetNewArrivalsQuery,
  useGetPopularBooksQuery,
} = bookApi;
