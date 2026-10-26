import type { ReactNode } from 'react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Content admin · Prayer Alarm',
  robots: 'noindex',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}
