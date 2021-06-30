import jwt from "jsonwebtoken";
import userRoles from "../constants/userRoles";

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET || "somethingsecret",
    {
      expiresIn: "30d",
    }
  );
};

export const isAuth = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(403).send({ message: "Missing Token" });
  }
  token = token.split(" ")[1];
  jwt.verify(
    token,
    process.env.JWT_SECRET || "somethingsecret",
    (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Missing Token" });
      }

      req.user = decoded;
      next();
    }
  );
};

export const onlyAdmin = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(403).send({ message: "Missing Token" });
  }
  token = token.split(" ")[1];
  jwt.verify(
    token,
    process.env.JWT_SECRET || "somethingsecret",
    (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Missing Token" });
      }

      req.user = decoded;
      if (decoded.role) {
        if (decoded.role === userRoles.Admin) {
          return next();
        }
      }
      return res.status(403).send({
        message: "You do not have the privelege of accessing this route",
      });
    }
  );
};

export const onlyAdminAndStaff = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(403).send({ message: "Missing Token" });
  }
  token = token.split(" ")[1];
  jwt.verify(
    token,
    process.env.JWT_SECRET || "somethingsecret",
    (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Missing Token" });
      }

      req.user = decoded;
      if (decoded.role) {
        if (
          decoded.role === userRoles.Admin ||
          decoded.role === userRoles.Staff
        ) {
          return next();
        }
      }
      return res.status(403).send({
        message: "You do not have the privelege of accessing this route",
      });
    }
  );
};
