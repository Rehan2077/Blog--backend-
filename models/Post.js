import mongoose, { Schema } from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    caption: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    body: { type: Object, required: true },
    photo: { type: String, required: true },
    views: { type: Number, default: 0 },
    author: { type: Schema.Types.ObjectId, ref: "Users" },
    tags: { type: [String] },
    categories: { type: [Schema.Types.ObjectId], ref: "PostCategories" },
  },
  { timestamps: true, toJSON: { virtuals: true }  }
);

postSchema.virtual("comments", {
    ref: "Comments",
    localField: "_id",
    foreignField: "post",
})

export const Post = mongoose.model("Posts", postSchema);
