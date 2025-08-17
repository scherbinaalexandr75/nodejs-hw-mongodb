import { Router } from 'express';
import {
  getContacts,
  getContact,
  createContactController,
  patchContactController,
  deleteContact,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { validateQuery } from "../middlewares/validateQuery.js";
import { isValidId } from '../middlewares/isValidId.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../schemas/contacts.js';
import { contactQuerySchema } from "../schemas/pagination.js";

const router = Router();

router.get('/', validateQuery(contactQuerySchema),ctrlWrapper(getContacts));

router.get('/:id', isValidId, ctrlWrapper(getContact));

router.post(
  '/',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

router.patch(
  '/:id',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

router.delete('/:id', isValidId, ctrlWrapper(deleteContact));

export default router;
