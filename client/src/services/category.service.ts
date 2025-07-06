import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  CategoryCreateInput,
  CategoryListResponse,
  CategoryResponse,
  CategoryUpdateInput,
} from "@/types/category";
import { createCustomBaseQuery } from "./customBaseQuery";
import type { MessageResponse } from "@/types/custom";

/**
 * RTK Query API slice for handling all category-related API calls
 */
export const categoryApi = createApi({
  reducerPath: "categoryApi", // Unique slice identifier
  baseQuery: createCustomBaseQuery("/category"), // Custom base query with category route prefix
  tagTypes: ["Category"], // Used for tag-based cache invalidation
  endpoints: (builder) => ({

    /**
     * Fetch all categories
     */
    getCategories: builder.query<CategoryListResponse, void>({
      query: () => `/`,
      providesTags: ["Category"], // Caches and refetches this tag when invalidated
    }),

    /**
     * Create a new category
     */
    createCategory: builder.mutation<CategoryResponse, CategoryCreateInput>({
      query: (data) => ({
        url: `/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category"], // Refetches category list after successful creation
    }),

    /**
     * Update an existing category by ID
     */
    updateCategory: builder.mutation<CategoryResponse, CategoryUpdateInput>({
      query: (data) => ({
        url: `/${data._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Category"], // Refetches category list after successful update
    }),

    /**
     * Delete a category by ID
     */
    deleteCategory: builder.mutation<MessageResponse, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"], // Refetches category list after successful deletion
    }),
  }),
});

// Auto-generated hooks for usage in React components
export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
