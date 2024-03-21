import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import UserModel, { UserDocument } from "../models/user";
const bcrypt = require("bcrypt");

export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const secret_key = authHeader.slice(7);
      const keyValid = await UserModel.findOne({ secret_key });
      if (!keyValid) {
        res.status(403).json({ message: "invalid key" });
      } else {
        next();
      }
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error)
    next(error);
  }
}
