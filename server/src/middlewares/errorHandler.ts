import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

/**
 * Base Custom Error
 */
export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}

/**
 * Bad Request Error
 */
export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

/**
 * Database Connection Error
 */
export class DBConnectionError extends CustomError {
  statusCode = 500;

  constructor() {
    super("Error connecting to database.");
    Object.setPrototypeOf(this, DBConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: "Error connecting to database" }];
  }
}

/**
 * Not Authorized Error
 */
export class NotAuthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super("Not Authorized.");
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: "Not Authorized" }];
  }
}

/**
 * Not Found Error
 */
export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super("Not Found Error.");
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: "Request resource not found." }];
  }
}

/**
 * Zod Validation Error Handler
 */
export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ZodError) {
    super("Validation failed.");
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.errors.map((err) => ({
      message: err.message,
      field: err.path.join("."),
    }));
  }
}

/**
 * Global Error Middleware
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  res.status(400).send({
    errors: [{ message: err.message || "Something went wrong" }],
  });
}
