import mongoose from "mongoose";
import { serverConfig } from "../config";

/**
 * Establish a connection to the MongoDB database.
 */
const connectDB = async (): Promise<void> => {
  try {

    // Attempt to connect to MongoDB
    await mongoose.connect(`${serverConfig.mongoUri}/${serverConfig.mongoDbName}`, {
      maxPoolSize: 20,                      // Maximum number of connections in pool
      minPoolSize: 5,                       // Minimum number of connections in pool
      serverSelectionTimeoutMS: 10000,      // Timeout after 10s if server is unreachable
      socketTimeoutMS: 45000,               // Socket timeout after 45s
      family: 4,                             // IPv4 only
      heartbeatFrequencyMS: 10000,          // Heartbeat frequency for replica set
      retryWrites: true,                    // Retry failed writes
      w: "majority",                        // Write concern: majority
    });

    console.info("✅ MongoDB connected successfully.");
  } catch (error: any) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

/**
 * MongoDB connection event listeners.
 */
mongoose.connection.on("connected", () => {
  console.info("🔌 MongoDB connection established.");
});

mongoose.connection.on("reconnected", () => {
  console.info("🔁 MongoDB reconnected.");
});

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected.");
});

mongoose.connection.on("error", (err: Error) => {
  console.error("🚨 MongoDB connection error:", err.message);
});

/**
 * Handle graceful shutdown on termination signals.
 */
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.info("🛑 MongoDB connection closed due to app termination.");
  process.exit(0);
});

export default connectDB;
