import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import { sendCookies } from "../utils/feature.js";
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
    return res.status(201).json({
      success: true,
      message: "Registered successfully",
    });
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

    sendCookies(user, res, `Welcome back ${user.name}`, 201);
    // console.log(user);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logout successful!",
    });
};

export const userProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne(req.user._id);
    if (!user) return new Error("User not found, login first");
    user.name = name || user.name;
    user.email = email || user.email;
    if (password && password.legth < 6)
      return new Error("Password must be atleast 6 characters in length!");
    else if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword || user.password;
    }
    const updatedUserProfile = await user.save();

    res.json(updatedUserProfile);
  } catch (error) {
    next(error);
  }
};

export const updateProfilePicture = async (req, res, next) => {
  try {
    const upload = uploadPicture.single("profilePicture");
    upload(req, res, async (error) => {
      if (error) return next(new Error(""));
      else {
        console.log(req.file);
        if (req.file) {
          let user = req.user;
          user.avatar = req.file.filename;
          await user.save();
          fileRemover(req.file.filename);
          res.json({
            success: true,
            message: "Avatar added successfully",
            user,
          });
        } else {
          let user = req.user;
          user.avatar = "";
          await user.save();
          fileRemover();
          res.json({
            success: true,
            message: "Avatar removed successfully",
            user,
          });
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
