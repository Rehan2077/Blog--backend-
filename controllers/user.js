import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import { sendResponse } from "../utils/feature.js";
import { uploadPicture } from "../middleware/uploadPicture.js";
import { fileRemover } from "../utils/fileRemover.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return next(new Error("User already registered!"));

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    sendResponse(user, res, `Registered successfully`, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email }).select("+password");

    if (!user) return next(new Error("User not found"));

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) return next(new Error("Incorrect Password!"));

    sendResponse(user, res, `Welcome back ${user.name}`, 201);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Logout successful!",
  });
};

export const userProfile = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);
    sendResponse(user, res, `User Profile`, 200);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, password, newpassword } = req.body;
    let user = await User.findById(req.user._id);
    if (!user) return next(new Error("User not found, login first"));
    user.name = name || user.name;
    user.email = email || user.email;

    if (password && newpassword) {
      const isMatched = await bcrypt.compare(password, user.password);
      if (!isMatched) return next(new Error("Incorrect current password"));
      else if (newpassword && newpassword === password)
        return next(
          new Error("New password must be different from the current password")
        );
      else if (newpassword.length < 6)
        return next(
          new Error("Password must be atleast 6 characters in length!")
        );
      else if (password === newpassword) {
        return next(new Error("Please enter a new password"));
      } else if (newpassword) {
        const newHashedPassword = await bcrypt.hash(newpassword, 10);
        user.password = newHashedPassword || user.password;
      }
    }
    const updatedUserProfile = await user.save();
    sendResponse(updatedUserProfile, res, `Profile updated successfully`, 200);
  } catch (error) {
    next(error);
  }
};

export const updateProfilePicture = async (req, res, next) => {
  try {
    const upload = uploadPicture.single("profilePicture");
    upload(req, res, async (error) => {
      if (error) return next(new Error(error));
      else {
        console.log(req.file);
        if (req.file) {
          let user = req.user;
          let filename = user.avatar;
          if (filename) await fileRemover(filename);
          user.avatar = req.file.filename;
          await user.save();
          sendResponse(user, res, `Avatar added successfully`, 200);
        } else {
          let user = req.user;
          let filename = user.avatar;
          await fileRemover(filename);
          user.avatar = "";
          await user.save();
          sendResponse(user, res, `Avatar removed successfully`, 200);
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
