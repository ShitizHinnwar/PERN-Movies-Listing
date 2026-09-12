import { config } from "dotenv"
import express from "express"
import { connectDB, disconnectDB } from "./src/config/db";

// Import Routes =>
const movieRoutes = require('./src/routes/movieRoutes')

// Initializing App
const app = express();

config();
connectDB();


// API Routes
app.use("/movies", movieRoutes)

const PORT = 5000;
app.listen(PORT, () => {
    console.log("Server is running on PORT : ", PORT)
})

// Handle unhandled rejection
process.on("unhandledRejection", async (err) => {
    console.error("Unhandled Rejection: ", err)
    process.exit(1)
})

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
    console.error("Uncaught Exception: ", err)
    process.exit(1)
})

// Graceful shutdown 
process.on("SIGTERM", async () => {
    console.log("SIGTERM received, shutting down gracefully...");
    server.close(async () => {
        await disconnectDB()
        process.exit(0)
    })
})