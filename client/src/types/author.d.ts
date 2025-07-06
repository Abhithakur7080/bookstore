/**
 * Represents a book author entity
 */
export interface Author {
  _id?: string;
  name: string;
  bio?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Payload required to create a new author
 */
export interface AuthorCreateInput {
  name: string;
  bio?: string;
  image?: string;
}

/**
 * Payload to update an existing author (partial update)
 */
export type AuthorUpdateInput = Partial<
  AuthorCreateInput & {
    _id: string;
    createdAt: string;
    updatedAt: string;
  }
>;

/**
 * Response structure for a single author
 */
export interface AuthorResponse {
  author: Author;
  message?: string;
}

/**
 * Response shape for a list of authors
 */
export interface AuthorListResponse {
  authors: Author[];
  total?: number;
}
