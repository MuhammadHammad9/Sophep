'use client';

import { useState } from 'react';
import { X, AlertTriangle, Check, Hourglass, Lock } from 'lucide-react';
import type { Registration } from '@/app/actions/admin';

// ── Inline Receipt Viewer ─────────────────────────────────────────────────────
// Detects PDF vs image by URL extension. PDFs render in an iframe;
// images render as a click-to-zoom img element.
function ReceiptViewer({ url, registrationId }: { url: string; registrationId: string }) {
  const [enlarged, setEnlarged] = useState(false);
  const isPdf = url.toLowerCase().includes('.pdf') || url.toLowerCase().includes('content-type=application%2Fpdf');

  if (isPdf) {
    return (
      <div className="ip-receipt-wrapper">
        <div className="ip-pdf-container">
          <iframe
            src={url}
            title="Payment Receipt PDF"
            className="ip-pdf-iframe"
          />
        </div>
        <div className="ip-receipt-hint">
          <a href={url} target="_blank" rel="noopener noreferrer" className="ip-link">
            <span className="inline-block mr-1">↗</span> Open PDF in new tab
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="ip-receipt-wrapper">
      <div className="ip-receipt-img-container">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt="Payment receipt"
          className={`ip-receipt-img ${enlarged ? 'ip-receipt-enlarged' : ''}`}
          onClick={() => setEnlarged((e) => !e)}
          title={enlarged ? 'Click to shrink' : 'Click to enlarge'}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            const fallback = document.getElementById(`receipt-fallback-${registrationId}`);
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        <div
          id={`receipt-fallback-${registrationId}`}
          className="ip-receipt-fallback"
          style={{ display: 'none' }}
        >
          <AlertTriangle className="w-5 h-5 mx-auto mb-2" />
          <span>Image preview unavailable.</span>
          <a href={url} target="_blank" rel="noopener noreferrer" className="ip-link">
            Open receipt directly
          </a>
        </div>
      </div>
      <div className="ip-receipt-hint">
        <a href={url} target="_blank" rel="noopener noreferrer" className="ip-link">
          ↗ Open in new tab
        </a>
      </div>
    </div>
  );
}


interface Props {
  registration: Registration | null;
  onClose: () => void;
  onStatusUpdate: (id: string, status: 'verified' | 'rejected') => void;
  isPending: boolean;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="ip-info-row">
      <span className="ip-info-label">{label}</span>
      <span className="ip-info-value">{value ?? '—'}</span>
    </div>
  );
}

export default function AdminInspectionPanel({ registration: r, onClose, onStatusUpdate, isPending }: Props) {
  const isOpen = !!r;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="ip-backdrop" onClick={onClose} aria-hidden="true" />
      )}

      {/* Slide-over panel */}
      <aside className={`ip-panel ${isOpen ? 'ip-panel-open' : ''}`} aria-label="Registration details">
        {!r ? null : (
          <>
            {/* Panel Header */}
            <div className="ip-header">
              <div>
                <div className="ip-ref">Ref #{r.id.slice(0, 8).toUpperCase()}</div>
                <div className="ip-applicant-name">{r.full_name}</div>
              </div>
              <button className="ip-close-btn" onClick={onClose} aria-label="Close panel">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="ip-body">

              {/* Applicant Info */}
              <section className="ip-section">
                <h3 className="ip-section-title">Applicant Information</h3>
                <InfoRow label="Email" value={<a href={`mailto:${r.email}`} className="ip-link">{r.email}</a>} />
                <InfoRow label="Phone" value={r.phone} />
                <InfoRow label="CNIC" value={r.cnic} />
                <InfoRow label="Institution" value={r.institution} />
              </section>

              {/* Event Info */}
              <section className="ip-section">
                <h3 className="ip-section-title">Registration Details</h3>
                <InfoRow label="Event" value={r.event_type} />
                <InfoRow label="Type" value={r.delegate_type} />
                <InfoRow label="Amount" value={`PKR ${(r.total_amount ?? 0).toLocaleString()}`} />
                <InfoRow label="Accommodation" value={r.accommodation_needed ? <><Check className="inline-block w-4 h-4 mr-1" />Yes</> : 'No'} />
                <InfoRow label="Transportation" value={r.transportation_needed ? <><Check className="inline-block w-4 h-4 mr-1" />Yes</> : 'No'} />
              </section>

              {/* Delegation Roster */}
              {r.delegates && r.delegates.length > 0 && (
                <section className="ip-section">
                  <h3 className="ip-section-title">Delegation Roster ({r.delegates.length} members)</h3>
                  <div className="ip-delegates-list">
                    {r.delegates.map((d, i) => (
                      <div key={d.id} className="ip-delegate-card">
                        <div className="ip-delegate-num">{i + 1}</div>
                        <div className="ip-delegate-info">
                          <div className="ip-delegate-name">{d.full_name}</div>
                          <div className="ip-delegate-meta">{d.institution} · {d.event_preference}</div>
                          <div className="ip-delegate-meta">{d.cnic} · {d.phone}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Payment Receipt */}
              <section className="ip-section">
                <h3 className="ip-section-title">Payment Receipt</h3>
                {r.payment_receipt_url ? (
                  <ReceiptViewer url={r.payment_receipt_url} registrationId={r.id} />
                ) : (
                  <div className="ip-no-receipt">No receipt uploaded</div>
                )}
              </section>

            </div>

            {/* Action Zone */}
            {r.payment_status === 'pending' ? (
              <div className="ip-action-zone">
                <button
                  className="ip-action-btn ip-action-verify"
                  onClick={() => onStatusUpdate(r.id, 'verified')}
                  disabled={isPending}
                >
                  {isPending ? <>
                    <Hourglass className="inline-block w-4 h-4 mr-1" />
                    Processing...
                  </> : <>
                    <Check className="inline-block w-4 h-4 mr-1" />
                    Verify Payment
                  </>}
                </button>
                <button
                  className="ip-action-btn ip-action-reject"
                  onClick={() => onStatusUpdate(r.id, 'rejected')}
                  disabled={isPending}
                >
                  {isPending ? <>
                    <Hourglass className="inline-block w-4 h-4 mr-1" />
                    Processing...
                  </> : <>
                    <X className="inline-block w-4 h-4 mr-1" />
                    Reject Application
                  </>}
                </button>
              </div>
            ) : (
              <div className="ip-locked-zone">
                <div className={`ip-locked-banner ${r.payment_status === 'verified' ? 'ip-locked-verified' : 'ip-locked-rejected'}`}>
                  <div className="ip-locked-icon">
                    {r.payment_status === 'verified' ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
                  </div>
                  <div className="ip-locked-text">
                    <strong>{r.payment_status === 'verified' ? 'Payment Verified' : 'Application Rejected'}</strong>
                    <span>This registration has been finalized and cannot be changed.</span>
                  </div>
                  <div className="ip-locked-badge">
                    <Lock className="inline-block w-3 h-3 mr-1" />
                    Locked
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </aside>

      <style jsx>{`
        .ip-backdrop {
          position: fixed; inset: 0; z-index: 199;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
        }
        .ip-panel {
          position: fixed; top: 0; right: 0; bottom: 0;
          width: 480px; max-width: 95vw;
          z-index: 200;
          background: #0e0820;
          border-left: 1px solid rgba(255,255,255,0.08);
          display: flex; flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
          overflow: hidden;
        }
        .ip-panel-open { transform: translateX(0); }

        .ip-header {
          padding: 24px 24px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: flex-start; justify-content: space-between;
          background: #0e0820; /* Solid background to prevent overlap */
          position: sticky; top: 0; z-index: 10;
          flex-shrink: 0;
        }
        .ip-ref { font-family: monospace; font-size: 12px; color: #9f6fe0; margin-bottom: 6px; }
        .ip-applicant-name { font-size: 20px; font-weight: 700; color: #fff; }
        .ip-close-btn {
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.5); width: 32px; height: 32px;
          border-radius: 8px; cursor: pointer; font-size: 14px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s; flex-shrink: 0;
        }
        .ip-close-btn:hover { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.3); color: #fca5a5; }

        .ip-body { flex: 1; overflow-y: auto; padding: 0 24px; }
        .ip-body::-webkit-scrollbar { width: 4px; }
        .ip-body::-webkit-scrollbar-track { background: transparent; }
        .ip-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

        .ip-section { padding: 20px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .ip-section:last-child { border-bottom: none; }
        .ip-section-title { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: rgba(255,255,255,0.3); margin: 0 0 14px; }

        .ip-info-row { display: flex; justify-content: space-between; align-items: baseline; padding: 7px 0; gap: 12px; }
        .ip-info-label { font-size: 13px; color: rgba(255,255,255,0.35); flex-shrink: 0; }
        .ip-info-value { font-size: 13px; color: rgba(255,255,255,0.8); font-weight: 500; text-align: right; word-break: break-all; }
        .ip-link { color: #9f6fe0; text-decoration: none; }
        .ip-link:hover { text-decoration: underline; }

        .ip-delegates-list { display: flex; flex-direction: column; gap: 8px; }
        .ip-delegate-card { display: flex; gap: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 12px; }
        .ip-delegate-num { width: 24px; height: 24px; background: rgba(124,58,237,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #9f6fe0; flex-shrink: 0; }
        .ip-delegate-name { font-size: 14px; font-weight: 600; color: #fff; margin-bottom: 3px; }
        .ip-delegate-meta { font-size: 12px; color: rgba(255,255,255,0.35); }

        .ip-receipt-wrapper { text-align: center; }
        .ip-receipt-img-container { background: rgba(0,0,0,0.2); border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); padding: 8px; min-height: 100px; display: flex; align-items: center; justify-content: center; }
        .ip-receipt-img { max-width: 100%; max-height: 300px; border-radius: 6px; cursor: zoom-in; transition: transform 0.3s; object-fit: contain; }
        .ip-receipt-enlarged { transform: scale(1.05); cursor: zoom-out; max-height: none; z-index: 50; position: relative; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
        .ip-receipt-fallback { padding: 20px; font-size: 13px; color: rgba(255,255,255,0.5); line-height: 1.6; flex-direction: column; align-items: center; gap: 8px; }
        .ip-receipt-hint { font-size: 12px; margin-top: 12px; }
        .ip-no-receipt { font-size: 13px; color: rgba(255,255,255,0.25); font-style: italic; }

        .ip-pdf-container { border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; background: #fff; }
        .ip-pdf-iframe { width: 100%; height: 420px; border: none; display: block; }

        .ip-action-zone {
          padding: 20px 24px;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex; flex-direction: column; gap: 10px;
          flex-shrink: 0;
        }
        .ip-action-btn {
          width: 100%; padding: 14px; border-radius: 12px;
          font-size: 15px; font-weight: 600; cursor: pointer;
          border: none; transition: all 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .ip-action-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .ip-action-verify { background: linear-gradient(135deg, #16a34a, #22c55e); color: #fff; box-shadow: 0 4px 20px rgba(34,197,94,0.25); }
        .ip-action-verify:hover:not(:disabled) { box-shadow: 0 6px 28px rgba(34,197,94,0.4); transform: translateY(-1px); }
        .ip-action-reject { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #fca5a5; }
        .ip-action-reject:hover:not(:disabled) { background: rgba(239,68,68,0.18); }

        .ip-status-banner {
          margin: 0; padding: 18px 24px;
          font-size: 14px; font-weight: 500;
          border-top: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
        }
        .ip-status-verified { background: rgba(34,197,94,0.08); color: #4ade80; }
        .ip-status-rejected { background: rgba(239,68,68,0.08); color: #fca5a5; }

        /* Locked state — replaces action buttons for finalized registrations */
        .ip-locked-zone {
          padding: 16px 24px;
          border-top: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
        }
        .ip-locked-banner {
          display: flex; align-items: center; gap: 14px;
          padding: 16px 20px; border-radius: 12px; border: 1px solid;
        }
        .ip-locked-verified {
          background: rgba(34,197,94,0.08); border-color: rgba(34,197,94,0.25); color: #4ade80;
        }
        .ip-locked-rejected {
          background: rgba(239,68,68,0.08); border-color: rgba(239,68,68,0.25); color: #fca5a5;
        }
        .ip-locked-icon { font-size: 22px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
        .ip-locked-text { flex: 1; }
        .ip-locked-text strong { display: block; font-size: 14px; font-weight: 700; margin-bottom: 2px; }
        .ip-locked-text span { font-size: 12px; opacity: 0.7; }
        .ip-locked-badge {
          font-size: 11px; font-weight: 700; letter-spacing: 0.06em;
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.5); padding: 4px 10px; border-radius: 8px;
          flex-shrink: 0;
        }
      `}</style>
    </>
  );
}
