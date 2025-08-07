import { getAllContacts, getContactById } from '../server.js';
// import Contact from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getContacts = async (req, res) => {
  const contacts = await getAllContacts();

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContact = async (req, res) => {
  const { id } = req.params;
  const contact = await getContactById(id);

  if (!contact) {
    throw createHttpError(404, `Contact with id ${id} not found`);
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully found contact!',
    data: contact,
  });
};
