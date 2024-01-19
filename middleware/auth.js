import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const isAuthenticated = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1]; //Bearer token
      if (!token) return next(new Error("User not found, login first!"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      next(error);
    }
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    if (req.user && req.user.admin) next();
    else return next(new Error("You are not an admin"));
  } catch (error) {
    next(error);
  }
};
