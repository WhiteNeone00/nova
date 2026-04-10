import { NextResponse } from 'next/server';
import { hashPassword, signAuthToken } from '@/lib/auth';
import { ensureUsersTable, pool } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const username = String(body?.username ?? '').trim();
    const email = String(body?.email ?? '').trim().toLowerCase();
    const password = String(body?.password ?? '');

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required.' },
        { status: 400 }
      );
    }

    if (username.length < 3 || username.length > 50) {
      return NextResponse.json(
        { error: 'Username must be between 3 and 50 characters.' },
        { status: 400 }
      );
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters.' },
        { status: 400 }
      );
    }

    await ensureUsersTable();

    const [[existing]] = await pool.query<any[]>(
      'SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1',
      [email, username]
    );

    if (existing) {
      return NextResponse.json(
        { error: 'Email or username is already in use.' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const [result] = await pool.query<any>(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, passwordHash]
    );

    const user = {
      id: Number(result.insertId),
      username,
      email,
    };

    const token = signAuthToken(user);

    const response = NextResponse.json({ user }, { status: 201 });
    response.cookies.set('nova_auth', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Failed to register user.' }, { status: 500 });
  }
}
