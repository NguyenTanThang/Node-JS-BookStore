import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import indexRouter from "./routes/index.js";
import booksRouter from "./routes/books.js";
import usersRouter from "./routes/users.js";
import managersRouter from "./routes/managers.js";
import wishlistsRouter from "./routes/wishlists.js";
import reviewsRouter from "./routes/reviews.js";
import ordersRouter from "./routes/orders.js";
import { connectDB } from "./config/db.js";
const __dirname = path.resolve();

dotenv.config();

var app = express();

connectDB();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});

app.use("/api/users", usersRouter);
app.use("/api/books", booksRouter);
app.use("/api/managers", managersRouter);
app.use("/api/wishlists", wishlistsRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/orders", ordersRouter);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

export default app;
