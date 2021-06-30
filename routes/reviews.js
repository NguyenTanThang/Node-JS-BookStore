import express from "express";
import expressAsyncHandler from "express-async-handler";
import { isAuth, onlyAdminAndStaff } from "../config/jwt.js";
import {
  addReview,
  deleteReview,
  getAllReviews,
  getBookReviews,
} from "../controllers/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.get("/", onlyAdminAndStaff, expressAsyncHandler(getAllReviews));

reviewRouter.get(
  "/bookID/:bookID",
  isAuth,
  expressAsyncHandler(getBookReviews)
);

reviewRouter.post("/add", isAuth, expressAsyncHandler(addReview));

reviewRouter.delete(
  "/delete/:bookID",
  isAuth,
  expressAsyncHandler(deleteReview)
);

export default reviewRouter;
