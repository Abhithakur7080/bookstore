"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverConfig = void 0;
require("dotenv/config");
const serverConfig = {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || "development",
    mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017",
    mongoDbName: process.env.MONGO_DB_NAME || "bookstore",
    jwtSecret: process.env.JWT_SECRET || "jwt_secret",
    jwtExpiration: process.env.JWT_EXPIRATION || "1h",
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "jwt_refresh_secret",
    jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION || "30d",
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
};
exports.serverConfig = serverConfig;
