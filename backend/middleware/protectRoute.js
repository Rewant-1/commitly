import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        // Check if the user exists in the database
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        req.user = user;
        next();
    } catch (err) {
        console.error("Error in protectRoute middleware:", err.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}
