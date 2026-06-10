'use client';

import { useState, useTransition, useEffect } from 'react';
import { Clipboard, Target, Search, Mail, CheckCircle2, AlertCircle, Download, X } from 'lucide-react';
import type { Registration, AuditEntry, EventCapacity, WaitlistEntry } from '@/app/actions/admin';
import { updatePaymentStatus, logoutAdmin, exportRegistrationsToExcel, bulkUpdatePaymentStatus, dispatchSequence } from '@/app/actions/admin';
import AdminMetricsHUD from './AdminMetricsHUD';
import AdminTable from './AdminTable';
import AdminInspectionPanel from './AdminInspectionPanel';
import AdminAuditFeed from './AdminAuditFeed';
import AdminSeatManager from './AdminSeatManager';

interface Props {
  initialRegistrations: Registration[];
  initialAuditLog: AuditEntry[];
  initialCapacities: EventCapacity[];
  initialWaitlist: WaitlistEntry[];
}

type ActiveTab = 'registrations' | 'seats' | 'audit' | 'emails';

export default function AdminDashboardClient({
  initialRegistrations,
  initialAuditLog,
  initialCapacities,
  initialWaitlist,
}: Props) {
  const [registrations, setRegistrations] = useState<Registration[]>(initialRegistrations);
  const [selected, setSelected] = useState<Registration | null>(null);
  const [isPending, startTransition] = useTransition();
  const [actionFeedback, setActionFeedback] = useState<{ id: string; type: 'success' | 'error'; message: string } | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('registrations');
  const [eventStartDate, setEventStartDate] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sophep_event_date') || '2026-10-15';
    }
    return '2026-10-15';
  });
  const [isDispatching, setIsDispatching] = useState<string | null>(null);

  // No longer setting state in effect to avoid cascade render
  useEffect(() => {
    // just in case it changed in another tab or was missing
    const savedDate = localStorage.getItem('sophep_event_date');
    if (savedDate && savedDate !== eventStartDate) {
      setEventStartDate(savedDate);
    }
  }, [eventStartDate]);

  // ── Bulk selection state ────────────────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkPending, setBulkPending] = useState(false);

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleToggleAll = (selectAll: boolean) => {
    if (selectAll) {
      setSelectedIds(new Set(registrations.map(r => r.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  // ── Single status update ────────────────────────────────────────────────────
  const handleStatusUpdate = (id: string, status: 'verified' | 'rejected') => {
    startTransition(async () => {
      const result = await updatePaymentStatus(id, status);
      if (result.success) {
        setRegistrations(prev =>
          prev.map(r => r.id === id ? { ...r, payment_status: status } : r)
        );
        if (selected?.id === id) {
          setSelected(prev => prev ? { ...prev, payment_status: status } : null);
        }
        setActionFeedback({
          id,
          type: 'success',
          message: status === 'verified' ? 'Payment verified & confirmation email sent.' : 'Application rejected.',
        });
        setTimeout(() => setActionFeedback(null), 4000);
      } else {
        setActionFeedback({ id, type: 'error', message: result.error || 'Action failed.' });
        setTimeout(() => setActionFeedback(null), 4000);
      }
    });
  };

  // ── Bulk status update ──────────────────────────────────────────────────────
  const handleBulkAction = async (status: 'verified' | 'rejected') => {
    if (!selectedIds.size) return;
    setBulkPending(true);
    
    // Get CSRF token from cookie
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('admin_csrf='))
      ?.split('=')[1] || '';
    
    const ids = Array.from(selectedIds);
    const result = await bulkUpdatePaymentStatus(csrfToken, ids, status);
    setBulkPending(false);

    if (result.success) {
      setRegistrations(prev =>
        // Only update rows that were actually pending (server already filtered them)
        prev.map(r =>
          selectedIds.has(r.id) && r.payment_status === 'pending'
            ? { ...r, payment_status: status }
            : r
        )
      );
      setSelectedIds(new Set());
      const skippedNote = result.skipped > 0 ? ` (${result.skipped} already processed — skipped)` : '';
      setActionFeedback({
        id: 'bulk',
        type: 'success',
        message: `${result.updated} application(s) ${status === 'verified' ? 'verified' : 'rejected'}.${skippedNote}`,
      });
    } else {
      setActionFeedback({ id: 'bulk', type: 'error', message: result.error || 'Bulk action failed.' });
    }
    setTimeout(() => setActionFeedback(null), 5000);
  };

  // ── Excel export ────────────────────────────────────────────────────────────
  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Get CSRF token from cookie
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('admin_csrf='))
        ?.split('=')[1] || '';
      
      const result = await exportRegistrationsToExcel(csrfToken);
      if (result.success && result.base64 && result.filename) {
        const bytes = Uint8Array.from(atob(result.base64), (c) => c.charCodeAt(0));
        const blob = new Blob([bytes], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.filename;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        alert('Export failed: ' + (result.error ?? 'Unknown error'));
      }
    } finally {
      setIsExporting(false);
    }
  };

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'registrations', label: 'Registrations', icon: <Clipboard className="w-5 h-5" />, badge: registrations.length },
    { id: 'seats', label: 'Seat Manager', icon: <Target className="w-5 h-5" />, badge: initialWaitlist.length || undefined },
    { id: 'audit', label: 'Activity Log', icon: <Search className="w-5 h-5" />, badge: initialAuditLog.length || undefined },
    { id: 'emails', label: 'Emails & Settings', icon: <Mail className="w-5 h-5" /> },
  ];

  return (
    <div className="adm-root">
      {/* Background */}
      <div className="adm-bg-orb adm-orb-1" />
      <div className="adm-bg-orb adm-orb-2" />

      {/* Top Nav */}
      <nav className="adm-nav">
        <div className="adm-nav-brand">
          <div className="adm-nav-logo">S</div>
          <div>
            <div className="adm-nav-title">SOPHEP</div>
            <div className="adm-nav-sub">Command Centre</div>
          </div>
        </div>
        <div className="adm-nav-actions">
          {actionFeedback && (
            <div className={`adm-toast adm-toast-${actionFeedback.type}`}>
              {actionFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              {actionFeedback.message}
            </div>
          )}
          <form action={logoutAdmin}>
            <button type="submit" className="adm-logout-btn">Sign Out</button>
          </form>
        </div>
      </nav>

      {/* Main Content */}
      <main className="adm-main">
        {/* Page Header */}
        <header className="adm-page-header">
          <h1 className="adm-page-title">Command Centre</h1>
          <p className="adm-page-desc">Monitor and verify delegate registrations in real-time.</p>
        </header>

        {/* Metrics HUD */}
        <AdminMetricsHUD registrations={registrations} />

        {/* Tab Navigation */}
        <div className="adm-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`adm-tab ${activeTab === tab.id ? 'adm-tab-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="adm-tab-icon">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="adm-tab-badge">{tab.badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── Registrations Tab ── */}
        {activeTab === 'registrations' && (
          <>
            <div className="adm-section-header">
              <div>
                <h2 className="adm-section-title">All Registrations</h2>
                <p className="adm-section-subtitle">{registrations.length} total applications received</p>
              </div>
              <div className="adm-section-actions">
                <button
                  className="adm-export-btn"
                  onClick={handleExport}
                  disabled={isExporting || registrations.length === 0}
                  title="Download all registrations as Excel"
                >
                  {isExporting ? 'Processing...' : <>
                    <Download className="inline-block w-4 h-4 mr-1" />
                    Export Excel
                  </>}
                </button>
              </div>
            </div>

            {/* Bulk Action Bar */}
            {selectedIds.size > 0 && (
              <div className="adm-bulk-bar">
                <span className="adm-bulk-count">{selectedIds.size} selected</span>
                <div className="adm-bulk-actions">
                  <button
                    className="adm-bulk-btn adm-bulk-verify"
                    onClick={() => handleBulkAction('verified')}
                    disabled={isBulkPending}
                  >
                    {isBulkPending ? '...' : <>
                      <CheckCircle2 className="inline-block w-4 h-4 mr-1" />
                      Approve All ({selectedIds.size})
                    </>}
                  </button>
                  <button
                    className="adm-bulk-btn adm-bulk-reject"
                    onClick={() => handleBulkAction('rejected')}
                    disabled={isBulkPending}
                  >
                    {isBulkPending ? '...' : <>
                      <X className="inline-block w-4 h-4 mr-1" />
                      Reject All ({selectedIds.size})
                    </>}
                  </button>
                  <button
                    className="adm-bulk-btn adm-bulk-clear"
                    onClick={() => setSelectedIds(new Set())}
                    disabled={isBulkPending}
                  >
                    <X className="inline-block w-4 h-4 mr-1" />
                    Clear
                  </button>
                </div>
              </div>
            )}

            <AdminTable
              registrations={registrations}
              onRowClick={setSelected}
              selectedId={selected?.id ?? null}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onToggleAll={handleToggleAll}
            />
          </>
        )}

        {/* ── Seat Manager Tab ── */}
        {activeTab === 'seats' && (
          <>
            <div className="adm-section-header">
              <div>
                <h2 className="adm-section-title">Seat Manager</h2>
                <p className="adm-section-subtitle">Control per-event capacity and view the waitlist queue</p>
              </div>
            </div>
            <AdminSeatManager
              initialCapacities={initialCapacities}
              initialWaitlist={initialWaitlist}
            />
          </>
        )}

        {/* ── Audit Log Tab ── */}
        {activeTab === 'audit' && (
          <>
            <div className="adm-section-header">
              <div>
                <h2 className="adm-section-title">Activity Log</h2>
                <p className="adm-section-subtitle">Full history of admin actions on this platform</p>
              </div>
            </div>
            <AdminAuditFeed entries={initialAuditLog} />
          </>
        )}

        {/* ── Emails & Settings Tab ── */}
        {activeTab === 'emails' && (
          <>
            <div className="adm-section-header">
              <div>
                <h2 className="adm-section-title">Email Sequences & Settings</h2>
                <p className="adm-section-subtitle">Manage automated event communications and global settings</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
              {/* Settings Panel */}
              <div style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-fg)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Global Settings</h3>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-fg-muted)', marginBottom: '8px' }}>Event Start Date</label>
                  <input 
                    type="date" 
                    value={eventStartDate}
                    onChange={(e) => setEventStartDate(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'var(--color-nav-bg)', border: '1px solid var(--color-border-hover)', color: 'var(--color-fg)', outline: 'none' }}
                  />
                  <p style={{ fontSize: '11px', color: 'var(--color-fg-muted)', marginTop: '8px' }}>This date is used to calculate the 7-day and 1-day email sequences.</p>
                </div>
                <button 
                  onClick={() => {
                    localStorage.setItem('sophep_event_date', eventStartDate);
                    setActionFeedback({ id: 'date', type: 'success', message: 'Settings saved successfully.' });
                    setTimeout(() => setActionFeedback(null), 3000);
                  }}
                  className="adm-export-btn"
                  style={{ width: '100%' }}
                >
                  Save Settings
                </button>
              </div>

              {/* Email Sequences Panel */}
              <div style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-fg)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Drip Sequences Overview</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { id: 'confirmed', title: "Registration Confirmed", trigger: "Immediate on Submit", status: "Active", count: registrations.length },
                    { id: 'verified', title: "Payment Verified + QR", trigger: "On Admin Approval", status: "Active", count: registrations.filter(r => r.payment_status === 'verified').length },
                    { id: '7_days', title: "7 Days to Event (Checklist)", trigger: "7 Days Before Event Date", status: "Scheduled", count: registrations.filter(r => r.payment_status === 'verified').length },
                    { id: 'schedule', title: "Schedule Released", trigger: "5 Days Before Event Date", status: "Scheduled", count: registrations.filter(r => r.payment_status === 'verified').length },
                    { id: 'accommodation', title: "Accommodation Details", trigger: "3 Days Before (If applicable)", status: "Scheduled", count: registrations.filter(r => r.payment_status === 'verified' && r.accommodation_needed).length },
                    { id: '1_day', title: "Day-before Reminder & Map", trigger: "1 Day Before Event Date", status: "Scheduled", count: registrations.filter(r => r.payment_status === 'verified').length },
                  ].map((seq) => (
                    <div key={seq.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--color-nav-bg)', borderRadius: '8px', border: '1px solid var(--color-border-hover)' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-fg)' }}>{seq.title}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-fg-muted)', marginTop: '4px' }}>Trigger: {seq.trigger}</div>
                      </div>
                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                        <div>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: seq.status === 'Active' ? '#4ade80' : '#c4b5fd' }}>{seq.status}</span>
                          <span style={{ fontSize: '11px', color: 'var(--color-fg-muted)', marginLeft: '8px' }}>{seq.count} Dispatched/Queued</span>
                        </div>
                        {seq.status === 'Scheduled' && (
                          <button
                            onClick={async () => {
                              setIsDispatching(seq.id);
                              const res = await dispatchSequence(seq.id);
                              setIsDispatching(null);
                              if (res.success) {
                                setActionFeedback({ id: seq.id, type: 'success', message: `Dispatched to ${res.count} delegates.` });
                              } else {
                                setActionFeedback({ id: seq.id, type: 'error', message: res.error || 'Dispatch failed' });
                              }
                              setTimeout(() => setActionFeedback(null), 4000);
                            }}
                            disabled={isDispatching !== null || seq.count === 0}
                            style={{ 
                              background: 'rgba(124,58,237,0.15)', 
                              border: '1px solid rgba(124,58,237,0.3)', 
                              color: '#c4b5fd', 
                              padding: '4px 12px', 
                              borderRadius: '6px', 
                              fontSize: '11px', 
                              fontWeight: 600,
                              cursor: (isDispatching !== null || seq.count === 0) ? 'not-allowed' : 'pointer',
                              opacity: (isDispatching !== null || seq.count === 0) ? 0.5 : 1
                            }}
                          >
                            {isDispatching === seq.id ? 'Sending...' : 'Send Now'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Inspection Panel (registrations tab only) */}
      {activeTab === 'registrations' && (
        <AdminInspectionPanel
          registration={selected}
          onClose={() => setSelected(null)}
          onStatusUpdate={handleStatusUpdate}
          isPending={isPending}
        />
      )}

      <style jsx>{`
        .adm-root {
          min-height: 100dvh;
          background: #05010f;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          font-family: 'Inter', sans-serif;
          color: #fff;
          position: relative;
          overflow-x: hidden;
        }
        .adm-bg-orb {
          position: fixed; border-radius: 50%;
          filter: blur(120px); opacity: 0.12;
          pointer-events: none; z-index: 0;
        }
        .adm-orb-1 { width: 700px; height: 700px; background: #7c3aed; top: -250px; left: -250px; }
        .adm-orb-2 { width: 600px; height: 600px; background: #4f46e5; bottom: -200px; right: -200px; }

        .adm-nav {
          position: sticky; top: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 32px; height: 72px;
          background: rgba(5,1,15,0.65);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
        }
        .adm-nav-brand { display: flex; align-items: center; gap: 14px; }
        .adm-nav-logo {
          width: 40px; height: 40px;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; font-weight: 800; color: #fff;
          box-shadow: 0 4px 20px rgba(124,58,237,0.3);
        }
        .adm-nav-title { font-size: 16px; font-weight: 700; letter-spacing: 0.12em; color: #fff; margin-bottom: 2px; }
        .adm-nav-sub { font-size: 11px; color: rgba(255,255,255,0.4); letter-spacing: 0.08em; text-transform: uppercase; }
        .adm-nav-actions { display: flex; align-items: center; gap: 16px; }

        .adm-toast {
          padding: 10px 20px; border-radius: 10px; font-size: 13px; font-weight: 600;
          animation: fadeInSlide 0.3s cubic-bezier(0.16,1,0.3,1);
          box-shadow: 0 8px 30px rgba(0,0,0,0.2); backdrop-filter: blur(10px);
        }
        .adm-toast-success { background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.3); color: #4ade80; }
        .adm-toast-error { background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); color: #fca5a5; }
        @keyframes fadeInSlide { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

        .adm-logout-btn {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.7); padding: 10px 20px; border-radius: 10px;
          font-size: 13px; font-weight: 500; cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16,1,0.3,1); font-family: 'Inter', sans-serif;
        }
        .adm-logout-btn:hover {
          background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.3);
          color: #fca5a5; transform: translateY(-1px);
        }

        .adm-main {
          position: relative; z-index: 1;
          max-width: 1400px; margin: 0 auto;
          padding: 48px 32px 80px;
        }

        .adm-page-header { margin-bottom: 40px; }
        .adm-page-title {
          font-size: 36px; font-weight: 800; letter-spacing: -0.02em;
          color: #fff; margin: 0 0 8px;
          background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .adm-page-desc { font-size: 16px; color: rgba(255,255,255,0.5); margin: 0; font-weight: 400; }

        /* Tabs */
        .adm-tabs {
          display: flex; gap: 4px;
          margin-bottom: 32px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 6px;
          width: fit-content;
        }
        .adm-tab {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 20px; border-radius: 10px;
          font-size: 14px; font-weight: 500;
          color: rgba(255,255,255,0.5); background: none; border: none;
          cursor: pointer; transition: all 0.2s; font-family: 'Inter', sans-serif;
          white-space: nowrap;
        }
        .adm-tab:hover { color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.04); }
        .adm-tab-active {
          background: rgba(124,58,237,0.2) !important;
          color: #c4b5fd !important;
          border: 1px solid rgba(124,58,237,0.3);
        }
        .adm-tab-icon { font-size: 16px; }
        .adm-tab-badge {
          background: rgba(124,58,237,0.25); color: #c4b5fd;
          font-size: 11px; font-weight: 700;
          padding: 1px 7px; border-radius: 20px;
          min-width: 20px; text-align: center;
        }
        .adm-tab-active .adm-tab-badge { background: rgba(124,58,237,0.4); }

        /* Section header */
        .adm-section-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 24px; padding-top: 8px;
        }
        .adm-section-title { font-size: 22px; font-weight: 700; margin: 0 0 6px; letter-spacing: -0.01em; }
        .adm-section-subtitle { font-size: 14px; color: rgba(255,255,255,0.4); margin: 0; }
        .adm-section-actions { display: flex; align-items: center; gap: 12px; }

        .adm-export-btn {
          background: rgba(124,58,237,0.1); border: 1px solid rgba(124,58,237,0.3);
          color: #c4b5fd; padding: 10px 20px; border-radius: 10px;
          font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s;
          font-family: 'Inter', sans-serif; white-space: nowrap;
        }
        .adm-export-btn:hover:not(:disabled) {
          background: rgba(124,58,237,0.18); border-color: rgba(124,58,237,0.5);
          color: #a78bfa; transform: translateY(-1px);
        }
        .adm-export-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Bulk action bar */
        .adm-bulk-bar {
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; flex-wrap: wrap;
          background: rgba(124,58,237,0.08);
          border: 1px solid rgba(124,58,237,0.25);
          border-radius: 12px; padding: 12px 20px;
          margin-bottom: 16px;
          animation: fadeInSlide 0.25s ease;
        }
        .adm-bulk-count {
          font-size: 14px; font-weight: 700; color: #c4b5fd;
        }
        .adm-bulk-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .adm-bulk-btn {
          padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600;
          cursor: pointer; border: 1px solid; font-family: 'Inter', sans-serif;
          transition: all 0.2s; white-space: nowrap;
        }
        .adm-bulk-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .adm-bulk-verify {
          background: rgba(34,197,94,0.12); border-color: rgba(34,197,94,0.3); color: #4ade80;
        }
        .adm-bulk-verify:hover:not(:disabled) { background: rgba(34,197,94,0.2); }
        .adm-bulk-reject {
          background: rgba(239,68,68,0.12); border-color: rgba(239,68,68,0.3); color: #fca5a5;
        }
        .adm-bulk-reject:hover:not(:disabled) { background: rgba(239,68,68,0.2); }
        .adm-bulk-clear {
          background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.12); color: rgba(255,255,255,0.5);
        }
        .adm-bulk-clear:hover:not(:disabled) { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.8); }
      `}</style>
    </div>
  );
}
