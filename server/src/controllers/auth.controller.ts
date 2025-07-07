import { Request, Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import User from "../models/user.model";
import { StatusCode } from "../utils/statusCodes";
import {
  loginSchema,
  registerSchema,
  resetPasswordRequestSchema,
  resetPasswordSchema,
  verifyEmailQuerySchema,
} from "../validatations/auth.validatations";
import { serverConfig } from "../config";

class AuthController {
  /**
   * Generates JWT access and refresh tokens
   */
  private generateTokens = (user: any) => {
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      serverConfig.jwtSecret!,
      { expiresIn: serverConfig.jwtExpiration } as SignOptions
    );

    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      serverConfig.jwtRefreshSecret!,
      { expiresIn: serverConfig.jwtRefreshExpiration } as SignOptions
    );

    return { accessToken, refreshToken };
  };

  /**
   * Registers a new user and sends verification email
   */
  public register = async (req: Request, res: Response) => {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path.length > 0) errors[err.path[0] as string] = err.message;
      });
      return res.status(StatusCode.BadRequest).json({ errors });
    }

    const { email, password, fullName, phone } = result.data;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(StatusCode.Conflict).json({ message: "User already registered" });

      const user = new User({ email, password, fullName, phone });
      await user.save();
      await user.sendVerificationEmail();

      const { accessToken, refreshToken } = this.generateTokens(user);

      // Set cookies
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict" as const,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict" as const,
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      return res.status(StatusCode.Created).json({ message: "User created" });
    } catch (error) {
      console.error(error);
      return res.status(StatusCode.InternalServerError).json({ message: "Internal server error" });
    }
  };

  /**
   * Verifies email using token
   */
  public verifyEmail = async (req: Request, res: Response) => {
    const result = verifyEmailQuerySchema.safeParse(req.query);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path.length > 0) errors[err.path[0] as string] = err.message;
      });
      return res.status(StatusCode.BadRequest).json({ errors });
    }

    const { token, email } = result.data;

    try {
      const user = await User.findOne({
        email: decodeURIComponent(email),
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(StatusCode.BadRequest).json({ message: "Invalid or expired token" });
      }

      user.isVerified = true;
      user.emailVerifiedAt = new Date();
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;

      //user meta
      user.loginHistory = user.loginHistory || [];
      user.loginHistory.push({
        ip:
          typeof req.ip === "string"
            ? req.ip
            : typeof req.headers["x-forwarded-for"] === "string"
            ? req.headers["x-forwarded-for"]
            : req.connection.remoteAddress || "Unknown",
        device: req.headers["user-agent"] || "Unknown",
        timestamp: new Date(),
      });

      user.lastLogin = new Date();

      await user.save();
      return res.json({ message: "Email verified successfully" });
    } catch (error) {
      return res.status(StatusCode.InternalServerError).json({ message: "Internal server error" });
    }
  };

  /**
   * Logs in the user, sets access and refresh tokens
   */
  public login = async (req: Request, res: Response) => {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path.length > 0) errors[err.path[0] as string] = err.message;
      });
      return res.status(StatusCode.BadRequest).json({ errors });
    }

    const { email, password } = result.data;

    try {
      const user = await User.findOne({ email }).select("+password");
      if (!user) return res.status(StatusCode.NotFound).json({ message: "User not found" });

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid)
        return res.status(StatusCode.Unauthorized).json({ message: "Invalid password" });

      // Record login info
      user.loginHistory = user.loginHistory || [];
      user.loginHistory.push({
        ip:
          typeof req.ip === "string"
            ? req.ip
            : typeof req.headers["x-forwarded-for"] === "string"
            ? req.headers["x-forwarded-for"]
            : req.connection.remoteAddress || "Unknown",
        device: req.headers["user-agent"] || "Unknown",
        timestamp: new Date(),
      });

      user.lastLogin = new Date();
      await user.save();

      const { accessToken, refreshToken } = this.generateTokens(user);

      // Set cookies
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict" as const,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict" as const,
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      return res.status(StatusCode.OK).json({ accessToken, refreshToken, message: "Login successful" });
    } catch (error) {
      return res.status(StatusCode.InternalServerError).json({ message: "Internal server error" });
    }
  };

  /**
   * Sends password reset email
   */
  public requestPasswordReset = async (req: Request, res: Response) => {
    const result = resetPasswordRequestSchema.safeParse(req.body);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path.length > 0) errors[err.path[0] as string] = err.message;
      });
      return res.status(StatusCode.BadRequest).json({ errors });
    }

    const { email } = result.data;

    try {
      const user = await User.findOne({ email });
      if (user) await user.sendPasswordResetEmail();

      return res.json({
        message: "If that email is registered, a reset link has been sent.",
      });
    } catch (error) {
      return res.status(StatusCode.InternalServerError).json({ message: "Internal server error" });
    }
  };

  /**
   * Resets user password using token
   */
  public resetPassword = async (req: Request, res: Response) => {
    const result = resetPasswordSchema.safeParse(req.body);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path.length > 0) errors[err.path[0] as string] = err.message;
      });
      return res.status(StatusCode.BadRequest).json({ errors });
    }

    const { token, email, password } = result.data;

    try {
      const user = await User.findOne({
        email: decodeURIComponent(email),
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(StatusCode.BadRequest).json({ message: "Invalid or expired token" });
      }

      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return res.json({ message: "Password reset successful" });
    } catch (error) {
      return res.status(StatusCode.InternalServerError).json({ message: "Internal server error" });
    }
  };

  /**
   * Logs the user out by clearing tokens
   */
  public logout = async (_req: Request, res: Response) => {
    try {
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict" as const,
      });

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict" as const,
      });

      return res.status(StatusCode.OK).json({ message: "Logged out successfully" });
    } catch (error) {
      return res.status(StatusCode.InternalServerError).json({ message: "Failed to logout" });
    }
  };

  /**
   * Issues a new access token using a valid refresh token
   */
  public refreshAccessToken = async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        return res.status(StatusCode.Unauthorized).json({ message: "Refresh token missing" });
      }

      const decoded = jwt.verify(refreshToken, serverConfig.jwtRefreshSecret!) as {
        id: string;
        role: string;
      };

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(StatusCode.Unauthorized).json({ message: "User not found" });
      }

      const { accessToken, refreshToken: newRefreshToken } = this.generateTokens(user);

      // Rotate tokens
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict" as const,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict" as const,
        maxAge: 15 * 60 * 1000,
      });

      return res.status(StatusCode.OK).json({ accessToken });
    } catch (error: any) {
      // Clear cookies on error
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      console.error("Refresh failed:", error.message);
      return res.status(StatusCode.Unauthorized).json({ message: "Invalid or expired refresh token" });
    }
  };
}

export default new AuthController();
