import { config } from "dotenv"
import express from "express"
import { connectDB, disconnectDB } from "./src/config/db.js";
import cookieParser from "cookie-parser";

// Import Routes =>
import movieRoutes from "./src/routes/movieRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";

// Initializing App
const app = express();

// Body Parsing Middlewares -
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

config();
connectDB();

// API Routes
app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log("Server is running on PORT : ", PORT);
});

// Handle unhandled rejection
process.on("unhandledRejection", async (err) => {
    console.error("Unhandled Rejection: ", err);
    process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
    console.error("Uncaught Exception: ", err);
    process.exit(1);
});

// Graceful shutdown 
process.on("SIGTERM", async () => {
    console.log("SIGTERM received, shutting down gracefully...");
    server.close(async () => {
        await disconnectDB();
        process.exit(0);
    });
});
