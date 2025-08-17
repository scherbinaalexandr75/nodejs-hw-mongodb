import Joi from "joi";

export const contactQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  perPage: Joi.number().integer().min(1).max(50).default(10),
  sortBy: Joi.string().valid("name", "email", "phoneNumber", "contactType", "isFavourite").default("name"),
  sortOrder: Joi.string().valid("asc", "desc").default("asc"),
  type: Joi.string().valid('work', 'home', 'personal'),
  isFavourite: Joi.boolean().truthy("true").falsy("false"),
});
