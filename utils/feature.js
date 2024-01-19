import jwt from "jsonwebtoken";

export const sendResponse = (user, res, message, statusCode = 200) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  return res
    .status(statusCode)
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
        token
      },
    });
};
