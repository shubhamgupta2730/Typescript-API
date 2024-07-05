import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/userModel';
import { generateOTP } from '../utils/generateOTP';
import { generateToken } from '../utils/generateToken';
import logger from '../logger';

export const signupRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      res
        .status(400)
        .json({ message: 'Email, password, and name are required.' });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Email is already in use.' });
      return;
    }

    // Generate OTP
    const otp = generateOTP();

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: IUser = new User({
      email,
      password: hashedPassword,
      name,
      otp,
      isVerified: false,
    });
    await newUser.save();

    logger.info(`Signup request initiated for email: ${email}`);

    res.status(200).json({ otp });
  } catch (error) {
    logger.error('Error in signup request:', error);
    res
      .status(500)
      .json({ message: 'Failed to initiate signup. Please try again.' });
  }
};

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body;

  try {
    // Find user by email and OTP
    const user = await User.findOne({ email, otp });

    if (!user) {
      res.status(400).json({ message: 'Invalid OTP or email.' });
      return;
    }

    //mark user as verified.
    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id.toString());

    logger.info(`User verified and signed up with email: ${email}`);

    // Return JWT token
    res.status(200).json({ token });
  } catch (error) {
    logger.error('Error in OTP verification:', error);
    res
      .status(500)
      .json({ message: 'Failed to verify OTP. Please try again.' });
  }
};

export const signin = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and is verified
    if (!user || !user.isVerified) {
      res
        .status(400)
        .json({ message: 'Invalid email or account not verified.' });
      return;
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400).json({ message: 'Invalid password.' });
      return;
    }

    // Generate JWT token
    const token = generateToken(user._id.toString());

    logger.info(`User signed in with email: ${email}`);

    // Return JWT token
    res.status(200).json({ token });
  } catch (error) {
    logger.error('Error in signin:', error);
    res.status(500).json({ message: 'Failed to signin. Please try again.' });
  }
};
