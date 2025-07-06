import "dotenv/config";
import express, { ErrorRequestHandler } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { serverConfig } from "./config";
import { errorHandler } from "./middlewares/errorHandler";
import connectDB from "./utils/mongo";

// Route imports
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import bookRoutes from "./routes/book.routes";
import categoryRoutes from "./routes/category.routes";
import authorRoutes from "./routes/author.routes";
import cartRoutes from "./routes/cart.routes";
import contactRoutes from "./routes/contact.routes";
import orderRoutes from "./routes/order.routes";
// import Book from "./models/book.model"; // For syncing indexes if needed

class Server {
  private app: express.Application;
  private port: number | string = serverConfig.port;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandler();
  }

  /**
   * Setup essential middlewares for security, parsing, logging, and CORS
  */
 private initializeMiddlewares() {
   this.app.use(helmet({ contentSecurityPolicy: true }));
   this.app.use(cors({ origin: true, credentials: true }));
   this.app.use(express.json());
    this.app.use(morgan("dev"));
    this.app.use(cookieParser());
  }

  /**
   * Setup API routes and default root endpoint
   */
  private initializeRoutes() {
    this.app.get("/", (req, res) => {
      res.status(200).json({ message: "Welcome to the API!" });
    });
    
    this.app.use("/api/auth", authRoutes);
    this.app.use("/api/user", userRoutes);
    this.app.use("/api/book", bookRoutes);
    this.app.use("/api/category", categoryRoutes);
    this.app.use("/api/author", authorRoutes);
    this.app.use("/api/cart", cartRoutes);
    this.app.use("/api/contact", contactRoutes);
    this.app.use("/api/order", orderRoutes);
  }

  /**
   * Global error handler
   */
  private initializeErrorHandler() {
    this.app.use(errorHandler as ErrorRequestHandler);
  }

  /**
   * Start server and connect to MongoDB
   */
  public async start() {
    await connectDB();
    // await Book.syncIndexes(); // Optional: Uncomment to sync indexes on developement mode(only one time)
    this.app.listen(this.port, () => {
      console.log(`🌐 Server is running on port ${this.port}`);
    });
  }
}

export default new Server().start();
