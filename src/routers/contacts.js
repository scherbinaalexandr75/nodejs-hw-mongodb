import { Router } from 'express';
import { getContacts, getContact } from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();
router.get('/', ctrlWrapper(getContacts));
router.get('/:id', ctrlWrapper(getContact));

export default router;
