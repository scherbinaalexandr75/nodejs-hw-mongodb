import { Contact } from '../models/contact.js';

export const getAllContacts = async (
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  type,
  isFavourite,
) => {
  const skip = (page - 1) * perPage;

  const sortDirection = sortOrder === 'desc' ? -1 : 1;
  const sortOptions = { [sortBy]: sortDirection };

  const filter = {};
  if (type) {
    filter.contactType = type;
  }
  if (isFavourite !== undefined) {
    filter.isFavourite = isFavourite;
  }

  const [data, totalItems] = await Promise.all([
    Contact.find(filter).skip(skip).limit(perPage).sort(sortOptions),
    Contact.countDocuments(filter),
  ]);
  return {
    data,
    page,
    perPage,
    totalItems,
    totalPages: Math.ceil(totalItems / perPage),
    hasPreviousPage: page > 1,
    hasNextPage: page < Math.ceil(totalItems / perPage)
  };
};

export const getContactById = async (id) => {
  return await Contact.findById(id);
};

export const createContactService = async (contactData) => {
  const newContact = await Contact.create(contactData);
  return newContact;
};

export const patchContactService = async (id, updateData) => {
  return Contact.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteContact = async (id) => {
  const result = await Contact.findByIdAndDelete(id);
  return result !== null;
};
