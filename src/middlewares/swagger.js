import fs from 'node:fs';
import { SWAGGER_PATH } from '../models/swagConst.js';
import swaggerUi from 'swagger-ui-express';
import createHttpError from 'http-errors';

export const swaggerDocs = () => {
  try {
    const swaggerDoc = JSON.parse(fs.readFileSync(SWAGGER_PATH).toString());
    return [...swaggerUi.serve, swaggerUi.setup(swaggerDoc)];
  } catch (err) {
    console.log(err.message);
    return (req, res, next) => {
      next(createHttpError(500, 'Cant load swagger docs'));
    };
  }
};
