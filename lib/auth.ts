import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_EXPIRES_IN = '7d';

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signAuthToken(user: { id: number; email: string; username: string }) {
  const secret = process.env.AUTH_JWT_SECRET;
  if (!secret) {
    throw new Error('Missing required environment variable: AUTH_JWT_SECRET');
  }

  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      username: user.username,
    },
    secret,
    { expiresIn: JWT_EXPIRES_IN }
  );
}
