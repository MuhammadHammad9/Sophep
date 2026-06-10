'use client';

import { useState } from 'react';
import { LockKeyhole, DoorOpen, Check, X, BarChart3, Target, Zap, Clipboard } from 'lucide-react';
import type { AuditEntry } from '@/app/actions/admin';

const ACTION_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  login:           { label: 'Login',           color: '#60a5fa', icon: <LockKeyhole className="w-4 h-4" /> },
  logout:          { label: 'Logout',          color: '#94a3b8', icon: <DoorOpen className="w-4 h-4" /> },
  verify_payment:  { label: 'Verified',        color: '#22c55e', icon: <Check className="w-4 h-4" /> },
  reject_payment:  { label: 'Rejected',        color: '#ef4444', icon: <X className="w-4 h-4" /> },
  bulk_verify:     { label: 'Bulk Verify',     color: '#4ade80', icon: <Check className="w-4 h-4" /> },
  bulk_reject:     { label: 'Bulk Reject',     color: '#fca5a5', icon: <X className="w-4 h-4" /> },
  export:          { label: 'Export',          color: '#a78bfa', icon: <BarChart3 className="w-4 h-4" /> },
  update_capacity: { label: 'Capacity Update', color: '#fbbf24', icon: <Target className="w-4 h-4" /> },
};

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

interface Props {
  entries: AuditEntry[];
}

export default function AdminAuditFeed({ entries }: Props) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? entries : entries.slice(0, 10);

  return (
    <div className="af-root">
      <div className="af-header">
        <div>
          <h2 className="af-title">Activity Log</h2>
          <p className="af-sub">{entries.length} admin actions recorded</p>
        </div>
        <div className="af-live-dot">
          <span className="af-dot" />
          <span className="af-live-label">Live</span>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="af-empty">
          <Clipboard className="w-7 h-7 mx-auto" />
          <p>No admin actions logged yet.</p>
        </div>
      ) : (
        <div className="af-feed">
          {visible.map((entry) => {
            const cfg = ACTION_CONFIG[entry.action] ?? { label: entry.action, color: '#94a3b8', icon: <Zap className="w-4 h-4" /> };
            return (
              <div key={entry.id} className="af-entry">
                <div className="af-entry-icon" style={{ color: cfg.color }}>{cfg.icon}</div>
                <div className="af-entry-body">
                  <div className="af-entry-top">
                    <span className="af-action-badge" style={{ color: cfg.color, borderColor: `${cfg.color}33`, background: `${cfg.color}11` }}>
                      {cfg.label}
                    </span>
                    {entry.target_id && (
                      <span className="af-ref">{entry.target_id}</span>
                    )}
                  </div>
                  <div className="af-entry-meta">
                    <span className="af-email">{entry.admin_email}</span>
                    <span className="af-sep">·</span>
                    <span className="af-time">{formatRelative(entry.created_at)}</span>
                    {entry.details && Object.keys(entry.details).length > 0 && (
                      <>
                        <span className="af-sep">·</span>
                        <span className="af-details">
                          {Object.entries(entry.details).map(([k, v]) => `${k}: ${v}`).join(', ')}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {entries.length > 10 && (
            <button className="af-expand-btn" onClick={() => setExpanded(e => !e)}>
              {expanded ? '▲ Show less' : `▼ Show ${entries.length - 10} more`}
            </button>
          )}
        </div>
      )}

      <style jsx>{`
        .af-root {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          overflow: hidden;
        }
        .af-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .af-title { font-size: 16px; font-weight: 700; margin: 0 0 4px; }
        .af-sub { font-size: 12px; color: rgba(255,255,255,0.35); margin: 0; }
        .af-live-dot { display: flex; align-items: center; gap: 6px; }
        .af-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #22c55e;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        .af-live-label { font-size: 11px; color: #4ade80; font-weight: 600; letter-spacing: 0.08em; }

        .af-empty {
          padding: 40px 24px;
          text-align: center;
          color: rgba(255,255,255,0.3);
          font-size: 14px;
        }
        .af-empty svg { display: block; margin: 0 auto 8px; color: rgba(255,255,255,0.3); }

        .af-feed { padding: 8px 0; }
        .af-entry {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 10px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.15s;
        }
        .af-entry:last-child { border-bottom: none; }
        .af-entry:hover { background: rgba(255,255,255,0.02); }
        .af-entry-icon { font-size: 16px; margin-top: 1px; flex-shrink: 0; width: 22px; height: 22px; text-align: center; display: flex; align-items: center; justify-content: center; }
        .af-entry-body { flex: 1; min-width: 0; }
        .af-entry-top { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 4px; }
        .af-action-badge {
          font-size: 11px; font-weight: 600;
          padding: 2px 8px; border-radius: 6px;
          border: 1px solid;
          white-space: nowrap;
        }
        .af-ref {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: #9f6fe0;
          background: rgba(159,111,224,0.1);
          padding: 1px 6px;
          border-radius: 4px;
        }
        .af-entry-meta { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .af-email { font-size: 12px; color: rgba(255,255,255,0.5); }
        .af-sep { font-size: 12px; color: rgba(255,255,255,0.2); }
        .af-time { font-size: 12px; color: rgba(255,255,255,0.3); }
        .af-details { font-size: 11px; color: rgba(255,255,255,0.25); font-style: italic; }

        .af-expand-btn {
          width: 100%;
          padding: 12px;
          font-size: 13px;
          color: #9f6fe0;
          background: none;
          border: none;
          border-top: 1px solid rgba(255,255,255,0.06);
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: color 0.2s;
        }
        .af-expand-btn:hover { color: #c4b5fd; }
      `}</style>
    </div>
  );
}
