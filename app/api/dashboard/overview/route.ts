import { NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';
import { ensureUsersTable, getPool } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/(?:^|; )nova_auth=([^;]+)/);
    const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : '';

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = verifyAuthToken(token);

    await ensureUsersTable();
    const pool = getPool();

    const [countRows] = await pool.query<any[]>('SELECT COUNT(*) AS totalUsers FROM users');
    const [latestRows] = await pool.query<any[]>(
      'SELECT username, email, created_at FROM users ORDER BY created_at DESC LIMIT 5'
    );

    return NextResponse.json(
      {
        viewer: {
          id: user.sub,
          email: user.email,
          username: user.username,
        },
        metrics: {
          totalUsers: Number(countRows[0]?.totalUsers || 0),
          activeSessions: 1,
          apiHealth: 'online',
        },
        recentUsers: latestRows.map((row) => ({
          username: String(row.username),
          email: String(row.email),
          createdAt: new Date(row.created_at).toISOString(),
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Dashboard overview error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
