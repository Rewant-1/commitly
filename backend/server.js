import express from "express";
import cookieParser from "cookie-parser";  
 
const app= express();
app.use(express.json()); //to parse req.body
app.use(express.urlencoded({extended:true}));
import connectMongoDb from "./db/connectMongoDb.js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
dotenv.config();
app.use(cookieParser()); //to parse cookies
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
console.log(process.env.MONGO_URI);
const PORT=process.env.PORT || 5000;
 //to parse urlencoded data
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
    connectMongoDb();
});
