import { Request, Response } from "express";
import Category from "../models/category.model";
import { StatusCode } from "../utils/statusCodes";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validatations/category.validatations";
import slugify from "slugify";
import { extractZodErrors } from "../utils/zodErrorHelper";

class CategoryController {
  /**
   * Create a new category
   */
  public createCategory = async (req: Request, res: Response) => {
    const result = createCategorySchema.safeParse(req.body);
    if (!result.success) {
      const errors = extractZodErrors(result.error.errors);
      return res.status(StatusCode.BadRequest).json({ errors });
    }

    try {
      // Generate slug from name if not provided
      const slug = slugify(result.data.name, { lower: true, strict: true });

      // Check for existing category with the same slug
      const isExist = await Category.findOne({ slug });
      if (isExist) {
        return res.status(StatusCode.BadRequest).json({
          message: "Category with this slug already exists",
        });
      }

      const category = await Category.create({ ...result.data, slug });
      return res.status(StatusCode.Created).json({ category });
    } catch (error) {
      console.error("📦 Create Category Error:", error);
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: "Failed to create category" });
    }
  };

  /**
   * Get all categories
   */
  public getCategories = async (_req: Request, res: Response) => {
    try {
      const categories = await Category.find().sort({ createdAt: -1 });
      const total = categories.length;
      return res.status(StatusCode.OK).json({ categories, total });
    } catch (error) {
      console.error("📦 Get Categories Error:", error);
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: "Failed to fetch categories" });
    }
  };

  /**
   * Get single category by ID
   */
  public getCategory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);
      if (!category) {
        return res
          .status(StatusCode.NotFound)
          .json({ message: "Category not found" });
      }
      return res.status(StatusCode.OK).json({ category });
    } catch (error) {
      console.error("📦 Get Category Error:", error);
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: "Failed to fetch category" });
    }
  };

  /**
   * Update category by ID
   */
  public updateCategory = async (req: Request, res: Response) => {
    const result = updateCategorySchema.safeParse(req.body);
    if (!result.success) {
      const errors = extractZodErrors(result.error.errors);
      return res.status(StatusCode.BadRequest).json({ errors });
    }

    try {
      const { id } = req.params;
      const category = await Category.findByIdAndUpdate(id, result.data, {
        new: true,
        runValidators: true,
      });
      if (!category) {
        return res
          .status(StatusCode.NotFound)
          .json({ message: "Category not found" });
      }
      return res.status(StatusCode.OK).json({ category });
    } catch (error) {
      console.error("✏️ Update Category Error:", error);
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: "Failed to update category" });
    }
  };

  /**
   * Delete category by ID
   */
  public deleteCategory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const category = await Category.findByIdAndDelete(id);
      if (!category) {
        return res
          .status(StatusCode.NotFound)
          .json({ message: "Category not found" });
      }
      return res
        .status(StatusCode.OK)
        .json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("🗑️ Delete Category Error:", error);
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: "Failed to delete category" });
    }
  };
}

export default new CategoryController();
