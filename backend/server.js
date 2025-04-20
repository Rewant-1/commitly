import express from "express";
const app= express();
import mongoose from "mongoose";
import connectMongoDb from "./db/connectMongoDb.js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
dotenv.config();
app.use("/api/auth",authRoutes);
console.log(process.env.MONGO_URI);
const PORT=process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
    connectMongoDb();
});
