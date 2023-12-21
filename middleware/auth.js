import jwt from "jsonwebtoken"
import { User } from "../models/User.js";

export const isAuthenticated = async (req, res, next)=>{
    try {
        const {token} = req.cookies;
        if(!token) return next(new Error("User not found, login first!"))

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();

    } catch (error) {
        next(error)
    }
} 