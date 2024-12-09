import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDatabase } from "./config/database.js";
import authRoute from "./routes/auth.routes.js";
import employeeRoute from "./routes/employee.routes.js";
import attendanceRoute from "./routes/attendance.routes.js";
import advanceRoute from "./routes/advance.routes.js";
import locationRoute from "./routes/location.routes.js";
import bodyParser from "body-parser";

// Load environment variables
dotenv.config({ path: process.env.ENV_PATH || "./.env" });

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(bodyParser.json());
app.use(cookieParser()); // Parse cookies
app.use(
  cors({
    origin: "*", // Replace "*" with your frontend's URL for better security
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow cookies to be sent
  })
);

// Connect to the database
connectDatabase();

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "API is working" });
});

// API Routes
const apiVersion = "/api/v1";
app.use(`${apiVersion}/auth`, authRoute);
app.use(`${apiVersion}/employee`, employeeRoute);
app.use(`${apiVersion}/attendance`, attendanceRoute);
app.use(`${apiVersion}/advance`, advanceRoute);
app.use(`${apiVersion}/location`, locationRoute);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
