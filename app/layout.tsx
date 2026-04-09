import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nova Serverside | #1 Free Roblox Serverside Moderation Tool',
  description:
    'The #1 Roblox Serverside Global Execution Moderation System. Execute require scripts with ease.',
  applicationName: 'Nova Serverside',
  icons: {
    icon: [
      { url: '/favicon.ico?v=2' },
      { url: '/logo.png?v=2', type: 'image/png' },
    ],
    apple: '/logo.png?v=2',
    shortcut: '/favicon.ico?v=2',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
