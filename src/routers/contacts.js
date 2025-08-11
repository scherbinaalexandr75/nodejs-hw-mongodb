import { Router } from 'express';
import { getContacts, getContact } from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { createContactController } from '../controllers/contacts.js';
import {patchContactController } from '../controllers/contacts.js';
import * as contactsController from '../controllers/contacts.js';

const router = Router();

router.get('/', ctrlWrapper(getContacts));
router.get('/:id', ctrlWrapper(getContact));
router.post('/', ctrlWrapper(createContactController));
router.patch('/:id', ctrlWrapper(patchContactController));
router.delete('/:id', ctrlWrapper(contactsController.deleteContact));

export default router;
