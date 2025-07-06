"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractZodErrors = void 0;
/**
 * Helper method to convert Zod validation errors into a key-value format
 */
const extractZodErrors = (errors) => {
    const result = {};
    for (const err of errors) {
        if (err.path.length)
            result[err.path[0]] = err.message;
    }
    return result;
};
exports.extractZodErrors = extractZodErrors;
