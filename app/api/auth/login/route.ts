import { NextResponse } from 'next/server';
import { ensureUsersTable, pool } from '@/lib/db';
import { signAuthToken, verifyPassword } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? '').trim().toLowerCase();
    const password = String(body?.password ?? '');

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    await ensureUsersTable();

    const [rows] = await pool.query<any[]>(
      'SELECT id, username, email, password_hash FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    const userRow = rows[0];
    if (!userRow) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const valid = await verifyPassword(password, userRow.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const user = {
      id: Number(userRow.id),
      username: String(userRow.username),
      email: String(userRow.email),
    };

    const token = signAuthToken(user);

    const response = NextResponse.json({ user }, { status: 200 });
    response.cookies.set('nova_auth', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Failed to log in.' }, { status: 500 });
  }
}
