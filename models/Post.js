import mongoose, { Schema } from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    caption: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    body: { type: Object, required: true },
    photo: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    tags: { type: [String] },
    categories: { type: [Schema.Types.ObjectId], ref: "PostCategories" },
  },
  { timestamps: true }
);

postSchema.virtual("comments", {
    ref: "Comment",
    localField: "_id",
    foreignField: "postId",
})

export const Post = mongoose.model("Post", postSchema);
