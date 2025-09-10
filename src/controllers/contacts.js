import createHttpError from 'http-errors';
import * as contactsService from '../services/contacts.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

export const getContacts = async (req, res) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  } = req.query;

  const parsedIsFavourite =
    isFavourite === 'true' ? true : isFavourite === 'false' ? false : undefined;

  const userId = req.user._id;

  const paginationResult = await contactsService.getAllContacts(
    Number(page),
    Number(perPage),
    sortBy,
    sortOrder,
    type,
    parsedIsFavourite,
    userId,
  );

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: paginationResult,
  });
};

export const getContact = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const contact = await contactsService.getContactById(id, userId);

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
  const userId = req.user._id;

  let photo = null;
  if (req.file) {
    photo = await uploadToCloudinary(
      req.file.buffer || `${req.file.destination}/${req.file.filename}`,
    );
  }

  const newContact = await contactsService.createContactService({
    name,
    phoneNumber,
    email: email || null,
    isFavourite: isFavourite ?? false,
    contactType,
    userId,
    photo,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const patchContactController = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const updateData = { ...req.body };

  if (req.file) {
    updateData.photo = await uploadToCloudinary(
      req.file.buffer || `${req.file.destination}/${req.file.filename}`,
    );
  }

  const updateContact = await contactsService.patchContactService(
    id,
    updateData,
    userId,
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
  const userId = req.user._id;
  const isDeleted = await contactsService.deleteContact(id, userId);

  if (!isDeleted) {
    throw createHttpError(404, `Contact with id ${id} not found`);
  }

  res.status(204).send();
};
