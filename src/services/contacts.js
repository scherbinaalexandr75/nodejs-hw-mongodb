import { Contact } from '../server.js';

export const getAllContacts = async () => {
  return await Contact.find();
};

export const getContactById = async (id) => {
  return await Contact.findById(id);
};

export const createContactService = async (contactData) => {
  const  newContact = await Contact.create(contactData);
  return newContact;
};

export const patchContactService = async (id, updateData) => {
return Contact.findByIdAndUpdate(id, updateData, {new: true });
};

export const deleteContact = async (id) => {
  const result = await Contact.findByIdAndDelete(id);
  return result !== null; 
};