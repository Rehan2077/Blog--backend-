import mongoose, { Schema } from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    desc: { type: String, required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    // likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    check: { type: Boolean, default: false },
    parent: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
    replyOnUser: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

commentSchema.virtual("replies", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parent",
});

export const Comment = mongoose.model("Comment", commentSchema);
