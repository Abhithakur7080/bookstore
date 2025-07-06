import { Request, Response } from "express";
import Author from "../models/author.model";
import { StatusCode } from "../utils/statusCodes";
import {
  createAuthorSchema,
  updateAuthorSchema,
} from "../validatations/author.validatations";
import { extractZodErrors } from "../utils/zodErrorHelper";

class AuthorController {
  /**
   * Create a new author
   */
  public createAuthor = async (req: Request, res: Response) => {
    const result = createAuthorSchema.safeParse(req.body);
    if (!result.success) {
      const errors = extractZodErrors(result.error.errors);
      return res.status(StatusCode.BadRequest).json({ errors });
    }

    try {
      const exists = await Author.findOne({ name: result.data.name });
      if (exists) {
        return res
          .status(StatusCode.Conflict)
          .json({ message: "Author already exists" });
      }

      const author = await Author.create(result.data);
      return res.status(StatusCode.Created).json({ author });
    } catch (error) {
      console.error("Create Author Error:", error);
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: "Author creation failed" });
    }
  };

  /**
   * Get all authors
   */
  public getAuthors = async (_req: Request, res: Response) => {
    try {
      const authors = await Author.find().sort({ createdAt: -1 });
      const total = authors.length
      return res.status(StatusCode.OK).json({ authors, total });
    } catch (error) {
      console.error("Get Authors Error:", error);
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: "Failed to fetch authors" });
    }
  };

  /**
   * Get single author by ID
   */
  public getAuthor = async (req: Request, res: Response) => {
    try {
      const author = await Author.findById(req.params.id);
      if (!author) {
        return res
          .status(StatusCode.NotFound)
          .json({ message: "Author not found" });
      }
      return res.status(StatusCode.OK).json({ author });
    } catch (error) {
      console.error("Get Author Error:", error);
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: "Failed to fetch author" });
    }
  };

  /**
   * Update author details
   */
  public updateAuthor = async (req: Request, res: Response) => {
    const result = updateAuthorSchema.safeParse(req.body);
    if (!result.success) {
      const errors = extractZodErrors(result.error.errors);
      return res.status(StatusCode.BadRequest).json({ errors });
    }

    try {
      const author = await Author.findByIdAndUpdate(
        req.params.id,
        result.data,
        { new: true, runValidators: true }
      );
      if (!author) {
        return res
          .status(StatusCode.NotFound)
          .json({ message: "Author not found" });
      }
      return res.status(StatusCode.OK).json({ author });
    } catch (error) {
      console.error("Update Author Error:", error);
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: "Failed to update author" });
    }
  };

  /**
   * Delete author
   */
  public deleteAuthor = async (req: Request, res: Response) => {
    try {
      const author = await Author.findByIdAndDelete(req.params.id);
      if (!author) {
        return res
          .status(StatusCode.NotFound)
          .json({ message: "Author not found" });
      }
      return res
        .status(StatusCode.OK)
        .json({ message: "Author deleted successfully" });
    } catch (error) {
      console.error("Delete Author Error:", error);
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: "Failed to delete author" });
    }
  };
}

export default new AuthorController();
