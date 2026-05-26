'use client';

import { useState } from 'react';
import type { EventCapacity, WaitlistEntry } from '@/app/actions/admin';
import { updateEventCapacity } from '@/app/actions/admin';

interface Props {
  initialCapacities: EventCapacity[];
  initialWaitlist: WaitlistEntry[];
}

export default function AdminSeatManager({ initialCapacities, initialWaitlist }: Props) {
  const [capacities, setCapacities] = useState<EventCapacity[]>(initialCapacities);
  const [editing, setEditing] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ event: string; ok: boolean; msg: string } | null>(null);

  const handleEdit = (eventType: string, value: number) => {
    setEditing(prev => ({ ...prev, [eventType]: value }));
  };

  const handleSave = async (eventType: string) => {
    const newCap = editing[eventType];
    if (!newCap || newCap < 1) return;
    setSaving(eventType);
    const result = await updateEventCapacity(eventType, newCap);
    setSaving(null);

    if (result.success) {
      setCapacities(prev =>
        prev.map(c =>
          c.event_type === eventType
            ? { ...c, total_capacity: newCap, available: Math.max(0, newCap - c.verified_count), is_full: c.verified_count >= newCap }
            : c
        )
      );
      setEditing(prev => { const n = { ...prev }; delete n[eventType]; return n; });
      setFeedback({ event: eventType, ok: true, msg: `Capacity updated to ${newCap}` });
    } else {
      setFeedback({ event: eventType, ok: false, msg: result.error ?? 'Update failed' });
    }
    setTimeout(() => setFeedback(null), 3000);
  };

  // Group waitlist by event
  const waitlistByEvent: Record<string, WaitlistEntry[]> = {};
  initialWaitlist.forEach(w => {
    if (!waitlistByEvent[w.event_type]) waitlistByEvent[w.event_type] = [];
    waitlistByEvent[w.event_type].push(w);
  });

  return (
    <div className="sm-root">
      {/* Migration warning — shown when tables haven't been created yet */}
      {initialCapacities.length === 0 && (
        <div className="sm-migration-warning">
          <div className="sm-mw-icon">⚠️</div>
          <div className="sm-mw-content">
            <strong>Database migrations required</strong>
            <p>The seat capacity tables don&apos;t exist yet. Run these two SQL files in your Supabase dashboard (SQL Editor):</p>
            <ol>
              <li><code>supabase/migrations/04_audit_log.sql</code></li>
              <li><code>supabase/migrations/05_seat_capacity_waitlist.sql</code></li>
            </ol>
            <p>After running them, refresh this page and the Seat Manager will work.</p>
          </div>
        </div>
      )}

      {/* Seat Capacity Cards */}
      <div className="sm-grid">
        {capacities.map((cap) => {
          const usedPct = Math.min(100, Math.round((cap.verified_count / cap.total_capacity) * 100));
          const isEditing = editing[cap.event_type] !== undefined;
          const isSaving = saving === cap.event_type;
          const fb = feedback?.event === cap.event_type ? feedback : null;

          return (
            <div
              key={cap.event_type}
              className="sm-card"
              style={{ borderColor: cap.is_full ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.08)' }}
            >
              {/* Header */}
              <div className="sm-card-header">
                <div>
                  <div className="sm-event-name">{cap.event_type}</div>
                  <div className="sm-event-status" style={{ color: cap.is_full ? '#ef4444' : '#22c55e' }}>
                    {cap.is_full ? '⛔ Full' : `✅ ${cap.available} spots available`}
                  </div>
                </div>
                <div className="sm-count-badge" style={{ color: cap.is_full ? '#fca5a5' : '#4ade80' }}>
                  {cap.verified_count} / {cap.total_capacity}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="sm-progress-track">
                <div
                  className="sm-progress-fill"
                  style={{
                    width: `${usedPct}%`,
                    background: usedPct >= 90 ? '#ef4444' : usedPct >= 70 ? '#f59e0b' : '#22c55e',
                  }}
                />
              </div>
              <div className="sm-progress-label">{usedPct}% filled</div>

              {/* Capacity Editor */}
              <div className="sm-editor">
                <label className="sm-editor-label">Total Capacity</label>
                <div className="sm-editor-row">
                  <input
                    type="number"
                    min={cap.verified_count}
                    value={isEditing ? editing[cap.event_type] : cap.total_capacity}
                    onChange={(e) => handleEdit(cap.event_type, parseInt(e.target.value) || 0)}
                    className="sm-input"
                  />
                  {isEditing && (
                    <button
                      className="sm-save-btn"
                      onClick={() => handleSave(cap.event_type)}
                      disabled={isSaving}
                    >
                      {isSaving ? '...' : 'Save'}
                    </button>
                  )}
                </div>
                {fb && (
                  <div className="sm-feedback" style={{ color: fb.ok ? '#4ade80' : '#fca5a5' }}>
                    {fb.ok ? '✓' : '⚠'} {fb.msg}
                  </div>
                )}
              </div>

              {/* Waitlist count */}
              {waitlistByEvent[cap.event_type] && (
                <div className="sm-waitlist-count">
                  ⏳ {waitlistByEvent[cap.event_type].length} on waitlist
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Waitlist Table */}
      {initialWaitlist.length > 0 && (
        <div className="sm-waitlist-section">
          <h3 className="sm-waitlist-title">Waitlist Queue</h3>
          <div className="sm-wl-wrapper">
            <table className="sm-wl-table">
              <thead>
                <tr className="sm-wl-head">
                  <th className="sm-wl-th">#</th>
                  <th className="sm-wl-th">Name</th>
                  <th className="sm-wl-th">Event</th>
                  <th className="sm-wl-th">Institution</th>
                  <th className="sm-wl-th">Email</th>
                  <th className="sm-wl-th">Joined</th>
                </tr>
              </thead>
              <tbody>
                {initialWaitlist.map((w) => (
                  <tr key={w.id} className="sm-wl-row">
                    <td className="sm-wl-td">
                      <span className="sm-wl-pos">#{w.position}</span>
                    </td>
                    <td className="sm-wl-td sm-wl-name">{w.full_name}</td>
                    <td className="sm-wl-td">
                      <span className="sm-wl-event">{w.event_type}</span>
                    </td>
                    <td className="sm-wl-td sm-wl-muted">{w.institution}</td>
                    <td className="sm-wl-td sm-wl-muted">{w.email}</td>
                    <td className="sm-wl-td sm-wl-muted">
                      {new Date(w.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style jsx>{`
        .sm-root { display: flex; flex-direction: column; gap: 32px; }

        /* Migration warning card */
        .sm-migration-warning {
          display: flex; gap: 16px; align-items: flex-start;
          background: rgba(251,191,36,0.08);
          border: 1px solid rgba(251,191,36,0.3);
          border-radius: 14px; padding: 20px 24px;
        }
        .sm-mw-icon { font-size: 28px; flex-shrink: 0; }
        .sm-mw-content { font-size: 14px; line-height: 1.7; color: rgba(255,255,255,0.8); }
        .sm-mw-content strong { color: #fbbf24; font-size: 15px; display: block; margin-bottom: 6px; }
        .sm-mw-content p { margin: 0 0 8px; color: rgba(255,255,255,0.6); }
        .sm-mw-content ol { margin: 0 0 8px; padding-left: 20px; color: rgba(255,255,255,0.6); }
        .sm-mw-content li { margin-bottom: 4px; }
        .sm-mw-content code {
          font-family: 'Courier New', monospace; font-size: 12px;
          background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 4px;
          color: #c4b5fd;
        }

        .sm-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .sm-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid;
          border-radius: 16px;
          padding: 22px;
          transition: border-color 0.2s;
        }
        .sm-card-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
        .sm-event-name { font-size: 20px; font-weight: 800; letter-spacing: 0.05em; margin-bottom: 4px; }
        .sm-event-status { font-size: 12px; font-weight: 600; }
        .sm-count-badge { font-size: 28px; font-weight: 800; font-variant-numeric: tabular-nums; }

        .sm-progress-track {
          height: 6px; background: rgba(255,255,255,0.08);
          border-radius: 99px; overflow: hidden; margin-bottom: 6px;
        }
        .sm-progress-fill { height: 100%; border-radius: 99px; transition: width 0.5s ease; }
        .sm-progress-label { font-size: 11px; color: rgba(255,255,255,0.35); margin-bottom: 18px; }

        .sm-editor-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: rgba(255,255,255,0.4); display: block; margin-bottom: 8px; }
        .sm-editor-row { display: flex; gap: 8px; align-items: center; }
        .sm-input {
          flex: 1; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
          border-radius: 8px; padding: 8px 12px; color: #fff; font-size: 14px; font-weight: 600;
          font-family: 'Inter', sans-serif;
          outline: none; transition: border-color 0.2s;
        }
        .sm-input:focus { border-color: rgba(124,58,237,0.5); }
        .sm-save-btn {
          background: rgba(124,58,237,0.2); border: 1px solid rgba(124,58,237,0.4);
          color: #c4b5fd; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600;
          cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.2s; white-space: nowrap;
        }
        .sm-save-btn:hover { background: rgba(124,58,237,0.3); }
        .sm-save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .sm-feedback { font-size: 12px; margin-top: 6px; font-weight: 600; }
        .sm-waitlist-count {
          margin-top: 14px; padding-top: 14px;
          border-top: 1px solid rgba(255,255,255,0.06);
          font-size: 12px; color: #fbbf24; font-weight: 600;
        }

        /* Waitlist table */
        .sm-waitlist-section {}
        .sm-waitlist-title { font-size: 18px; font-weight: 700; margin: 0 0 16px; }
        .sm-wl-wrapper {
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; overflow: hidden;
        }
        .sm-wl-table { width: 100%; border-collapse: collapse; }
        .sm-wl-head { background: rgba(255,255,255,0.03); border-bottom: 1px solid rgba(255,255,255,0.06); }
        .sm-wl-th {
          padding: 12px 16px; font-size: 10px; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(255,255,255,0.3); text-align: left;
        }
        .sm-wl-row { border-bottom: 1px solid rgba(255,255,255,0.04); }
        .sm-wl-row:last-child { border-bottom: none; }
        .sm-wl-td { padding: 12px 16px; font-size: 13px; color: rgba(255,255,255,0.7); }
        .sm-wl-name { font-weight: 600; color: #fff; }
        .sm-wl-muted { color: rgba(255,255,255,0.4); font-size: 12px; }
        .sm-wl-pos {
          font-family: 'Courier New', monospace; font-size: 12px;
          color: #fbbf24; background: rgba(251,191,36,0.1); padding: 2px 6px; border-radius: 4px;
        }
        .sm-wl-event {
          font-size: 11px; font-weight: 700; color: #9f6fe0;
          background: rgba(159,111,224,0.1); padding: 2px 8px; border-radius: 6px;
        }
      `}</style>
    </div>
  );
}
