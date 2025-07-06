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
const mongoose_1 = __importStar(require("mongoose"));
const argon2_1 = __importDefault(require("argon2"));
const crypto_1 = __importDefault(require("crypto"));
const emailService_1 = require("../utils/emailService");
const config_1 = require("../config");
const userSchema = new mongoose_1.Schema({
    fullName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, "Enter a valid email address"],
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        match: [/^\d{10}$/, "Phone must be 10 digits"],
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
    },
    dob: Date,
    avatarUrl: String,
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    emailVerifiedAt: Date,
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    addresses: [
        {
            label: { type: String, default: "Home" },
            street: String,
            city: String,
            state: String,
            country: String,
            zipCode: String,
            isDefault: { type: Boolean, default: false },
        },
    ],
    wishlist: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Book",
        },
    ],
    cart: [
        {
            productId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Book",
            },
            quantity: { type: Number, default: 1 },
            addedAt: { type: Date, default: Date.now },
        },
    ],
    orders: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Order",
            default: [],
        },
    ],
    preferences: {
        newsletterSubscribed: { type: Boolean, default: false },
        favoriteGenres: [String],
        language: { type: String, default: "en" },
        currency: { type: String, default: "INR" },
    },
    loginHistory: [
        {
            ip: String,
            device: String,
            timestamp: { type: Date, default: Date.now },
        },
    ],
    lastLogin: Date,
}, {
    timestamps: true,
    versionKey: false,
});
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("password")) {
            this.password = yield argon2_1.default.hash(this.password);
        }
        next();
    });
});
userSchema.methods.comparePassword = function (candidatePassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield argon2_1.default.verify(this.password, candidatePassword);
    });
};
userSchema.methods.setPassword = function (plainPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        this.password = yield argon2_1.default.hash(plainPassword);
    });
};
userSchema.methods.sendVerificationEmail = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const verificationToken = crypto_1.default.randomBytes(32).toString("hex");
        this.emailVerificationToken = verificationToken;
        this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
        yield this.save();
        const verificationUrl = `${config_1.serverConfig.frontendUrl}/verify-email?token=${verificationToken}&email=${encodeURIComponent(this.email)}`;
        const html = `
    <h2>Welcome to The Book Store!</h2>
    <p>Please verify your email by clicking the link below:</p>
    <a href="${verificationUrl}">Verify Email</a>
    <p>If you did not create an account, please ignore this email.</p>
  `;
        yield (0, emailService_1.sendMail)({
            to: this.email,
            subject: "Verify your email address",
            html,
        });
    });
};
userSchema.methods.sendPasswordResetEmail = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        this.resetPasswordToken = resetToken;
        this.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
        yield this.save();
        const resetUrl = `${config_1.serverConfig.frontendUrl}/api/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(this.email)}`;
        const html = `
    <h2>Reset Your Password</h2>
    <p>Click the link below to reset your password:</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>If you did not request this, please ignore this email.</p>
  `;
        yield (0, emailService_1.sendMail)({
            to: this.email,
            subject: "Reset your password",
            html,
        });
    });
};
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
