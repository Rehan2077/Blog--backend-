import { uploadPicture } from "../middleware/uploadPicture.js";
import { Post } from "../models/Post.js";
import { Comment } from "../models/Comment.js";
import { v4 as uuidv4 } from "uuid";
import { fileRemover } from "../utils/fileRemover.js";

export const createPost = async (req, res, next) => {
  try {
    const post = await Post.create({
      title: "This is a sample post",
      caption: "This is a sample caption",
      slug: uuidv4(),
      body: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Wow, this editor instance exports its content as JSON",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                marks: [
                  {
                    type: "bold",
                  },
                  {
                    type: "italic",
                  },
                ],
                text: "this is a bold text",
              },
            ],
          },
        ],
      },
      photo: "1703845741983-facebook.png",
      author: req.user._id,
      tags: ["tag 1", "tag 2"],
      categories: [],
    });

    await post.save();

    res.json({
      success: true,
      message: "Post created successfully",
      post: post,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const post = await Post.findOne({ slug: slug });
    if (!post) return next(new Error("Post not found"));

    const upload = uploadPicture.single("postPicture");

    const handleUpdatePostData = async (data) => {
      console.log(data);

      const { title, caption, slug, body, tags, categories } = JSON.parse(data);
      post.title = title || post.title;
      post.caption = caption || post.caption;
      post.slug = slug || post.slug;
      post.body = body || post.body;
      post.tags = tags || post.tags;
      post.categories = categories || post.categories;

      const updatedPost = await post.save();

      res.status(200).json({
        success: true,
        message: "Post updated successfully",
        post: updatedPost,
      });
    };

    upload(req, res, async (error) => {
      if (error) return next(new Error(error));
      else {
        // every thing went well
        if (req.file) {
          let filename;
          filename = post.photo;
          if (filename) {
            fileRemover(filename);
          }
          post.photo = req.file.filename;
          handleUpdatePostData(req.body.document);
        } else {
          let filename;
          filename = post.photo;
          post.photo = "";
          fileRemover(filename);
          handleUpdatePostData(req.body.document);
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const post = await Post.findOneAndDelete({ slug: slug });
    if (!post) return next(new Error("Post not found"));

    if (post.photo) {
      fileRemover(post.photo);
    }

    await Comment.deleteMany({ post: post._id });

    res.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const { slug } = req.params;

    //Simple way->
    // const post = await Post.findOne({ slug: slug }).populate("author", "name email avatar verified");

    // Standard way->
    const post = await Post.findOne({ slug }).populate([
      { path: "author", select: ["name", "avatar", "verified"] },
      {
        path: "comments",
        match: { check: true, parent: null },
        populate: [
          {
            path: "author",
            select: ["name", "avatar", "verified"],
          },
          {
            path: "replies",
            match: { check: true },
            populate: [
              { path: "author", select: ["name", "avatar", "verified"] },
            ],
          },
        ],
      },
    ]);

    if (!post) return next(new Error("Post not found"));

    post.views = post.views + 1;
    await post.save();

    res.json({
      success: true,
      message: "Post get successfully",
      post,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({}).populate([
      { path: "author", select: ["name", "avatar", "verified"] },
    ]);
    if (!posts) return next(new Error("Posts not found"));

    res.json({
      success: true,
      message: "Posts get successfully",
      posts,
    });
  } catch (error) {
    next(error);
  }
};
