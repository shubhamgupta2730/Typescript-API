import express from 'express';
import {
  signupRequest,
  verifyOTP,
  signin,
  resetPassword,
} from '../controllers/authController';

const router = express.Router();

router.post('/signup-request', signupRequest);
router.post('/verify-otp', verifyOTP);
router.post('/signin', signin);
router.post('/reset-password', resetPassword);

export default router;
