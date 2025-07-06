import type { Author } from "./author";
import type { Category } from "./category";

/**
 * Full Book entity structure as returned from the API
 */
export interface Book {
  _id: string;
  title: string;
  slug: string;
  description: string;
  author: Author;
  publisher: string;
  ISBN: string;
  categories: Category[];
  language: string;
  edition?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  publishedDate: string; // ISO string
  pages: number;
  coverImage: string;
  images: string[];
  ratingsAverage: number;
  ratingsCount: number;
  reviews: string[]; // review IDs
  tags: string[];
  isFeatured: boolean;
  meta: {
    createdBy: string;
    lastUpdatedBy?: string;
    views: number;
    purchases: number;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Payload required to create a new book
 */
export interface BookCreateInput {
  title: string;
  description: string;
  author: string; // author ID
  publisher: string;
  ISBN: string;
  categories: string[]; // category IDs
  language: string;
  edition?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  publishedDate: string; // ISO format
  pages: number;
  coverImage: string;
  images?: string[];
  tags?: string[];
  isFeatured?: boolean;
}

/**
 * Payload to update an existing book (partial update)
 */
export type BookUpdateInput = Partial<
  BookCreateInput & {
    _id: string;
    createdAt: string;
    updatedAt: string;
  }
>;

/**
 * Query parameters accepted when fetching a list of books
 */
export interface BookListParams {
  search?: string;
  author?: string;
  category?: string;
  price?: string | number;
  page?: string | number;
  limit?: string | number;
  rating?: string | number;
  isFeatured?: string | boolean;
  sort?: string;
}

/**
 * Response for a single book fetch
 */
export interface BookResponse {
  book: Book;
  message?: string;
}

/**
 * Response structure when fetching a list of books
 */
export interface GetBooksResponse {
  books: Book[];
  total?: number;
}
