"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const bookSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Author",
        required: true,
    },
    publisher: {
        type: String,
        required: true,
    },
    ISBN: {
        type: String,
        required: true,
        unique: true,
        match: [/^(97(8|9))?\d{9}(\d|X)$/, "Invalid ISBN format"],
    },
    categories: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
    ],
    language: {
        type: String,
        default: "English",
    },
    edition: String,
    price: {
        type: Number,
        required: true,
    },
    discountPrice: Number,
    stock: {
        type: Number,
        default: 0,
    },
    publishedDate: {
        type: Date,
        required: true,
    },
    pages: {
        type: Number,
        required: true,
    },
    coverImage: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        default: [],
    },
    ratingsAverage: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
        set: (val) => Math.round(val * 10) / 10,
    },
    ratingsCount: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    tags: {
        type: [String],
        default: [],
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    meta: {
        createdBy: {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        lastUpdatedBy: {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        },
        views: {
            type: Number,
            default: 0,
        },
        purchases: {
            type: Number,
            default: 0,
        },
    },
}, {
    timestamps: true,
    versionKey: false,
});
bookSchema.pre("save", function (next) {
    if (!this.slug) {
        this.slug = (0, slugify_1.default)(this.title, { lower: true, strict: true });
    }
    next();
});
// Update index for text search
bookSchema.index({
    title: "text",
    description: "text",
    tags: "text",
});
const Book = mongoose_1.default.model("Book", bookSchema);
exports.default = Book;
