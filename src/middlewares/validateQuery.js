import createHttpError from "http-errors";

export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query);
    if (error) {
      return next(createHttpError(400, error.details[0].message));
    }
    Object.assign(req.query, value);
    next();
  };
};
