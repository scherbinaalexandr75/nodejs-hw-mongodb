import cors from 'cors';
import pino from 'pino-http';
import express from 'express';
import mongoose from 'mongoose';
import router from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Set phone number for contact'],
    },
    email: String,
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      default: 'personal',
      required: [true, 'Set contact type'],
    },
  },
  { timestamps: true },
);

export const Contact = mongoose.model('Contact', contactSchema);

export async function setupServer() {
  const app = express();

  app.use(cors());

  app.use(pino());

  app.use(express.json());

  app.use('/contacts', router);


  app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is running successfully!' });
  });

  app.use(errorHandler);

  app.use(notFoundHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
