import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import userRouter from "./routes/user.js";
import postRouter from "./routes/post.js";
import commentRouter from "./routes/comment.js";
import { errorMiddleware, invalidPathHandler } from "./middleware/error.js";

export const app = express();
app.set("trust proxy", 1);
app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:3000'],
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// static access
const __dirname = path.resolve();
app.use("/uploads", express.static(__dirname + "/uploads"));

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);

app.use(invalidPathHandler);
app.use(errorMiddleware);
