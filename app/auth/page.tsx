'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import styles from './auth.module.css';

type Mode = 'login' | 'signup';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const title = useMemo(() => (mode === 'login' ? 'Welcome Back' : 'Create Account'), [mode]);
  const subtitle = useMemo(
    () =>
      mode === 'login'
        ? 'Enter your details to access your dashboard.'
        : 'Join Nova and start executing today.',
    [mode]
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Request failed.');
        return;
      }

      setSuccess(mode === 'login' ? 'Signed in successfully.' : 'Account created successfully.');
      window.setTimeout(() => {
        router.push('/dashboard');
      }, 250);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.background}>
        <div className={styles.bgGrid} />
        <div className={styles.bgGridFine} />
        <div className={`${styles.bgGradient} ${styles.purple}`} />
        <div className={`${styles.bgGradient} ${styles.blue}`} />
        <div className={`${styles.bgGradient} ${styles.pink}`} />
        <div className={`${styles.bgGradient} ${styles.violet}`} />
        <div className={styles.bgVignette} />
      </div>

      <header className={styles.header}>
        <nav className={styles.nav}>
          <div className={styles.navLeft}>
            <Link href="/">
              <img src="/logo.png" alt="Nova Logo" width={40} height={40} />
            </Link>
          </div>
          <div className={styles.navLinks}>
            <Link className={styles.navLink} href="/">Home</Link>
            <Link className={styles.navLink} href="/#features">Features</Link>
            <Link className={styles.navLink} href="/reviews">Reviews</Link>
            <Link className={styles.navLink} href="/policy">Policy</Link>
            <Link className={styles.navLink} href="/#plans">Plans</Link>
            <Link className={styles.navLink} href="/#faq">FAQ</Link>
            <a className={styles.navLink} href="https://discord.gg/sided" target="_blank" rel="noreferrer">Discord</a>
          </div>
          <div className={styles.navRight}>
            <Link className={styles.navLink} href="/auth">Sign In</Link>
          </div>
        </nav>
      </header>

      <section className={styles.content}>
        <div className={styles.wrap}>
          <Link className={styles.back} href="/">&larr; Back to Home</Link>

          <div className={styles.card}>
            <div className={`${styles.panel} ${styles.panelActive}`}>
              <img className={styles.logo} src="/logo.png" alt="Nova Logo" />
              <h1 className={styles.title}>{title}</h1>
              <p className={styles.subtitle}>{subtitle}</p>

              <form className={styles.form} onSubmit={onSubmit}>
                {mode === 'signup' && (
                  <div>
                    <label className={styles.label} htmlFor="username">Username</label>
                    <div className={styles.inputWrap}>
                      <input className={styles.input} id="username" name="username" placeholder="Choose a username" required />
                    </div>
                  </div>
                )}

                <div>
                  <label className={styles.label} htmlFor="email">Email Address</label>
                  <div className={styles.inputWrap}>
                    <input className={styles.input} id="email" name="email" type="email" placeholder="Enter your email address" required />
                  </div>
                </div>

                <div>
                  <label className={styles.label} htmlFor="password">Password</label>
                  <div className={styles.inputWrap}>
                    <input className={styles.input} id="password" name="password" type="password" placeholder="Enter your password" required />
                  </div>
                </div>

                {mode === 'login' && (
                  <Link className={styles.link} href="/reset-password">Forgot your password?</Link>
                )}

                <button className={styles.submit} type="submit" disabled={loading}>
                  {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
                </button>

                <button
                  className={styles.switch}
                  type="button"
                  onClick={() => {
                    setError('');
                    setSuccess('');
                    setMode((prev) => (prev === 'login' ? 'signup' : 'login'));
                  }}
                >
                  {mode === 'login' ? "Don't have an account? Sign up" : 'Already a member? Sign in'}
                </button>

                {error ? <p className={styles.error}>{error}</p> : null}
                {success ? <p className={styles.success}>{success}</p> : null}
              </form>
            </div>
          </div>

          <p className={styles.legal}>
            By signing in, you agree to our <Link href="/policy">Policy</Link>, <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}
