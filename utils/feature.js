import jwt from "jsonwebtoken";

export const sendCookies = (user, res, message, statusCode = 200) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      secure: true,
    })
    .json({
      success: true,
      message: message,
    });
};
