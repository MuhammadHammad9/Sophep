import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Login — SOPHEP',
  description: 'SOPHEP Organizing Committee — Secure Admin Access',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
