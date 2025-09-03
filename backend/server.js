// Main server entry point for commitly - a terminal-themed social media app
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Route imports for different app features
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";

// Database connection utility
import connectMongoDB from "./db/connectMongoDb.js";

// Load environment variables from .env file
dotenv.config();

// Configure Cloudinary for image uploads (profile pics, post images)
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Express app setup
const app = express();
const PORT = Number(process.env.PORT) || 5000;
const __dirname = path.resolve();

// Security middleware - relaxed CSP for development
app.use(helmet({
	contentSecurityPolicy: false, 
	crossOriginEmbedderPolicy: false,
}));

// Compression middleware for better performance
app.use(compression());

// Body parsing middleware with 5MB limit for image uploads
app.use(express.json({ limit: "5mb" })); 
app.use(express.urlencoded({ extended: true })); 

// Cookie parsing for JWT authentication
app.use(cookieParser());

// API route handlers for different features
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

// Serve static files and handle React SPA routing in production
const distPath = path.join(__dirname, "/frontend/dist");
if (fs.existsSync(distPath)) {
	// Cache static assets for a year (images, CSS, JS)
	app.use((req, res, next) => {
		if (/\.(?:js|css|png|jpg|jpeg|gif|svg|webp|avif|ico|ttf|woff2?)$/i.test(req.url)) {
			res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
		}
		next();
	});
	app.use(express.static(distPath, { extensions: ["html"], maxAge: "1y", immutable: true }));

	// Catch-all handler for React Router - serves index.html for any route
	app.get("*", (req, res) => {
		res.setHeader("Cache-Control", "no-cache");
		res.sendFile(path.resolve(distPath, "index.html"));
	});
}

// Global error handling middleware
import errorHandler from "./middleware/errorHandler.js";
app.use(errorHandler);

// Start server and connect to MongoDB
app.listen(PORT, '0.0.0.0', () => {
	console.log(`Server is running on port ${PORT}`);
	connectMongoDB();
});