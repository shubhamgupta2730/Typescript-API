export const generateOTP = (): string => {
  const digit = '0123456789';
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += digit[Math.floor(Math.random() * 10)];
  }
  return otp;
};
