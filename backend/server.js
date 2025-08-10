import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import { v2 as cloudinary } from "cloudinary";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";

import connectMongoDB from "./db/connectMongoDb.js";

// Load environment variables from .env in the project root
dotenv.config();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Security headers
app.use(helmet({
	contentSecurityPolicy: false, // keep simple; can be tightened later
	crossOriginEmbedderPolicy: false,
}));

// Compression for faster asset delivery
app.use(compression());

app.use(express.json({ limit: "5mb" })); 
app.use(express.urlencoded({ extended: true })); 

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

if (process.env.NODE_ENV === "production") {
	const distPath = path.join(__dirname, "/frontend/dist");
	// Cache-bust hashed assets aggressively
	app.use((req, res, next) => {
		if (/\.(?:js|css|png|jpg|jpeg|gif|svg|webp|avif|ico|ttf|woff2?)$/i.test(req.url)) {
			res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
		}
		next();
	});
	app.use(express.static(distPath, { extensions: ["html"], maxAge: "1y", immutable: true }));

	// SPA fallback
	app.get("*", (req, res) => {
		res.setHeader("Cache-Control", "no-cache");
		res.sendFile(path.resolve(distPath, "index.html"));
	});
}

// Centralized error handling
import errorHandler from "./middleware/errorHandler.js";
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	connectMongoDB();
});