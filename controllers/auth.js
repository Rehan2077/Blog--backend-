import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import crypto from "crypto";

const generateOTP = () => {
  return crypto.randomInt(100000, 999999);
};

export const sendOtp = async (req, res, next) => {
  const email = req.user?.email;

  if (!email) {
    return next(new Error("Email is required!"));
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new Error("User does not exists!"));
    }

    const otp = generateOTP();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      port: 465,
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    transporter.sendMail(
      {
        from: "NEXUS",
        to: email,
        subject: "Verify your NEXUS account",
        text: `Your OTP is ${otp}.`,
      },
      function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      }
    );

    const hashedOTP = await bcrypt.hash(otp.toString(), 10);

    user.verificationCode = hashedOTP;

    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "OTP sent successfully!" });
  } catch (error) {
    return next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  const { otp } = req.body;
  const email = req.user?.email;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new Error("User does not exists!"));
    }

    const isMatched = await bcrypt.compare(
      otp.toString(),
      user.verificationCode
    );

    if (!isMatched) {
      return next(new Error("Invalid OTP!"));
    }

    user.verificationCode = null;
    user.verified = true;

    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "OTP verified successfully!" });
  } catch (error) {
    return next(error);
  }
};
