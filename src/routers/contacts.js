import {
  getContacts,
  getContact,
  createContactController,
  patchContactController,
  deleteContact,
} from '../controllers/contacts.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../schemas/contacts.js';
import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { contactQuerySchema } from '../schemas/pagination.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import { validateQuery } from '../middlewares/validateQuery.js';

const router = Router();

router.use(authenticate);

router.get('/', validateQuery(contactQuerySchema), ctrlWrapper(getContacts));

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
