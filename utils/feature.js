import jwt from "jsonwebtoken";

export const sendResponse = (user, res, message, statusCode = 200) => {
  console.log();

  const token = jwt.sign({ id: user._doc._id }, process.env.JWT_SECRET);

  return res.status(statusCode).json({
    success: true,
    message: message,
    user: {
      _id: user._doc._id,
      avatar: user._doc.avatar,
      name: user._doc.name,
      email: user._doc.email,
      verified: user._doc.verified,
      admin: user._doc.admin,
      createdAt: user._doc.createdAt,
      totalPosts: user.totalUserPosts,
      totalComments: user.totalUserComments,
      token,
    },
  });
};
