import { Document } from "mongoose";

/**
 * @interface IAuthor
 * @extends Document
 * @description Represents the structure of an Author document in MongoDB.
 */
export interface IAuthor extends Document {
  name: string;         // Author's full name
  bio?: string;         // Optional biography or short description
  image?: string;       // Optional profile image URL
  createdAt: Date;      // Document creation timestamp
  updatedAt: Date;      // Document update timestamp
}
