import mongoose from "mongoose";

// enum PostCategories {
//   "Development",
//   "Technology",
//   "Entertainment",
//   "Art",
//   "Education",
//   "Medical",
//   "Science",
//   "Legal Studies",
//   "Commernce",
//   "Others",
// }

const postCategoriesSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
  },
  { timestamps: true }
);

export const PostCategories = mongoose.model(
  "PostCategories",
  postCategoriesSchema
);
