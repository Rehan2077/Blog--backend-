import { Comment } from "../models/Comment.js";

export const createComment = async (req, res, next) => {
  try {
    const { desc, post, parent, replyOnUser } = req.body;
    const author = req.user._id;
    const comment = await Comment.create({
      author,
      desc,
      post,
      parent,
      replyOnUser,
    });

    const savedComment = await comment.save();

    res.json({
      success: true,
      message: "Comment added successfully",
      comment: savedComment,
    });
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const { desc, type } = req.body;

    if (type === "toggle") {
      const comment = await Comment.findById(req.params.commentId);
      if (!comment) return next(new Error("Comment not found"));
      comment.check = !comment.check;
      const updatedComment = await comment.save();
      return res.json({
        success: true,
        message: "Comment updated successfully",
        comment: updatedComment,
      });
    }

    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return next(new Error("Comment not found"));
    comment.desc = desc || comment.desc;
    const updatedComment = await comment.save();
    res.json({
      success: true,
      message: "Comment updated successfully",
      comment: updatedComment,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findByIdAndDelete(commentId);
    await Comment.deleteMany({ parent: comment._id });
    res.json({
      success: true,
      message: "Comment deleted successfully",
      comment,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllComments = async (req, res, next) => {
  
  try {
    const { searchKeyword } = req.query;

    const where = searchKeyword
      ? { desc: { $regex: searchKeyword, $options: "i" } }
      : {};

    const comments = await Comment.find(where)
      .populate([
        { path: "author", select: ["name", "avatar"] },
        { path: "post", select: ["slug"] },
      ])
      .sort({ createdAt: "desc" });

    res.json({
      success: true,
      message: "Comments get successfully",
      comments,
    });
  } catch (error) {
    next(error);
  }
};

// export const toggleComment = async (req, res, next) => {
//   console.log("Entered", req.params.commentId);
//   try {
//     const comment = await Comment.findById(req.params.commentId);
//     if (!comment) return next(new Error("Comment not found"));
//     comment.check = !check;
//     const updatedComment = await comment.save();
//     res.json({
//       success: true,
//       message: "Comment updated successfully",
//       comment: updatedComment,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
