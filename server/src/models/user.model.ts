import mongoose, { Schema, Model } from "mongoose";
import argon2 from "argon2";
import crypto from "crypto";
import { sendMail } from '../utils/emailService';
import { serverConfig } from "../config";
import { IUser } from "../types/user";

const userSchema = new Schema<IUser>(
  {
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
        },
        quantity: { type: Number, default: 1 },
        addedAt: { type: Date, default: Date.now },
      },
    ],

    orders: [
  {
    type: mongoose.Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre<IUser>("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await argon2.hash(this.password);
  }
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await argon2.verify(this.password, candidatePassword);
};

userSchema.methods.setPassword = async function (plainPassword: string): Promise<void> {
  this.password = await argon2.hash(plainPassword);
};
userSchema.methods.sendVerificationEmail = async function (): Promise<void> {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  this.emailVerificationToken = verificationToken;
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
  await this.save();

  const verificationUrl = `${serverConfig.frontendUrl}/verify-email?token=${verificationToken}&email=${encodeURIComponent(this.email)}`;

  const html = `
    <h2>Welcome to The Book Store!</h2>
    <p>Please verify your email by clicking the link below:</p>
    <a href="${verificationUrl}">Verify Email</a>
    <p>If you did not create an account, please ignore this email.</p>
  `;

  await sendMail({
    to: this.email,
    subject: "Verify your email address",
    html,
  });
};
userSchema.methods.sendPasswordResetEmail = async function (): Promise<void> {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = resetToken;
  this.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
  await this.save();

  const resetUrl = `${serverConfig.frontendUrl}/api/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(this.email)}`;
  const html = `
    <h2>Reset Your Password</h2>
    <p>Click the link below to reset your password:</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>If you did not request this, please ignore this email.</p>
  `;

  await sendMail({
    to: this.email,
    subject: "Reset your password",
    html,
  });
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
