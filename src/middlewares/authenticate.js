import jwt from 'jsonwebtoken';
import User from '../models/users.js';
import createHttpError from 'http-errors';
import Session from '../models/session.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createHttpError(401, 'Authorization header missing or invalid');
    }
    const [, token] = authHeader.split(' ');

    if(!token) {
      throw createHttpError(401, 'Access token missing');
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw createHttpError(401, 'Access token expired');
      }
      throw createHttpError(401, 'Invalid access token');
    }

    const session = await Session.findOne({userId: payload.userId, accessToken: token});
    if (!session){
      throw createHttpError(401, 'Session not found or logged out');
    }

    const user = await User.findById(payload.userId).select('-password');
    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
