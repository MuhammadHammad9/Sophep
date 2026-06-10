'use client';

import { Clipboard, Hourglass, DollarSign, Building, TrendingDown, Users, Ticket, Check } from 'lucide-react';
import type { Registration } from '@/app/actions/admin';

interface Props {
  registrations: Registration[];
}

export default function AdminMetricsHUD({ registrations }: Props) {
  const total     = registrations.length;
  const pending   = registrations.filter(r => r.payment_status === 'pending').length;
  const verified  = registrations.filter(r => r.payment_status === 'verified').length;
  const rejected  = registrations.filter(r => r.payment_status === 'rejected').length;
  const revenue   = registrations
    .filter(r => r.payment_status === 'verified')
    .reduce((sum, r) => sum + (r.total_amount ?? 0), 0);
  const gimun     = registrations.filter(r => r.event_type?.includes('GIMUN')).length;
  const gmc       = registrations.filter(r => r.event_type?.includes('GMC')).length;
  const indiv     = registrations.filter(r => r.delegate_type === 'Individual').length;
  const delg      = registrations.filter(r => r.delegate_type === 'Delegation').length;
  const rejRate   = total > 0 ? Math.round((rejected / total) * 100) : 0;
  const avgValue  = verified > 0 ? Math.round(revenue / verified) : 0;

  const metrics = [
    {
      label: 'Total Applications',
      value: total,
      icon: <Clipboard className="w-6 h-6" />,
      accent: '#9f6fe0',
      bg: 'rgba(159,111,224,0.08)',
      border: 'rgba(159,111,224,0.15)',
    },
    {
      label: 'Pending Review',
      value: pending,
      icon: <Hourglass className="w-6 h-6" />,
      accent: '#f59e0b',
      bg: 'rgba(245,158,11,0.08)',
      border: 'rgba(245,158,11,0.2)',
    },
    {
      label: 'Verified Revenue',
      value: `PKR ${revenue.toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6" />,
      accent: '#22c55e',
      bg: 'rgba(34,197,94,0.08)',
      border: 'rgba(34,197,94,0.2)',
    },
    {
      label: 'Event Split',
      value: `${gimun} GIMUN / ${gmc} GMC`,
      icon: <Building className="w-6 h-6" />,
      accent: '#60a5fa',
      bg: 'rgba(96,165,250,0.08)',
      border: 'rgba(96,165,250,0.15)',
    },
    {
      label: 'Verified Delegates',
      value: verified,
      icon: <Check className="w-6 h-6" />,
      accent: '#34d399',
      bg: 'rgba(52,211,153,0.08)',
      border: 'rgba(52,211,153,0.18)',
    },
    {
      label: 'Rejection Rate',
      value: `${rejRate}%`,
      icon: <TrendingDown className="w-6 h-6" />,
      accent: rejected > 0 ? '#f87171' : '#94a3b8',
      bg: rejected > 0 ? 'rgba(248,113,113,0.08)' : 'rgba(148,163,184,0.06)',
      border: rejected > 0 ? 'rgba(248,113,113,0.2)' : 'rgba(148,163,184,0.12)',
    },
    {
      label: 'Delegation Split',
      value: `${indiv} Indiv / ${delg} Group`,
      icon: <Users className="w-6 h-6" />,
      accent: '#a78bfa',
      bg: 'rgba(167,139,250,0.08)',
      border: 'rgba(167,139,250,0.15)',
    },
    {
      label: 'Avg Ticket Value',
      value: avgValue > 0 ? `PKR ${avgValue.toLocaleString()}` : '—',
      icon: <Ticket className="w-6 h-6" />,
      accent: '#fb923c',
      bg: 'rgba(251,146,60,0.08)',
      border: 'rgba(251,146,60,0.15)',
    },
  ];

  return (
    <div className="hud-grid">
      {metrics.map((m) => (
        <div key={m.label} className="hud-card" style={{ background: m.bg, borderColor: m.border }}>
          <div className="hud-icon">{m.icon}</div>
          <div className="hud-value" style={{ color: m.accent }}>{m.value}</div>
          <div className="hud-label">{m.label}</div>
        </div>
      ))}

      <style jsx>{`
        .hud-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }
        @media (max-width: 1100px) {
          .hud-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (max-width: 800px) {
          .hud-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .hud-grid { grid-template-columns: 1fr; }
        }
        .hud-card {
          border: 1px solid;
          border-radius: 16px;
          padding: 20px 18px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .hud-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.2); }
        .hud-icon { font-size: 22px; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; }
        .hud-value { font-size: 20px; font-weight: 700; margin-bottom: 5px; line-height: 1.2; }
        .hud-label { font-size: 11px; color: rgba(255,255,255,0.4); letter-spacing: 0.05em; text-transform: uppercase; }
      `}</style>
    </div>
  );
}
