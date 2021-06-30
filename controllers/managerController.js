import Manager from "../models/Manager.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../config/jwt.js";
import userRoles from "../constants/userRoles.js";

export const getAllManagers = async (req, res) => {
  const managers = await Manager.find({role: userRoles.Staff})
    .sort([["createdAt", -1]])
    .exec();
  res.send(managers);
};

export const getManagerByID = async (req, res) => {
  const managerID = req.params.managerID;
  const manager = await Manager.findById(managerID);

  if (!manager) {
    return res.status(404).send({ message: "Manager Not Found" });
  }

  res.send(manager);
};

export const addManager = async (req, res) => {
  let { username, password, role } = req.body;

  password = bcrypt.hashSync(password);

  const manager = new Manager({
    username,
    password,
    role,
  });

  const createdManager = await manager.save();

  res.status(201).send({
    username: createdManager.username,
    role: createdManager.role,
    token: generateToken(createdManager),
  });
};

export const editManager = async (req, res) => {
  const managerID = req.params.managerID;
  const manager = await Manager.findById(managerID);

  if (!manager) {
      res.status(404).send({message: "Manager Not Found"});
  }

  const updatedManager = await Manager.findByIdAndUpdate(managerID, {
      ...req.body
  });

  res.status(200).send(updatedManager);
}


export const signin = async (req, res) => {
  let { username, password } = req.body;

  const existedManager = await Manager.findOne({ username });

  if (
    !existedManager ||
    !bcrypt.compareSync(password, existedManager.password)
  ) {
    return res.status(400).send({ message: "Invalid Credentials" });
  }

  res.status(200).send({
    username: existedManager.username,
    role: existedManager.role,
    token: generateToken(existedManager),
  });
};

export const changePassword = async (req, res) => {
  const managerID = req.user._id;
  let { password, newPassword } = req.body;

  const existedManager = await Manager.findById(managerID);

  if (!existedManager) {
    return res.status(404).send({ message: "Cannot Find User" });
  }

  if (!bcrypt.compareSync(password, existedManager.password)) {
    return res.status(400).send({ message: "Invalid Password" });
  }

  newPassword = bcrypt.hashSync(newPassword);

  const updatedManager = await Manager.findByIdAndUpdate(managerID, {
    password: newPassword,
  });

  res.status(200).send(updatedManager);
};
