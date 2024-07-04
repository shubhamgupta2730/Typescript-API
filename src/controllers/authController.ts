import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/userModel';
import { generateOTP } from '../utils/generateOTP';
import { generateToken } from '../utils/generateToken';
import logger from '../logger';

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Generate OTP
    const otp = generateOTP();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user with hashed password and OTP
    const newUser: IUser = new User({ email, password: hashedPassword, otp });
    await newUser.save();

    // Generate JWT token
    const token = generateToken(newUser._id.toString() as string);

    logger.info(`User signed up with email: ${email}`);

    // Return OTP and JWT token
    res.status(200).json({ otp, token });
  } catch (error) {
    logger.error('Error in signup:', error);
    res.status(500).json({ message: 'Failed to signup. Please try again.' });
  }
};

export const signin = async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body;

  try {
    // Find user by email and OTP
    const user = await User.findOne({ email, otp });

    if (!user) {
      res.status(404).json({ message: 'Invalid OTP or email.' });
      return;
    }

    // Generate JWT token
    const token = generateToken(user._id.toString() as string);

    logger.info(`User signed in with email: ${email}`);

    // Return JWT token
    res.status(200).json({ token });
  } catch (error) {
    logger.error('Error in signin:', error);
    res.status(500).json({ message: 'Failed to signin. Please try again.' });
  }
};
