'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';

type Overview = {
  viewer: { id: number; email: string; username: string };
  metrics: { totalUsers: number; activeSessions: number; apiHealth: string };
  recentUsers: Array<{ username: string; email: string; createdAt: string }>;
};

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await fetch('/api/dashboard/overview', { cache: 'no-store' });
        const body = await res.json();

        if (!mounted) {
          return;
        }

        if (!res.ok) {
          router.push('/auth');
          return;
        }

        setData(body);
      } catch {
        if (mounted) {
          setError('Failed to load dashboard data.');
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [router]);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth');
  }

  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <div className={styles.topbar}>
          <div className={styles.brand}>
            <img src="/logo.png" alt="Nova" width={30} height={30} />
            <span>Nova Dashboard</span>
          </div>
          <div className={styles.actions}>
            <Link className={styles.btn} href="/">Website</Link>
            <button className={styles.btn} onClick={logout}>Logout</button>
          </div>
        </div>

        {!data && !error ? <p className={styles.loading}>Loading dashboard...</p> : null}
        {error ? <p className={styles.error}>{error}</p> : null}

        {data ? (
          <>
            <div className={styles.grid}>
              <div className={styles.card}>
                <p className={styles.metricLabel}>Signed In As</p>
                <p className={styles.metricValue}>{data.viewer.username}</p>
              </div>
              <div className={styles.card}>
                <p className={styles.metricLabel}>Total Users</p>
                <p className={styles.metricValue}>{data.metrics.totalUsers}</p>
              </div>
              <div className={styles.card}>
                <p className={styles.metricLabel}>API Health</p>
                <p className={styles.metricValue}>{data.metrics.apiHealth}</p>
              </div>
            </div>

            <section className={styles.panel}>
              <h2 className={styles.title}>Recent Users</h2>
              <div className={styles.list}>
                {data.recentUsers.length === 0 ? (
                  <p className={styles.meta}>No users yet.</p>
                ) : (
                  data.recentUsers.map((user) => (
                    <div className={styles.row} key={`${user.email}-${user.createdAt}`}>
                      <div>
                        <p className={styles.name}>{user.username}</p>
                        <p className={styles.meta}>{user.email}</p>
                      </div>
                      <p className={styles.meta}>{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
