export interface UserPreferences {
  newsletterSubscribed?: boolean;
  language?: string;
  currency?: string;
  favoriteGenres?: string[];
}

export interface Address {
  label?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  isDefault?: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
  addedAt?: string;
}

export interface LoginHistory {
  ip?: string;
  device?: string;
  timestamp?: string;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  gender?: "male" | "female" | "other";
  dob?: string;
  avatarUrl?: string;
  role: "admin" | "user";
  isVerified: boolean;
  emailVerifiedAt?: string;
  addresses?: Address[];
  wishlist?: string[];
  cart?: CartItem[];
  orders?: string[];
  preferences?: UserPreferences;
  loginHistory?: LoginHistory[];
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Generic API response
export interface GenericResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
  user?: T; // for endpoints like /user (me)
  errors?: Record<string, string>;
}

// Input for updating user
export interface UpdateUserInput {
  fullName?: string;
  phone?: string;
  gender?: "male" | "female" | "other";
  dob?: string;
  avatarUrl?: string;
  preferences?: UserPreferences;
}

// Toggle newsletter subscription
export interface ToggleNewsletterInput {
  subscribed: boolean;
}

export interface ToggleNewsletterResponse {
  subscribed: boolean;
}

// Send newsletter (admin)
export interface SendNewsletterInput {
  subject: string;
  html: string;
}

// Admin get all newsletter subscribers
export interface NewsletterSubscribersResponse {
  count: number;
  subscribers: Pick<User, "_id" | "email" | "fullName" | "preferences">[];
}
