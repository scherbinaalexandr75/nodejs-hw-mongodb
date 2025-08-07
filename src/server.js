import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import router from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

import mongoose from 'mongoose';

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

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;

export const getAllContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

export const getContactById = async (id) => {
  return await Contact.findById(id);
};

export async function setupServer() {
  try {
    const app = express();
    app.use(cors());
    app.use(pino());
    app.use(express.json());

    app.use('/contacts', router);
    app.use('*', notFoundHandler);
    app.use(errorHandler);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server failed to start:', error.message);
  }
};
