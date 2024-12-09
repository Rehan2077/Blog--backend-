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
import { sendOtp, verifyOtp } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/logout", logout);

router.get("/profile", isAuthenticated, userProfile);
router.put("/updateProfile", isAuthenticated, updateProfile);
router.put("/updateProfilePicture", isAuthenticated, updateProfilePicture);

router.post("/sendOtp", isAuthenticated, sendOtp);
router.post("/verifyOtp", isAuthenticated, verifyOtp);

export default router;
