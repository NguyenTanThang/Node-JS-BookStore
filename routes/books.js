import express from "express";
import expressAsyncHandler from "express-async-handler";
import { isAuth, onlyAdminAndStaff } from "../config/jwt.js";
import {
  getAllBooks,
  seedBooks,
  getBookByID,
  addBook,
  editBook,
  deleteBook,
  getBooksRecSection,
  getBooksRandom
} from "../controllers/bookController.js";

const bookRouter = express.Router();

bookRouter.get("/", expressAsyncHandler(getAllBooks));

bookRouter.get("/rec-section", expressAsyncHandler(getBooksRecSection));

bookRouter.get("/random", expressAsyncHandler(getBooksRandom));

bookRouter.get("/bookID/:bookID", expressAsyncHandler(getBookByID));

bookRouter.post("/add", onlyAdminAndStaff, expressAsyncHandler(addBook));

bookRouter.put("/edit/:bookID", onlyAdminAndStaff, expressAsyncHandler(editBook));

bookRouter.delete("/delete/:bookID", onlyAdminAndStaff, expressAsyncHandler(deleteBook));

//bookRouter.get("/seed", expressAsyncHandler(seedBooks));

export default bookRouter;
