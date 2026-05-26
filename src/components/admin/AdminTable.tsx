'use client';

import type { Registration } from '@/app/actions/admin';

interface Props {
  registrations: Registration[];
  onRowClick: (r: Registration) => void;
  selectedId: string | null;
  // Bulk selection
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleAll: (selectAll: boolean) => void;
}

const STATUS_CONFIG = {
  pending:  { label: 'Pending',  icon: '⏳', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.25)' },
  verified: { label: 'Verified', icon: '✅', color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.25)' },
  rejected: { label: 'Rejected', icon: '❌', color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.25)' },
} as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export default function AdminTable({
  registrations, onRowClick, selectedId,
  selectedIds, onToggleSelect, onToggleAll,
}: Props) {
  if (registrations.length === 0) {
    return (
      <div className="at-empty">
        <div className="at-empty-icon">📭</div>
        <div className="at-empty-text">No registrations yet</div>
        <div className="at-empty-sub">Applications will appear here once submitted.</div>
      </div>
    );
  }

  const allSelected = registrations.every(r => selectedIds.has(r.id));
  const someSelected = registrations.some(r => selectedIds.has(r.id));

  return (
    <div className="at-wrapper">
      <table className="at-table">
        <thead>
          <tr className="at-head-row">
            <th className="at-th at-th-check">
              <input
                type="checkbox"
                className="at-checkbox"
                checked={allSelected}
                ref={el => { if (el) el.indeterminate = someSelected && !allSelected; }}
                onChange={(e) => onToggleAll(e.target.checked)}
                title={allSelected ? 'Deselect all' : 'Select all'}
              />
            </th>
            <th className="at-th">Date</th>
            <th className="at-th">Ref ID</th>
            <th className="at-th">Primary Name</th>
            <th className="at-th">Event</th>
            <th className="at-th">Type</th>
            <th className="at-th at-th-right">Amount</th>
            <th className="at-th at-th-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((r) => {
            const s = STATUS_CONFIG[r.payment_status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;
            const isSelected = r.id === selectedId;
            const isChecked = selectedIds.has(r.id);
            const isPending = r.payment_status === 'pending';
            return (
              <tr
                key={r.id}
                className={`at-row ${isSelected ? 'at-row-selected' : ''} ${isChecked ? 'at-row-checked' : ''} ${!isPending ? 'at-row-locked' : ''}`}
                onClick={() => onRowClick(r)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onRowClick(r)}
              >
                <td className="at-td at-td-check" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="at-checkbox"
                    checked={isChecked}
                    disabled={!isPending}
                    onChange={() => isPending && onToggleSelect(r.id)}
                    title={!isPending ? `Cannot change: already ${r.payment_status}` : 'Select for bulk action'}
                  />
                </td>
                <td className="at-td at-td-muted">{formatDate(r.created_at)}</td>
                <td className="at-td">
                  <span className="at-ref">{r.id.slice(0, 8).toUpperCase()}</span>
                </td>
                <td className="at-td at-td-name">{r.full_name}</td>
                <td className="at-td at-td-muted">{r.event_type}</td>
                <td className="at-td at-td-muted">{r.delegate_type}</td>
                <td className="at-td at-td-right">PKR {(r.total_amount ?? 0).toLocaleString()}</td>
                <td className="at-td at-td-center">
                  <span
                    className="at-badge"
                    style={{ color: s.color, background: s.bg, borderColor: s.border }}
                  >
                    {s.icon} {s.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <style jsx>{`
        .at-wrapper {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          overflow: hidden;
        }
        .at-table { width: 100%; border-collapse: collapse; }
        .at-head-row {
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .at-th {
          padding: 14px 16px;
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(255,255,255,0.35); text-align: left; white-space: nowrap;
        }
        .at-th-check { padding: 14px 8px 14px 20px; width: 40px; }
        .at-th-right { text-align: right; }
        .at-th-center { text-align: center; }

        .at-checkbox {
          width: 16px; height: 16px;
          cursor: pointer; accent-color: #7c3aed;
        }

        .at-row {
          border-bottom: 1px solid rgba(255,255,255,0.04);
          cursor: pointer; transition: background 0.15s;
        }
        .at-row:last-child { border-bottom: none; }
        .at-row:hover { background: rgba(124,58,237,0.07); }
        .at-row-selected { background: rgba(124,58,237,0.12) !important; }
        .at-row-checked { background: rgba(124,58,237,0.06); }
        .at-row-locked { opacity: 0.55; }
        .at-row-locked .at-checkbox { cursor: not-allowed; }
        .at-row:focus { outline: none; box-shadow: inset 0 0 0 2px rgba(124,58,237,0.4); }

        .at-td { padding: 14px 16px; font-size: 14px; color: rgba(255,255,255,0.75); white-space: nowrap; }
        .at-td-check { padding: 14px 8px 14px 20px; }
        .at-td-muted { color: rgba(255,255,255,0.4); font-size: 13px; }
        .at-td-name { font-weight: 600; color: #fff; }
        .at-td-right { text-align: right; font-weight: 600; }
        .at-td-center { text-align: center; }

        .at-ref {
          font-family: 'Courier New', monospace; font-size: 12px;
          color: #9f6fe0; background: rgba(159,111,224,0.1);
          padding: 2px 8px; border-radius: 6px;
        }
        .at-badge {
          display: inline-block; padding: 4px 10px;
          border-radius: 20px; font-size: 12px; font-weight: 600;
          border: 1px solid; white-space: nowrap;
        }
        .at-empty {
          text-align: center; padding: 80px 32px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06); border-radius: 16px;
        }
        .at-empty-icon { font-size: 40px; margin-bottom: 16px; }
        .at-empty-text { font-size: 18px; font-weight: 600; color: rgba(255,255,255,0.5); margin-bottom: 8px; }
        .at-empty-sub { font-size: 14px; color: rgba(255,255,255,0.25); }
      `}</style>
    </div>
  );
}
