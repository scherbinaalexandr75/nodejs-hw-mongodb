import cors from 'cors';
import pino from 'pino-http';
import express from 'express';
import router from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';


export async function setupServer() {
  const app = express();

  app.use(cors());

  app.use(pino());

  app.use(express.json());

  app.use('/contacts', router);


  app.get('/', (req, res) => {
    res.status(200).json({
      message: 'Server is running successfully!',
    timestamp: new Date().toISOString(),
    });
  });

  app.use(errorHandler);

  app.use(notFoundHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
