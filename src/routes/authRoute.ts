import express from 'express';
import {
  signupRequest,
  verifyOTP,
  signin,
} from '../controllers/authController';

const router = express.Router();

router.post('/signup-request', signupRequest);
router.post('/verify-otp', verifyOTP);
router.post('/signin', signin);

export default router;
