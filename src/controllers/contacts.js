import createHttpError from 'http-errors';
import * as contactsService from '../services/contacts.js';

export const getContacts = async (req, res) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  } = req.query;

  const paginationResult = await contactsService.getAllContacts(
    page,
    perPage,
    sortBy,
    sortOrder,
    type,
    isFavourite,
  );

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: paginationResult,
  });
};

export const getContact = async (req, res) => {
  const { id } = req.params;
  const contact = await contactsService.getContactById(id);

  if (!contact) {
    throw createHttpError(404, `Contact with id ${id} not found`);
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully found contact!',
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;

  const newContact = await contactsService.createContactService({
    name,
    phoneNumber,
    email: email || null,
    isFavourite: isFavourite ?? false,
    contactType,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const patchContactController = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const updateContact = await contactsService.patchContactService(
    id,
    updateData,
  );

  if (!updateContact) {
    throw createHttpError(404, `Contact with id ${id} not found`);
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updateContact,
  });
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const isDeleted = await contactsService.deleteContact(id);

  if (!isDeleted) {
    throw createHttpError(404, `Contact with id ${id} not found`);
  }

  res.status(204).send();
};
