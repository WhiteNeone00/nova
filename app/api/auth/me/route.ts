import { NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/(?:^|; )nova_auth=([^;]+)/);
    const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : '';

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyAuthToken(token);
    return NextResponse.json(
      {
        user: {
          id: payload.sub,
          email: payload.email,
          username: payload.username,
        },
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
