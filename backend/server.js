import express from "express";
import cookieParser from "cookie-parser";
import {v2 as cloudinary} from "cloudinary";  
import postRoutes from "./routes/post.routes.js";
 
const app= express();
app.use(express.json()); //to parse req.body
app.use(express.urlencoded({extended:true}));
import connectMongoDb from "./db/connectMongoDb.js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,})
app.use(cookieParser()); //to parse cookies
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/posts",postRoutes);
console.log(process.env.MONGO_URI);
const PORT=process.env.PORT || 5000;
 //to parse urlencoded data
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
    connectMongoDb();
});
