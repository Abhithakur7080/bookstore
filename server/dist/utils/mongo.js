"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config");
/**
 * Establish a connection to the MongoDB database.
 */
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Attempt to connect to MongoDB
        yield mongoose_1.default.connect(`${config_1.serverConfig.mongoUri}/${config_1.serverConfig.mongoDbName}`, {
            maxPoolSize: 20, // Maximum number of connections in pool
            minPoolSize: 5, // Minimum number of connections in pool
            serverSelectionTimeoutMS: 10000, // Timeout after 10s if server is unreachable
            socketTimeoutMS: 45000, // Socket timeout after 45s
            family: 4, // IPv4 only
            heartbeatFrequencyMS: 10000, // Heartbeat frequency for replica set
            retryWrites: true, // Retry failed writes
            w: "majority", // Write concern: majority
        });
        console.info("✅ MongoDB connected successfully.");
    }
    catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        process.exit(1);
    }
});
/**
 * MongoDB connection event listeners.
 */
mongoose_1.default.connection.on("connected", () => {
    console.info("🔌 MongoDB connection established.");
});
mongoose_1.default.connection.on("reconnected", () => {
    console.info("🔁 MongoDB reconnected.");
});
mongoose_1.default.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB disconnected.");
});
mongoose_1.default.connection.on("error", (err) => {
    console.error("🚨 MongoDB connection error:", err.message);
});
/**
 * Handle graceful shutdown on termination signals.
 */
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
    console.info("🛑 MongoDB connection closed due to app termination.");
    process.exit(0);
}));
exports.default = connectDB;
