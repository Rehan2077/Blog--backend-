import mongoose, { Schema } from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    desc: { type: String, required: true },
    post: { type: Schema.Types.ObjectId, ref: "Posts", required: true },
    // likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    check: { type: Boolean, default: false },
    parent: { type: Schema.Types.ObjectId, ref: "Comments", default: null },
    replyOnUser: { type: Schema.Types.ObjectId, ref: "Users", default: null },
  },
  { timestamps: true, toJSON: { virtuals: true }  }
);

commentSchema.virtual("replies", {
  ref: "Comments",
  localField: "_id",
  foreignField: "parent",
});

export const Comment = mongoose.model("Comments", commentSchema);
