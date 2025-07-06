import { Request, Response } from "express";
import mongoose from "mongoose";
import Book from "../models/book.model";
import { StatusCode } from "../utils/statusCodes";
import { extractZodErrors } from '../utils/zodErrorHelper';
import {
  createBookSchema,
  searchBooksSchema,
  updateBookSchema,
} from "../validatations/book.validatations";

class BookController {
  /**
   * Create a new book entry in the database
   */
  public createBook = async (req: Request, res: Response) => {
    const result = createBookSchema.safeParse(req.body);
    if (!result.success) {
      return res
        .status(StatusCode.BadRequest)
        .json({ errors: extractZodErrors(result.error.errors) });
    }

    try {
      const { ISBN, categories, author, ...rest } = result.data;

      const isBookExist = await Book.findOne({ ISBN });
      if (isBookExist) {
        return res
          .status(StatusCode.BadRequest)
          .json({ message: "Book ISBN already registered" });
      }

      const book = await Book.create({
        ...rest,
        ISBN,
        author: new mongoose.Types.ObjectId(author),
        categories: categories?.map((id) => new mongoose.Types.ObjectId(id)) || [],
        meta: { createdBy: req.user?.id, views: 0, purchases: 0 },
      });

      return res.status(StatusCode.Created).json({ book });
    } catch (error) {
      console.error("📘 Create Book Error:", error);
      return res.status(StatusCode.InternalServerError).json({ message: "Failed to create book" });
    }
  };

  /**
   * Retrieve books with filters like category, author, price, rating, etc.
   */
  public getBooks = async (req: Request, res: Response) => {
    const result = searchBooksSchema.safeParse(req.query);
    if (!result.success) {
      return res
        .status(StatusCode.BadRequest)
        .json({ errors: extractZodErrors(result.error.errors) });
    }

    try {
      const {
        search,
        category,
        author,
        page = "1",
        limit = "20",
        isFeatured,
        sort,
        price = 1000,
        rating = 0,
      } = result.data;

      const query: any = {};

      if (search) query.$text = { $search: search };
      if (category && category !== "all")
        query.categories = new mongoose.Types.ObjectId(category);
      if (author && author !== "all")
        query.author = new mongoose.Types.ObjectId(author);
      if (isFeatured !== undefined)
        query.isFeatured = isFeatured === "true";

      const maxPrice = Number(price);
      if (Number.isFinite(maxPrice)) query.price = { $lte: maxPrice };

      const minRating = Number(rating);
      if (Number.isFinite(minRating))
        query.ratingsAverage = { $gte: minRating, $lte: 5 };

      const skip = (parseInt(page) - 1) * parseInt(limit);

      let sortOption: Record<string, any> = { createdAt: -1 };
      if (sort === "publishedDate_desc") sortOption = { publishedDate: -1 };
      else if (sort === "popular") sortOption = { "meta.purchases": -1 };

      const books = await Book.find(query)
        .populate("author", "name bio")
        .populate("categories", "name slug")
        .skip(skip)
        .limit(parseInt(limit))
        .sort(sortOption);

      const total = await Book.countDocuments(query);

      return res.status(StatusCode.OK).json({ books, total });
    } catch (error) {
      console.error("📚 Fetch Books Error:", error);
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: "Failed to fetch books" });
    }
  };

  /**
   * Get a single book by its ID
   */
  public getBook = async (req: Request, res: Response) => {
    try {
      const book = await Book.findOne({slug : req.params.slug})
        .populate("author", "name bio")
        .populate("categories", "name slug");

      if (!book) {
        return res
          .status(StatusCode.NotFound)
          .json({ message: "Book not found" });
      }

      return res.status(StatusCode.OK).json({ book });
    } catch (error) {
      console.error("📖 Get Book Error:", error);
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: "Failed to fetch book" });
    }
  };

  /**
   * Update book details by ID
   */
  public updateBook = async (req: Request, res: Response) => {
    const result = updateBookSchema.safeParse(req.body);
    if (!result.success) {
      return res
        .status(StatusCode.BadRequest)
        .json({ errors: extractZodErrors(result.error.errors) });
    }

    try {
      const { id } = req.params;
      const { author, categories, ...rest } = result.data;

      const updateData: any = {
        ...rest,
        ...(author && { author: new mongoose.Types.ObjectId(author) }),
        ...(categories && {
          categories: categories.map((id) => new mongoose.Types.ObjectId(id)),
        }),
        "meta.lastUpdatedBy": req.user?.id,
      };

      const book = await Book.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      })
        .populate("author", "name bio")
        .populate("categories", "name slug");

      if (!book) {
        return res
          .status(StatusCode.NotFound)
          .json({ message: "Book not found" });
      }

      return res.status(StatusCode.OK).json({ book });
    } catch (error) {
      console.error("✏️ Update Book Error:", error);
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: "Failed to update book" });
    }
  };

  /**
   * Delete a book by its ID
   */
  public deleteBook = async (req: Request, res: Response) => {
    try {
      const book = await Book.findByIdAndDelete(req.params.id);
      if (!book) {
        return res
          .status(StatusCode.NotFound)
          .json({ message: "Book not found" });
      }

      return res
        .status(StatusCode.OK)
        .json({ message: "Book deleted successfully" });
    } catch (error) {
      console.error("🗑️ Delete Book Error:", error);
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: "Failed to delete book" });
    }
  };

  /**
   * Toggle book's featured status using ID or slug
   */
  public toggleFeatured = async (req: Request, res: Response) => {
    try {
      const { idOrSlug } = req.params;
      const condition = idOrSlug.match(/^[0-9a-fA-F]{24}$/)
        ? { _id: idOrSlug }
        : { slug: idOrSlug };

      const book = await Book.findOne(condition);
      if (!book) {
        return res
          .status(StatusCode.NotFound)
          .json({ message: "Book not found" });
      }

      book.isFeatured = !book.isFeatured;
      await book.save();

      return res.status(StatusCode.OK).json({ book, message: "Featured books fetched" });
    } catch (error) {
      console.error("⭐ Toggle Featured Error:", error);
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: "Failed to update featured status" });
    }
  };

}

export default new BookController();
