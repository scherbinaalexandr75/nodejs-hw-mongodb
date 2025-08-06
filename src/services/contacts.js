import { Contact } from '../server.js';

export const getAllContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

export const getContactById = async (id) => {
  return await Contact.findById(id);
};
