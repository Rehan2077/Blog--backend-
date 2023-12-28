import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import path from "path";

import userRouter from "./routes/user.js";
import { errorMiddleware, invalidPathHandler } from "./middleware/error.js";

export const app = express();
app.use(cors());

app.use(express.json());
app.use(cookieParser());
// app.use(express.urlencoded({ extended: false }));


// static access
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use("/api/v1/users", userRouter);

app.use(invalidPathHandler);
app.use(errorMiddleware);
