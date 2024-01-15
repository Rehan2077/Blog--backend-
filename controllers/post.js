import { uploadPicture } from "../middleware/uploadPicture.js";
import { Post } from "../models/Post.js";
import { Comment } from "../models/Comment.js";
import { v4 as uuidv4 } from "uuid";
import { fileRemover } from "../utils/fileRemover.js";

export const createPost = async (req, res, next) => {
  try {
    
    const upload = uploadPicture.single("postPicture");

    let photo = "";

    const handleCreatePostData = async (data) => {
      const { body } = JSON.parse(data);

      const post = await Post.create({
        title: req.body.title || "This is a title",
        caption: "This is a sample caption",
        slug: uuidv4(),
        body: body || "This is a body",
        photo: photo || "this is photo",
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
    };

    upload(req, res, async (error) => {
      if (error) return next(new Error(error));
      else {
        // every thing went well
        if (req.file) {
          photo = req.file.filename;
          handleCreatePostData(req.body.document);
        } else {
          photo = "Photo not provided";
          handleCreatePostData(req.body.document);
        }
      }
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
            try {
              fileRemover(filename);
            } catch (error) {
              console.log(error);
            }
          }
          post.photo = req.file.filename;
          handleUpdatePostData(req.body.document);
        } else {
          post.photo = post.photo;
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

    const totalComments = await Comment.countDocuments({ post: post._id });
    post.views = post.views + 1;
    await post.save();

    res.json({
      success: true,
      message: "Post get successfully",
      totalComments,
      post,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPosts = async (req, res, next) => {
  try {
    // To get all posts->

    // const posts = await Post.find({}).populate([
    //   { path: "author", select: ["name", "avatar", "verified"] },
    // ]);
    // if (!posts) return next(new Error("Posts not found"));

    // res.json({
    //   success: true,
    //   message: "Posts get successfully",
    //   posts,
    // });

    // Extract the search keyword from the request query
    const filter = req.query.searchKeyword;

    // Create an empty object to store the MongoDB query conditions
    let where = {};

    // Check if there's a search keyword, and if so, create a case-insensitive regex query
    if (filter) {
      where.title = { $regex: filter, $options: "i" };
    }

    // Create a MongoDB query to find posts based on the conditions in 'where'
    let query = Post.find(where);

    // Extract the page and page size parameters from the request query, default to 1 and 10, respectively
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const pageSize = Math.max(1, parseInt(req.query.limit) || 10);

    // Calculate the number of documents in the Post collection
    const total = await Post.find(where).countDocuments();

    // Calculate the total number of pages based on the page size
    const pages = Math.ceil(total / pageSize);

    // Set response headers with metadata about the query
    res.header({
      "x-filter": filter,
      "x-totalcount": JSON.stringify(total),
      "x-currentpage": JSON.stringify(page),
      "x-pagesize": JSON.stringify(pageSize),
      "x-totalpagecount": JSON.stringify(pages),
    });

    // If the requested page is greater than the total number of pages, return an error
    if (page > pages) {
      // Here, 'next' is a function provided by Express to move to the next middleware
      return res.json([]);
    }

    // Calculate the number of documents to skip based on the page and page size
    const skip = (page - 1) * pageSize;

    // Execute the MongoDB query, applying skip, limit, and sorting by updatedAt in descending order
    const result = await query
      .skip(skip)
      .limit(pageSize)
      .populate([{ path: "author", select: ["name", "avatar", "verified"] }])
      .sort({ updatedAt: "desc" });

    // Send the results as a JSON response

    res.json({
      success: true,
      message: "Posts get successfully",
      posts: result,
    });
  } catch (error) {
    next(error);
  }
};
