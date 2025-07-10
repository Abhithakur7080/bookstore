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
const path_1 = __importDefault(require("path"));
// import Book from "./models/book.model"; // For syncing indexes if needed
class Server {
    constructor() {
        this.port = config_1.serverConfig.port;
        this.app = (0, express_1.default)();
        this.initializeMiddlewares();
        this.initializeRoutes();
        // Serve frontend only in production
        if (config_1.serverConfig.env === "production") {
            this.initializeFrontend();
        }
        this.initializeErrorHandler();
    }
    initializeMiddlewares() {
        this.app.use((0, helmet_1.default)({ contentSecurityPolicy: true }));
        this.app.use((0, cors_1.default)({ origin: true, credentials: true }));
        this.app.use(express_1.default.json());
        this.app.use((0, morgan_1.default)("dev"));
        this.app.use((0, cookie_parser_1.default)());
    }
    initializeRoutes() {
        // this.app.get("/", (req, res) => {
        //   res.status(200).json({ message: "Welcome to the API!" });
        // });
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
     * Serve frontend static files in production
     */
    initializeFrontend() {
        const clientDistPath = path_1.default.join(__dirname, "../../client/dist");
        this.app.use(express_1.default.static(clientDistPath));
        this.app.use((req, res, next) => {
            if (!req.path.startsWith('/api')) {
                res.sendFile(path_1.default.join(clientDistPath, "index.html"));
            }
            else {
                next();
            }
        });
    }
    initializeErrorHandler() {
        this.app.use(errorHandler_1.errorHandler);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, mongo_1.default)();
            this.app.listen(this.port, () => {
                console.log(`🌐 Server is running on port ${this.port}`);
            });
        });
    }
}
exports.default = new Server().start();
