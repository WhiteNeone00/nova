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

export function verifyAuthToken(token: string) {
  const secret = process.env.AUTH_JWT_SECRET;
  if (!secret) {
    throw new Error('Missing required environment variable: AUTH_JWT_SECRET');
  }

  const decoded = jwt.verify(token, secret) as unknown;

  if (!decoded || typeof decoded !== 'object') {
    throw new Error('Invalid auth token payload');
  }

  const payload = decoded as {
    sub?: number | string;
    email?: string;
    username?: string;
    iat?: number;
    exp?: number;
  };

  if (!payload.sub || !payload.email || !payload.username) {
    throw new Error('Invalid auth token fields');
  }

  return {
    sub: Number(payload.sub),
    email: payload.email,
    username: payload.username,
    iat: Number(payload.iat || 0),
    exp: Number(payload.exp || 0),
  };
}
