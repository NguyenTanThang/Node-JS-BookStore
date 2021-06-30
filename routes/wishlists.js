import express from "express";
import expressAsyncHandler from "express-async-handler";
import { isAuth, onlyAdminAndStaff } from "../config/jwt.js";
import {
  getAllWishLists,
  getUserWishLists,
  addWishList,
  deleteWishList,
  getWishListByUserIDAndBookID
} from "../controllers/wishlistController";

const wishlistRouter = express.Router();

wishlistRouter.get("/", onlyAdminAndStaff, expressAsyncHandler(getAllWishLists));

wishlistRouter.get("/user-wishlist", isAuth, expressAsyncHandler(getUserWishLists));

wishlistRouter.get("/wishlist/userID/:bookID", isAuth, expressAsyncHandler(getWishListByUserIDAndBookID));

wishlistRouter.post("/add", isAuth, expressAsyncHandler(addWishList));

wishlistRouter.delete(
  "/delete/:bookID",
  isAuth,
  expressAsyncHandler(deleteWishList)
);

export default wishlistRouter;
