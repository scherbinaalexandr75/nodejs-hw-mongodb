import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
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
  { timestamps: true }
);

const Contact = mongoose.model('Contact', contactSchema);


async function getAllContacts() {
  return await Contact.find();
}

async function getContactById(id) {
  return await Contact.findById(id);
}


async function getContacts(req, res) {
  try {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
}

async function getContact(req, res) {
  try {
    const { id } = req.params;
    const contact = await getContactById(id);

    if (!contact) {
      return res.status(404).json({
        status: 404,
        message: 'Contact not found',
      });
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully found contact!',
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
}


const router = express.Router();
router.get('/', getContacts);
router.get('/:id', getContact);


 export async function setupServer() {
  try {
    // await mongoose.connect('mongodb://localhost:27017/contactsdb');
    // console.log('MongoDB connected');

    const app = express();
    app.use(cors());
    app.use(pino());
    app.use(express.json());

    app.use('/contacts', router);

    app.use((req, res) => {
      res.status(404).json({ message: 'Not found' });
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server failed to start:', error.message);
  }
}



