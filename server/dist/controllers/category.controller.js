"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const category_model_1 = __importDefault(require("../models/category.model"));
const statusCodes_1 = require("../utils/statusCodes");
const category_validatations_1 = require("../validatations/category.validatations");
const slugify_1 = __importDefault(require("slugify"));
const zodErrorHelper_1 = require("../utils/zodErrorHelper");
class CategoryController {
    constructor() {
        /**
         * Create a new category
         */
        this.createCategory = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = category_validatations_1.createCategorySchema.safeParse(req.body);
            if (!result.success) {
                const errors = (0, zodErrorHelper_1.extractZodErrors)(result.error.errors);
                return res.status(statusCodes_1.StatusCode.BadRequest).json({ errors });
            }
            try {
                // Generate slug from name if not provided
                const slug = (0, slugify_1.default)(result.data.name, { lower: true, strict: true });
                // Check for existing category with the same slug
                const isExist = yield category_model_1.default.findOne({ slug });
                if (isExist) {
                    return res.status(statusCodes_1.StatusCode.BadRequest).json({
                        message: "Category with this slug already exists",
                    });
                }
                const category = yield category_model_1.default.create(Object.assign(Object.assign({}, result.data), { slug }));
                return res.status(statusCodes_1.StatusCode.Created).json({ category });
            }
            catch (error) {
                console.error("📦 Create Category Error:", error);
                return res
                    .status(statusCodes_1.StatusCode.InternalServerError)
                    .json({ message: "Failed to create category" });
            }
        });
        /**
         * Get all categories
         */
        this.getCategories = (_req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield category_model_1.default.find().sort({ createdAt: -1 });
                const total = categories.length;
                return res.status(statusCodes_1.StatusCode.OK).json({ categories, total });
            }
            catch (error) {
                console.error("📦 Get Categories Error:", error);
                return res
                    .status(statusCodes_1.StatusCode.InternalServerError)
                    .json({ message: "Failed to fetch categories" });
            }
        });
        /**
         * Get single category by ID
         */
        this.getCategory = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const category = yield category_model_1.default.findById(id);
                if (!category) {
                    return res
                        .status(statusCodes_1.StatusCode.NotFound)
                        .json({ message: "Category not found" });
                }
                return res.status(statusCodes_1.StatusCode.OK).json({ category });
            }
            catch (error) {
                console.error("📦 Get Category Error:", error);
                return res
                    .status(statusCodes_1.StatusCode.InternalServerError)
                    .json({ message: "Failed to fetch category" });
            }
        });
        /**
         * Update category by ID
         */
        this.updateCategory = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = category_validatations_1.updateCategorySchema.safeParse(req.body);
            if (!result.success) {
                const errors = (0, zodErrorHelper_1.extractZodErrors)(result.error.errors);
                return res.status(statusCodes_1.StatusCode.BadRequest).json({ errors });
            }
            try {
                const { id } = req.params;
                const category = yield category_model_1.default.findByIdAndUpdate(id, result.data, {
                    new: true,
                    runValidators: true,
                });
                if (!category) {
                    return res
                        .status(statusCodes_1.StatusCode.NotFound)
                        .json({ message: "Category not found" });
                }
                return res.status(statusCodes_1.StatusCode.OK).json({ category });
            }
            catch (error) {
                console.error("✏️ Update Category Error:", error);
                return res
                    .status(statusCodes_1.StatusCode.InternalServerError)
                    .json({ message: "Failed to update category" });
            }
        });
        /**
         * Delete category by ID
         */
        this.deleteCategory = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const category = yield category_model_1.default.findByIdAndDelete(id);
                if (!category) {
                    return res
                        .status(statusCodes_1.StatusCode.NotFound)
                        .json({ message: "Category not found" });
                }
                return res
                    .status(statusCodes_1.StatusCode.OK)
                    .json({ message: "Category deleted successfully" });
            }
            catch (error) {
                console.error("🗑️ Delete Category Error:", error);
                return res
                    .status(statusCodes_1.StatusCode.InternalServerError)
                    .json({ message: "Failed to delete category" });
            }
        });
    }
}
exports.default = new CategoryController();
