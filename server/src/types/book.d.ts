import { Document, Types } from "mongoose";

/**
 * @interface IBook
 * @extends Document
 * @description Represents the structure of a Book document in MongoDB.
 */
export interface IBook extends Document {
  title: string;                          // Book title
  slug: string;                           // URL-friendly identifier
  description: string;                    // Detailed book description
  author: Types.ObjectId;                // Reference to Author document
  publisher: string;                      // Book publisher name
  ISBN: string;                           // International Standard Book Number
  categories: Types.ObjectId[];          // References to Category documents
  language: string;                       // Language of the book
  edition?: string;                       // Optional edition detail
  price: number;                          // Original price
  discountPrice?: number;                 // Optional discounted price
  stock: number;                          // Number of items in stock
  publishedDate: Date;                    // Date when book was published
  pages: number;                          // Total number of pages
  coverImage: string;                     // Main cover image URL
  images: string[];                       // Additional image URLs
  ratingsAverage: number;                 // Average user rating
  ratingsCount: number;                   // Number of ratings received
  reviews: Types.ObjectId[];             // References to Review documents
  tags: string[];                         // Tags for filtering/search
  isFeatured: boolean;                    // Flag for homepage or promotions

  meta: {
    createdBy: Types.ObjectId;           // Reference to user who created the book
    lastUpdatedBy?: Types.ObjectId;      // Reference to user who last updated it
    views: number;                       // View count for analytics
    purchases: number;                   // Purchase count for analytics
  };

  createdAt?: Date;                       // Timestamp for creation
  updatedAt?: Date;                       // Timestamp for last update
}
