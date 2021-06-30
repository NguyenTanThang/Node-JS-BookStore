import express from "express";
import expressAsyncHandler from "express-async-handler";
import { onlyAdminAndStaff } from "../config/jwt.js";
import {
  addManager,
  changePassword,
  editManager,
  getAllManagers,
  getManagerByID,
  signin,
} from "../controllers/managerController.js";

const managerRouter = express.Router();

managerRouter.get("/", onlyAdminAndStaff, expressAsyncHandler(getAllManagers));

managerRouter.get(
  "/managerID/:managerID",
  onlyAdminAndStaff,
  expressAsyncHandler(getManagerByID)
);

managerRouter.post("/add", onlyAdminAndStaff, expressAsyncHandler(addManager));

managerRouter.post("/signin", expressAsyncHandler(signin));

managerRouter.put(
  "/change-password",
  onlyAdminAndStaff,
  expressAsyncHandler(changePassword)
);

managerRouter.put("/edit/:managerID", onlyAdminAndStaff, expressAsyncHandler(editManager));

//managerRouter.get("/seed", expressAsyncHandler(seedUsers));

export default managerRouter;
