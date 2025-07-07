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
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = require("./config");
const errorHandler_1 = require("./middlewares/errorHandler");
const mongo_1 = __importDefault(require("./utils/mongo"));
// Route imports
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const book_routes_1 = __importDefault(require("./routes/book.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const author_routes_1 = __importDefault(require("./routes/author.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const contact_routes_1 = __importDefault(require("./routes/contact.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
// import Book from "./models/book.model"; // For syncing indexes if needed
class Server {
    constructor() {
        this.port = process.env.PORT || config_1.serverConfig.port || 10000;
        this.host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
        this.app = (0, express_1.default)();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandler();
    }
    /**
     * Setup essential middlewares for security, parsing, logging, and CORS
    */
    initializeMiddlewares() {
        this.app.use((0, helmet_1.default)({ contentSecurityPolicy: true }));
        // More permissive CORS for development
        const corsOptions = process.env.NODE_ENV === 'production'
            ? { origin: process.env.FRONTEND_URL || true, credentials: true }
            : { origin: true, credentials: true };
        this.app.use((0, cors_1.default)(corsOptions));
        this.app.use(express_1.default.json());
        this.app.use((0, morgan_1.default)(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
        this.app.use((0, cookie_parser_1.default)());
    }
    /**
     * Setup API routes and default root endpoint
     */
    initializeRoutes() {
        this.app.get("/", (req, res) => {
            res.status(200).json({ message: "Welcome to the API!" });
        });
        // Health check endpoint for Render
        this.app.get("/health", (req, res) => {
            res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
        });
        this.app.use("/api/auth", auth_routes_1.default);
        this.app.use("/api/user", user_routes_1.default);
        this.app.use("/api/book", book_routes_1.default);
        this.app.use("/api/category", category_routes_1.default);
        this.app.use("/api/author", author_routes_1.default);
        this.app.use("/api/cart", cart_routes_1.default);
        this.app.use("/api/contact", contact_routes_1.default);
        this.app.use("/api/order", order_routes_1.default);
    }
    /**
     * Global error handler
     */
    initializeErrorHandler() {
        this.app.use(errorHandler_1.errorHandler);
    }
    /**
     * Start server and connect to MongoDB
     */
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, mongo_1.default)();
                // await Book.syncIndexes(); // Optional: Uncomment to sync indexes on developement mode(only one time)
                const server = this.app.listen(Number(this.port), this.host, () => {
                    console.log(`🌐 Server is running on ${this.host}:${this.port}`);
                    console.log(`🔗 Environment: ${process.env.NODE_ENV || 'development'}`);
                    if (process.env.NODE_ENV !== 'production') {
                        console.log(`📱 Local access: http://localhost:${this.port}`);
                    }
                });
                // Apply timeout settings only in production or when specified
                if (process.env.NODE_ENV === 'production' || process.env.APPLY_TIMEOUTS === 'true') {
                    server.keepAliveTimeout = 120000; // 120 seconds
                    server.headersTimeout = 120000; // 120 seconds
                    console.log('⏱️  Server timeout settings applied');
                }
                // Graceful shutdown handlers
                const shutdown = (signal) => {
                    console.log(`🛑 ${signal} received, shutting down gracefully`);
                    server.close(() => {
                        console.log('✅ Process terminated');
                        process.exit(0);
                    });
                };
                process.on('SIGTERM', () => shutdown('SIGTERM'));
                process.on('SIGINT', () => shutdown('SIGINT'));
            }
            catch (error) {
                console.error('❌ Failed to start server:', error);
                process.exit(1);
            }
        });
    }
}
exports.default = new Server().start();
