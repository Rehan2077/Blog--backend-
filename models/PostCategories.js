import mongoose from "mongoose";

const postCategoriesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export const PostCategories = mongoose.model(
  "PostCategories",
  postCategoriesSchema
);
