import type { ReactNode } from 'react';

export const metadata = {
  title: 'Prayer Alarm API',
  description: 'Scripture and content backend for the Prayer Alarm mobile app.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
