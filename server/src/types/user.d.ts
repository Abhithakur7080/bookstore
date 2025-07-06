import { Document } from "mongoose";

/**
 * @interface IUser
 * @extends Document
 * @description Defines the structure of a User document in MongoDB.
 */
export interface IUser extends Document {
  // Basic Info
  fullName: string;                       // Full name of the user
  email: string;                          // Unique email address
  password: string;                       // Hashed password
  phone: string;                          // Contact number
  gender?: "male" | "female" | "other";   // Optional gender
  dob?: Date;                             // Optional date of birth
  avatarUrl?: string;                     // Optional profile image

  // Role and Verification
  role: "admin" | "user";                 // User role
  isVerified: boolean;                    // Whether the email is verified
  emailVerifiedAt?: Date;                 // Timestamp of email verification
  emailVerificationToken?: string;        // Token for email verification
  emailVerificationExpires?: Date;        // Expiry of verification token

  // Password Reset
  resetPasswordToken?: string;            // Token for password reset
  resetPasswordExpires?: Date;            // Expiry of reset token

  // Addresses
  addresses: Array<{
    label: string;                        // e.g., "Home", "Office"
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    isDefault: boolean;
  }>;

  // Wishlist & Cart
  wishlist: mongoose.Types.ObjectId[];    // References to Book IDs
  cart: Array<{
    productId: mongoose.Types.ObjectId;   // Reference to a Book ID
    quantity: number;                     // Number of units
    addedAt: Date;                        // When item was added
  }>;

  // Orders
  orders: mongoose.Types.ObjectId[];      // References to Order IDs

  // Payment Methods
  paymentMethods?: Array<{
    type: "card" | "upi" | "wallet";      // Payment type
    provider?: string;                    // Bank, service name, etc.
    last4?: string;                       // Last 4 digits of card
    cardholder?: string;                  // Name on card
    expiry?: string;                      // Expiry in MM/YY
    isDefault?: boolean;                  // Whether it's default
  }>;

  // User Preferences
  preferences?: {
    newsletterSubscribed: boolean;        // Email opt-in
    favoriteGenres?: string[];            // User's preferred genres
    language: string;                     // UI language
    currency: string;                     // Preferred currency
  };

  // Login History
  loginHistory?: Array<{
    ip: string;                           // IP address of login
    device?: string;                      // Device info
    timestamp: Date;                      // Login timestamp
  }>;

  lastLogin?: Date;                       // Most recent login

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Instance Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  setPassword(plainPassword: string): Promise<void>;
  sendVerificationEmail(): Promise<void>;
  sendPasswordResetEmail(): Promise<void>;
}
