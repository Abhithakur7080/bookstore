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
  private port: number | string = process.env.PORT || serverConfig.port || 10000;
  private host: string = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

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
   
   // More permissive CORS for development
   const corsOptions = process.env.NODE_ENV === 'production' 
     ? { origin: process.env.FRONTEND_URL || true, credentials: true }
     : { origin: true, credentials: true };
   
   this.app.use(cors(corsOptions));
   this.app.use(express.json());
   this.app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
   this.app.use(cookieParser());
  }

  /**
   * Setup API routes and default root endpoint
   */
  private initializeRoutes() {
    this.app.get("/", (req, res) => {
      res.status(200).json({ message: "Welcome to the API!" });
    });
    
    // Health check endpoint for Render
    this.app.get("/health", (req, res) => {
      res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
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
    try {
      await connectDB();
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
        server.headersTimeout = 120000;   // 120 seconds
        console.log('⏱️  Server timeout settings applied');
      }

      // Graceful shutdown handlers
      const shutdown = (signal: string) => {
        console.log(`🛑 ${signal} received, shutting down gracefully`);
        server.close(() => {
          console.log('✅ Process terminated');
          process.exit(0);
        });
      };

      process.on('SIGTERM', () => shutdown('SIGTERM'));
      process.on('SIGINT', () => shutdown('SIGINT'));

    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }
}

export default new Server().start();