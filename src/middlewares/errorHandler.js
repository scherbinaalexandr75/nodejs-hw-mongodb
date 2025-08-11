import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message || err.name,
      data: err.message
    });
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err.message,
  });
};

// export const errorHandler = (err, req, res, next) => {
//   console.error(err);

//   const status = err.status || 500;
//   const message = err.message || 'Internal Server Error'; 

//   res.status(status).json({
//     status,
//     message
//   });
// };