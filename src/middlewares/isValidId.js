import mongoose from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
  return next(createHttpError(400, `${id} is not a valid id `));
  }
  next();
};
