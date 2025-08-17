import * as authService from "../services/auth.js";
import createHttpError from "http-errors";

export const register = async (req, res, next) => {
  try {
    const {name, email, password } = req.body;

    if( !name || !email || !password) {
      throw createHttpError(400, "Name, email and password are required");
    }

    const newUser = await authService.registerUser({ name, email, password});

    res.status(201).json({
      status: 201,
      message: "Succesfully registered a user!",
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};