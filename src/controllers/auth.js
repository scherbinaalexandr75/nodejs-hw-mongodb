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

export const login = async (req, res, next) => {
  try{
    const { email, password } = req.body;
    if (!email || !password) {
      throw createHttpError(400, "Email and password are required");
    }
    const { accessToken, refreshToken } = await authService.loginUser({ email, password,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: 200,
      message: "Successfully logged in an user!",
      data: {accessToken },
    });
    } catch (error) {
      next(error);
        }
  };

  export const refresh = async (req, res, next) => {
    try{
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        throw createHttpError (401, "Refresh token is missing");
      }
      const { accessToken, newRefreshToken } = await authService.refreshSession(
        refreshToken
      );

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        status: 200,
        message: "Successfully refreshed a session!",
        data: { accessToken },
      });
    } catch (error) {
      next(error);
    }
  };