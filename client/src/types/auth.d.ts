/**
 * Request body for login
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Response from login endpoint
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  message: string;
}

/**
 * Request body for user registration
 */
export interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

/**
 * Response from registration endpoint
 */
export interface RegisterResponse {
  message: string;
}

/**
 * Request to trigger password reset email
 */
export interface ResetRequest {
  email: string;
}

/**
 * Response after requesting password reset
 */
export interface ResetResponse {
  message: string;
}

/**
 * Request to reset password with token
 */
export interface ResetPasswordRequest {
  email: string;
  token: string;
  password: string;
}

/**
 * Response after password has been reset
 */
export interface ResetPasswordResponse {
  message: string;
}

/**
 * Query parameters for email verification
 */
export interface VerifyEmailRequest {
  token: string;
  email: string;
}

/**
 * Generic API response with optional data
 */
export interface GenericResponse<T = unknown> {
  data?: T;
  message: string;
  [key: string]: unknown;
}
