import { getRegistrations, getAuditLog, getEventCapacities, getWaitlistEntries } from '@/app/actions/admin';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard — SOPHEP Admin',
  robots: 'noindex, nofollow',
};

// Force dynamic rendering so data is always fresh
export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [registrations, auditLog, capacities, waitlist] = await Promise.all([
    getRegistrations(),
    getAuditLog(),
    getEventCapacities(),
    getWaitlistEntries(),
  ]);

  return (
    <AdminDashboardClient
      initialRegistrations={registrations}
      initialAuditLog={auditLog}
      initialCapacities={capacities}
      initialWaitlist={waitlist}
    />
  );
}
