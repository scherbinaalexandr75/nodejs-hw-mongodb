import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/users.js';
import createHttpError from 'http-errors';
import Session from '../models/session.js';
// import { sendEmail } from '../utils/sendEmail.js';

const ACCESS_TOKEN_EXPIRES = '15m';
const REFRESH_TOKEN_EXPIRES = '30d';

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const userObject = user.toObject();
  delete userObject.password;

  return userObject;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES,
  });

  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES },
  );

  await Session.deleteOne({ userId: user._id });

  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
  });

  return { accessToken, refreshToken };
};

export const refreshSession = async (refreshToken) => {
  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw createHttpError(401, 'Invalid refresh token');
  }

  const session = await Session.findOne({
    userId: payload.userId,
    refreshToken,
  });
  if (!session) {
    throw createHttpError(401, 'Session not found or already invalidated');
  }

  await Session.deleteOne({ userId: payload.userId });

  const accessToken = jwt.sign(
    { userId: payload.userId },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES },
  );

  const newRefreshToken = jwt.sign(
    { userId: payload.userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES },
  );

  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);

  await Session.create({
    userId: payload.userId,
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil,
  });

  return { accessToken, newRefreshToken };
};

export const logoutUser = async (refreshToken) => {
  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw createHttpError(401, 'Invalid refresh token');
  }

  const session = await Session.findOne({
    userId: payload.userId,
    refreshToken,
  });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }
  await Session.deleteOne({ _id: session._id });
};

// export const sendResetEmail = async (email) => {
//   const user = await User.findOne({ email });
//   if (!user) {
//     throw createHttpError(404, 'User not found!');
//   }

//   const token = jwt.sign({ email }, process.env.JWT_SECRET, {
//     expiresIn: '5m',
//   });

//   const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

//   try {
//     await sendEmail({
//       to: email,
//       subject: 'Reset your password',
//       html: `<p>Click below to reset your password:</p>
//              <a href="${resetLink}">${resetLink}</a>`,
//     });
//   } catch (err) {
//     console.error('JWT verification error:', err.message);
//     throw createHttpError(
//       500,
//       'Failed to send reset email. Please try again later.',
//     );
//   }

//   return {};
// };

// export const resetPassword = async (token, newPassword) => {
//   let decoded;
//   try {
//     decoded = jwt.verify(token, process.env.JWT_SECRET);
//   } catch (err) {
//     console.error('JWT verification error:', err.message);
//     throw createHttpError(401, 'Token is expired or invalid.');
//   }

//   const user = await User.findOne({ email: decoded.email });

//   if (!user) {
//     throw createHttpError(404, 'User not found!');
//   }

//   const hashedPassword = await bcrypt.hash(newPassword, 10);
//   user.password = hashedPassword;
//   await user.save();

//   await Session.deleteMany({ userId: user._id });

//   return {};
// };
