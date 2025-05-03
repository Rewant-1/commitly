import jwt from 'jsonwebtoken';
export const generateTokenAndSetCookie = (userId, res) => {
  // Generate a JWT token with user ID and secret key
  const token = jwt.sign({  userId }, process.env.JWT_SECRET, {
    expiresIn: '15d', // Token expiration time
  });

  // Set the token as an HTTP-only cookie in the response
  res.cookie('jwt', token, {
    httpOnly: true,
    sameSite:"strict",
    secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
    maxAge:150 * 24 * 60 * 60 * 1000, // Cookie expiration time (30 days)
  });
}