/**
 * Represents a book category entity
 */
export interface Category {
  _id?: string;
  name: string;
  slug?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Payload required to create a new category
 */
export interface CategoryCreateInput {
  name: string;
  description?: string;
}

/**
 * Payload to update an existing category (partial update)
 */
export type CategoryUpdateInput = Partial<
CategoryCreateInput & {
    _id: string;
    createdAt: string;
    updatedAt: string;
  }
>;

/**
 * Response structure for a single category
 */
export interface CategoryResponse {
  category: Category;
  message?: string;
}

/**
 * Response shape for a list of categories
 */
export interface CategoryListResponse {
  categories: Category[];
  total?: number;
}
