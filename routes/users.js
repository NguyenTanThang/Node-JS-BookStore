import express from "express";
import expressAsyncHandler from "express-async-handler";
import { isAuth, onlyAdminAndStaff } from "../config/jwt.js";
import {
  getAllUsers,
  getUserByID,
  signin,
  signup,
  seedUsers,
  getUserProfile,
  validateCustomer,
  addUser,
  editUser
} from "../controllers/userController.js";
import { changePassword } from "../controllers/userPasswordController.js";

const userRouter = express.Router();

userRouter.get("/", expressAsyncHandler(getAllUsers));

userRouter.get(
  "/userID/:userID",
  onlyAdminAndStaff,
  expressAsyncHandler(getUserByID)
);

userRouter.get("/profile", isAuth, expressAsyncHandler(getUserProfile));

userRouter.post("/add", onlyAdminAndStaff, expressAsyncHandler(addUser));

userRouter.post("/signup", expressAsyncHandler(signup));

userRouter.post("/signin", expressAsyncHandler(signin));

//http://localhost:5000/api/users/validate/60d3d1e110f66b300c0d4336
userRouter.get("/validate/:customerID", expressAsyncHandler(validateCustomer));

userRouter.put("/change-password", isAuth, expressAsyncHandler(changePassword));

userRouter.put("/edit/:userID", onlyAdminAndStaff, expressAsyncHandler(editUser));

//userRouter.get("/seed", expressAsyncHandler(seedUsers));

export default userRouter;
