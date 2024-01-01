import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    avatar: { type: String, default: "" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    verificationCode: { type: String, default: null },
    admin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("Users", userSchema);
