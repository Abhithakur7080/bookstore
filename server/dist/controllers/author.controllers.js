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
const author_model_1 = __importDefault(require("../models/author.model"));
const statusCodes_1 = require("../utils/statusCodes");
const author_validatations_1 = require("../validatations/author.validatations");
const zodErrorHelper_1 = require("../utils/zodErrorHelper");
class AuthorController {
    constructor() {
        /**
         * Create a new author
         */
        this.createAuthor = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = author_validatations_1.createAuthorSchema.safeParse(req.body);
            if (!result.success) {
                const errors = (0, zodErrorHelper_1.extractZodErrors)(result.error.errors);
                return res.status(statusCodes_1.StatusCode.BadRequest).json({ errors });
            }
            try {
                const exists = yield author_model_1.default.findOne({ name: result.data.name });
                if (exists) {
                    return res
                        .status(statusCodes_1.StatusCode.Conflict)
                        .json({ message: "Author already exists" });
                }
                const author = yield author_model_1.default.create(result.data);
                return res.status(statusCodes_1.StatusCode.Created).json({ author });
            }
            catch (error) {
                console.error("Create Author Error:", error);
                return res
                    .status(statusCodes_1.StatusCode.InternalServerError)
                    .json({ message: "Author creation failed" });
            }
        });
        /**
         * Get all authors
         */
        this.getAuthors = (_req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const authors = yield author_model_1.default.find().sort({ createdAt: -1 });
                const total = authors.length;
                return res.status(statusCodes_1.StatusCode.OK).json({ authors, total });
            }
            catch (error) {
                console.error("Get Authors Error:", error);
                return res
                    .status(statusCodes_1.StatusCode.InternalServerError)
                    .json({ message: "Failed to fetch authors" });
            }
        });
        /**
         * Get single author by ID
         */
        this.getAuthor = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const author = yield author_model_1.default.findById(req.params.id);
                if (!author) {
                    return res
                        .status(statusCodes_1.StatusCode.NotFound)
                        .json({ message: "Author not found" });
                }
                return res.status(statusCodes_1.StatusCode.OK).json({ author });
            }
            catch (error) {
                console.error("Get Author Error:", error);
                return res
                    .status(statusCodes_1.StatusCode.InternalServerError)
                    .json({ message: "Failed to fetch author" });
            }
        });
        /**
         * Update author details
         */
        this.updateAuthor = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = author_validatations_1.updateAuthorSchema.safeParse(req.body);
            if (!result.success) {
                const errors = (0, zodErrorHelper_1.extractZodErrors)(result.error.errors);
                return res.status(statusCodes_1.StatusCode.BadRequest).json({ errors });
            }
            try {
                const author = yield author_model_1.default.findByIdAndUpdate(req.params.id, result.data, { new: true, runValidators: true });
                if (!author) {
                    return res
                        .status(statusCodes_1.StatusCode.NotFound)
                        .json({ message: "Author not found" });
                }
                return res.status(statusCodes_1.StatusCode.OK).json({ author });
            }
            catch (error) {
                console.error("Update Author Error:", error);
                return res
                    .status(statusCodes_1.StatusCode.InternalServerError)
                    .json({ message: "Failed to update author" });
            }
        });
        /**
         * Delete author
         */
        this.deleteAuthor = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const author = yield author_model_1.default.findByIdAndDelete(req.params.id);
                if (!author) {
                    return res
                        .status(statusCodes_1.StatusCode.NotFound)
                        .json({ message: "Author not found" });
                }
                return res
                    .status(statusCodes_1.StatusCode.OK)
                    .json({ message: "Author deleted successfully" });
            }
            catch (error) {
                console.error("Delete Author Error:", error);
                return res
                    .status(statusCodes_1.StatusCode.InternalServerError)
                    .json({ message: "Failed to delete author" });
            }
        });
    }
}
exports.default = new AuthorController();
