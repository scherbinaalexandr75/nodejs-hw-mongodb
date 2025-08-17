export const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    err.status = 400;
    err.message = err.message.replace('Validation failed: ', '');
  }

  if (err.name === 'CastError') {
    err.status = 400;
    err.message = `Invalid ${err.path}: ${err.value}`;
  }

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Something went wrong';

  res.status(status).json({
    status,
    message,
    data: err.data || null,
  });
};
