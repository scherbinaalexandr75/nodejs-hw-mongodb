import Joi from "joi";

const nameRule = Joi.string().min(3).max(20);
const phoneRule = Joi.string().min(3).max(20);
const emailRule = Joi.string().email().allow(null,"");
const isFavouriteRule = Joi.boolean();
const contactTypeRule = Joi.string().valid('work', 'home', 'personal');

export const createContactSchema = Joi.object({
  name: nameRule.required(),
  email: emailRule.required(),
  phoneNumber: phoneRule.required(),
  isFavourite: isFavouriteRule.default(false),
  contactType: contactTypeRule,
});

export const updateContactSchema = Joi.object({
  name: nameRule,
  phoneNumber: phoneRule,
  isFavourite: isFavouriteRule,
  contactType: contactTypeRule,
  email: emailRule,
  phone: phoneRule,
}).min(1);
