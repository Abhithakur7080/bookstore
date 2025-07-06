import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { serverConfig } from "../config";
import { StatusCode } from "../utils/statusCodes";

/**
 * Extends Express Request type to include the decoded user payload
 */
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Middleware: Authenticates user by verifying JWT from cookies or Authorization header
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.cookies?.accessToken ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : undefined);

  if (!token) {
    return res
      .status(StatusCode.Unauthorized)
      .json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, serverConfig.jwtSecret!);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(StatusCode.Unauthorized)
      .json({ message: "Invalid or expired token" });
  }
};

/**
 * Middleware: Checks if the authenticated user has admin privileges
 */
export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res
    .status(StatusCode.Forbidden)
    .json({ message: "Admin access required" });
};
