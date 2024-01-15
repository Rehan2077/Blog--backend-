import jwt from "jsonwebtoken";

export const sendCookies = (user, res, message, statusCode = 200) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      secure: process.env.NODE_ENV === "development" ? false: true ,
    })
    .json({
      success: true,
      message: message,
      user: {
        _id: user._id,
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        verified: user.verified,
        admin: user.admin,
        createdAt: user.createdAt,
      },
    });
};
