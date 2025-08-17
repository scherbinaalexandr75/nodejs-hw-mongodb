import jwt from 'jsonwebtoken';
import createHttpError from "http-errors";
import User from '../models/user.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startWith("Bearer ")){
      throw createHttpError(401, "Authorization header missing or invalid");
    }
    const token = authHeader.split(" ")[1];

let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw createHttpError(401, "Access token expired");
    }
    throw createHttpError(401, "Invalid access token");
  }

  const user = await User.findById(payload.userId).select("-password");
  if (!user) {
    throw createHttpError(401, "User not found");
  }

  req.user = user;
  next();
} catch (error) {
    next(error);
  }
};