import { Contact } from '../models/contact.js';

export const getAllContacts = async (
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  type,
  isFavourite,
  userId,
) => {
  const skip = (page - 1) * perPage;

  const sortDirection = sortOrder === 'desc' ? -1 : 1;
  const sortOptions = { [sortBy]: sortDirection };

  const filter = { userId };
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
    hasNextPage: page < Math.ceil(totalItems / perPage),
  };
};

export const getContactById = async (id, userId) => {
  return await Contact.findOne({ _id: id, userId });
};

export const createContactService = async (contactData) => {
  return await Contact.create(contactData);
};

export const patchContactService = async (id, updateData, userId) => {
  return await Contact.findOneAndUpdate({ _id: id, userId }, updateData, {
    new: true,
  });
};

export const deleteContact = async (id, userId) => {
  const result = await Contact.findOneAndDelete({ _id: id, userId });
  return result !== null;
};
