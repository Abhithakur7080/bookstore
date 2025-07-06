"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestValidationError = exports.NotFoundError = exports.NotAuthorizedError = exports.DBConnectionError = exports.BadRequestError = exports.CustomError = void 0;
exports.errorHandler = errorHandler;
/**
 * Base Custom Error
 */
class CustomError extends Error {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}
exports.CustomError = CustomError;
/**
 * Bad Request Error
 */
class BadRequestError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = 400;
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
    serializeErrors() {
        return [{ message: this.message }];
    }
}
exports.BadRequestError = BadRequestError;
/**
 * Database Connection Error
 */
class DBConnectionError extends CustomError {
    constructor() {
        super("Error connecting to database.");
        this.statusCode = 500;
        Object.setPrototypeOf(this, DBConnectionError.prototype);
    }
    serializeErrors() {
        return [{ message: "Error connecting to database" }];
    }
}
exports.DBConnectionError = DBConnectionError;
/**
 * Not Authorized Error
 */
class NotAuthorizedError extends CustomError {
    constructor() {
        super("Not Authorized.");
        this.statusCode = 401;
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }
    serializeErrors() {
        return [{ message: "Not Authorized" }];
    }
}
exports.NotAuthorizedError = NotAuthorizedError;
/**
 * Not Found Error
 */
class NotFoundError extends CustomError {
    constructor() {
        super("Not Found Error.");
        this.statusCode = 404;
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
    serializeErrors() {
        return [{ message: "Request resource not found." }];
    }
}
exports.NotFoundError = NotFoundError;
/**
 * Zod Validation Error Handler
 */
class RequestValidationError extends CustomError {
    constructor(errors) {
        super("Validation failed.");
        this.errors = errors;
        this.statusCode = 400;
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
    serializeErrors() {
        return this.errors.errors.map((err) => ({
            message: err.message,
            field: err.path.join("."),
        }));
    }
}
exports.RequestValidationError = RequestValidationError;
/**
 * Global Error Middleware
 */
function errorHandler(err, req, res, next) {
    if (err instanceof CustomError) {
        return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    }
    res.status(400).send({
        errors: [{ message: err.message || "Something went wrong" }],
    });
}
