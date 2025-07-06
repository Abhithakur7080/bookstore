import { Document } from "mongoose";

/**
 * @interface ICategory
 * @extends Document
 * @description Represents the structure of a Category document in MongoDB.
 */
export interface ICategory extends Document {
  name: string;            // Category name (must be unique)
  slug: string;            // URL-friendly identifier for the category
  description?: string;    // Optional description of the category
  createdAt: Date;         // Timestamp for when the category was created
  updatedAt: Date;         // Timestamp for the last update
}
