import createHttpError from 'http-errors';
import * as authService from '../services/auth.js';
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

  const parsedIsFavourite =
    isFavourite === 'true' ? true : isFavourite === 'false' ? false : undefined;

  const paginationResult = await contactsService.getAllContacts(
    Number(page),
    Number(perPage),
    sortBy,
    sortOrder,
    type,
    parsedIsFavourite,
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

export const logout = async (req, res, next) => {
  try{
    const refreshToken = req.cookies?.refreshToken;

    if(!refreshToken){
      throw createHttpError(401, "Refresh token is missing");
    }
    await authService.logoutUser(refreshToken);

    res.clearCookie("refreshToken",{
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
