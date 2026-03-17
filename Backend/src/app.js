import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import { startInterestCron } from "./utils/interestCron.js";

dotenv.config();

// Fix __dirname (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect DB
connectDB();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// Serve React frontend
app.use(express.static(path.join(__dirname, "../dist")));

// Handle non-API routes (React)
app.get("*", (req, res) => {
  if (!req.originalUrl.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
  }
});

// Start cron
startInterestCron();


app.use(notFound);
app.use(errorHandler);

export default app;