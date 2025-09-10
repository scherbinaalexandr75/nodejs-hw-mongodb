import { Router } from 'express';
import * as authController from '../controllers/auth.js';
import { requestResetEmailSchema } from '../schemas/auth.js';
import { requestResetEmailController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { resetPasswordSchema } from '../schemas/auth.js';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);


router.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

router.post('/reset-password',
  validateBody(resetPasswordSchema),
  ctrlWrapper(authController.resetPasswordController),
);


export default router;
