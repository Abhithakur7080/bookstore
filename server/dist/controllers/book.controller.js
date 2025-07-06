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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const book_model_1 = __importDefault(require("../models/book.model"));
const statusCodes_1 = require("../utils/statusCodes");
const zodErrorHelper_1 = require("../utils/zodErrorHelper");
const book_validatations_1 = require("../validatations/book.validatations");
class BookController {
    constructor() {
        /**
         * Create a new book entry in the database
         */
        this.createBook = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const result = book_validatations_1.createBookSchema.safeParse(req.body);
            if (!result.success) {
                return res
                    .status(statusCodes_1.StatusCode.BadRequest)
                    .json({ errors: (0, zodErrorHelper_1.extractZodErrors)(result.error.errors) });
            }
            try {
                const _b = result.data, { ISBN, categories, author } = _b, rest = __rest(_b, ["ISBN", "categories", "author"]);
                const isBookExist = yield book_model_1.default.findOne({ ISBN });
                if (isBookExist) {
                    return res
                        .status(statusCodes_1.StatusCode.BadRequest)
                        .json({ message: "Book ISBN already registered" });
                }
                const book = yield book_model_1.default.create(Object.assign(Object.assign({}, rest), { ISBN, author: new mongoose_1.default.Types.ObjectId(author), categories: (categories === null || categories === void 0 ? void 0 : categories.map((id) => new mongoose_1.default.Types.ObjectId(id))) || [], meta: { createdBy: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id, views: 0, purchases: 0 } }));
                return res.status(statusCodes_1.StatusCode.Created).json({ book });
            }
            catch (error) {
                console.error("📘 Create Book Error:", error);
                return res.status(statusCodes_1.StatusCode.InternalServerError).json({ message: "Failed to create book" });
            }
        });
        /**
         * Retrieve books with filters like category, author, price, rating, etc.
         */
        this.getBooks = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = book_validatations_1.searchBooksSchema.safeParse(req.query);
            if (!result.success) {
                return res
                    .status(statusCodes_1.StatusCode.BadRequest)
                    .json({ errors: (0, zodErrorHelper_1.extractZodErrors)(result.error.errors) });
            }
            try {
                const { search, category, author, page = "1", limit = "20", isFeatured, sort, price = 1000, rating = 0, } = result.data;
                const query = {};
                if (search)
                    query.$text = { $search: search };
                if (category && category !== "all")
                    query.categories = new mongoose_1.default.Types.ObjectId(category);
                if (author && author !== "all")
                    query.author = new mongoose_1.default.Types.ObjectId(author);
                if (isFeatured !== undefined)
                    query.isFeatured = isFeatured === "true";
                const maxPrice = Number(price);
                if (Number.isFinite(maxPrice))
                    query.price = { $lte: maxPrice };
                const minRating = Number(rating);
                if (Number.isFinite(minRating))
                    query.ratingsAverage = { $gte: minRating, $lte: 5 };
                const skip = (parseInt(page) - 1) * parseInt(limit);
                let sortOption = { createdAt: -1 };
                if (sort === "publishedDate_desc")
                    sortOption = { publishedDate: -1 };
                else if (sort === "popular")
                    sortOption = { "meta.purchases": -1 };
                const books = yield book_model_1.default.find(query)
                    .populate("author", "name bio")
                    .populate("categories", "name slug")
                    .skip(skip)
                    .limit(parseInt(limit))
                    .sort(sortOption);
                const total = yield book_model_1.default.countDocuments(query);
                return res.status(statusCodes_1.StatusCode.OK).json({ books, total });
            }
            catch (error) {
                console.error("📚 Fetch Books Error:", error);
                return res
                    .status(statusCodes_1.StatusCode.InternalServerError)
                    .json({ message: "Failed to fetch books" });
            }
        });
        /**
         * Get a single book by its ID
         */
        this.getBook = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const book = yield book_model_1.default.findOne({ slug: req.params.slug })
                    .populate("author", "name bio")
                    .populate("categories", "name slug");
                if (!book) {
                    return res
                        .status(statusCodes_1.StatusCode.NotFound)
                        .json({ message: "Book not found" });
                }
                return res.status(statusCodes_1.StatusCode.OK).json({ book });
            }
            catch (error) {
                console.error("📖 Get Book Error:", error);
                return res
                    .status(statusCodes_1.StatusCode.InternalServerError)
                    .json({ message: "Failed to fetch book" });
            }
        });
        /**
         * Update book details by ID
         */
        this.updateBook = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const result = book_validatations_1.updateBookSchema.safeParse(req.body);
            if (!result.success) {
                return res
                    .status(statusCodes_1.StatusCode.BadRequest)
                    .json({ errors: (0, zodErrorHelper_1.extractZodErrors)(result.error.errors) });
            }
            try {
                const { id } = req.params;
                const _b = result.data, { author, categories } = _b, rest = __rest(_b, ["author", "categories"]);
                const updateData = Object.assign(Object.assign(Object.assign(Object.assign({}, rest), (author && { author: new mongoose_1.default.Types.ObjectId(author) })), (categories && {
                    categories: categories.map((id) => new mongoose_1.default.Types.ObjectId(id)),
                })), { "meta.lastUpdatedBy": (_a = req.user) === null || _a === void 0 ? void 0 : _a.id });
                const book = yield book_model_1.default.findByIdAndUpdate(id, updateData, {
                    new: true,
                    runValidators: true,
                })
                    .populate("author", "name bio")
                    .populate("categories", "name slug");
                if (!book) {
                    return res
                        .status(statusCodes_1.StatusCode.NotFound)
                        .json({ message: "Book not found" });
                }
                return res.status(statusCodes_1.StatusCode.OK).json({ book });
            }
            catch (error) {
                console.error("✏️ Update Book Error:", error);
                return res
                    .status(statusCodes_1.StatusCode.InternalServerError)
                    .json({ message: "Failed to update book" });
            }
        });
        /**
         * Delete a book by its ID
         */
        this.deleteBook = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const book = yield book_model_1.default.findByIdAndDelete(req.params.id);
                if (!book) {
                    return res
                        .status(statusCodes_1.StatusCode.NotFound)
                        .json({ message: "Book not found" });
                }
                return res
                    .status(statusCodes_1.StatusCode.OK)
                    .json({ message: "Book deleted successfully" });
            }
            catch (error) {
                console.error("🗑️ Delete Book Error:", error);
                return res
                    .status(statusCodes_1.StatusCode.InternalServerError)
                    .json({ message: "Failed to delete book" });
            }
        });
        /**
         * Toggle book's featured status using ID or slug
         */
        this.toggleFeatured = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { idOrSlug } = req.params;
                const condition = idOrSlug.match(/^[0-9a-fA-F]{24}$/)
                    ? { _id: idOrSlug }
                    : { slug: idOrSlug };
                const book = yield book_model_1.default.findOne(condition);
                if (!book) {
                    return res
                        .status(statusCodes_1.StatusCode.NotFound)
                        .json({ message: "Book not found" });
                }
                book.isFeatured = !book.isFeatured;
                yield book.save();
                return res.status(statusCodes_1.StatusCode.OK).json({ book, message: "Featured books fetched" });
            }
            catch (error) {
                console.error("⭐ Toggle Featured Error:", error);
                return res
                    .status(statusCodes_1.StatusCode.InternalServerError)
                    .json({ message: "Failed to update featured status" });
            }
        });
    }
}
exports.default = new BookController();
