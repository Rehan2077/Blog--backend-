import express from "express";
import {
  login,
  logout,
  register,
  updateProfile,
  updateProfilePicture,
  userProfile,
} from "../controllers/user.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/logout", isAuthenticated, logout);

router.get("/profile", isAuthenticated, userProfile);
router.put("/updateProfile", isAuthenticated, updateProfile);
router.put("/updateProfilePicture", isAuthenticated,  updateProfilePicture);

export default router;
