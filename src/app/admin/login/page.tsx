'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '@/app/actions/admin';

export default function AdminLoginPage() {
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [error, setError]           = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    startTransition(async () => {
      const result = await loginAdmin(email, password);
      if (result.success) {
        router.push('/admin/dashboard');
      } else {
        setError(result.error || 'Login failed.');
      }
    });
  };

  return (
    <div className="admin-login-root">
      {/* Animated background particles */}
      <div className="admin-bg-orb admin-bg-orb-1" />
      <div className="admin-bg-orb admin-bg-orb-2" />
      <div className="admin-bg-orb admin-bg-orb-3" />

      <div className="admin-login-card">
        {/* Header */}
        <div className="admin-login-header">
          <div className="admin-login-logo">
            <span className="admin-login-logo-text">S</span>
          </div>
          <h1 className="admin-login-title">SOPHEP Command Centre</h1>
          <p className="admin-login-subtitle">Organizing Committee — Secure Access</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-login-field">
            <label htmlFor="email" className="admin-login-label">
              Admin Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@sophep.org"
              className="admin-login-input"
              autoComplete="email"
              required
              disabled={isPending}
            />
          </div>

          <div className="admin-login-field">
            <label htmlFor="password" className="admin-login-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password..."
              className="admin-login-input"
              autoComplete="current-password"
              required
              disabled={isPending}
            />
          </div>

          {error && (
            <div className="admin-login-error" role="alert">
              <span className="admin-login-error-icon">⚠</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-login-btn"
            disabled={isPending || !email || !password}
          >
            {isPending ? (
              <span className="admin-login-btn-loading">
                <span className="admin-btn-spinner" />
                Authenticating...
              </span>
            ) : (
              'Access Dashboard →'
            )}
          </button>
        </form>

        <p className="admin-login-footer-note">
          Restricted to SOPHEP organizing committee only.
        </p>
      </div>

      <style jsx>{`
        .admin-login-root {
          min-height: 100vh;
          background: #05010f;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }
        .admin-bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.15;
          animation: orbFloat 8s ease-in-out infinite;
        }
        .admin-bg-orb-1 {
          width: 500px; height: 500px;
          background: #7c3aed;
          top: -150px; left: -150px;
          animation-delay: 0s;
        }
        .admin-bg-orb-2 {
          width: 400px; height: 400px;
          background: #4f46e5;
          bottom: -100px; right: -100px;
          animation-delay: 3s;
        }
        .admin-bg-orb-3 {
          width: 300px; height: 300px;
          background: #9f6fe0;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 5s;
        }
        @keyframes orbFloat {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.05) translateY(-20px); }
        }
        .admin-login-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
          margin: 24px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 48px 40px;
          backdrop-filter: blur(24px);
          box-shadow: 0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08);
        }
        .admin-login-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .admin-login-logo {
          width: 64px; height: 64px;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          box-shadow: 0 8px 32px rgba(124, 58, 237, 0.4);
        }
        .admin-login-logo-text {
          font-size: 28px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -1px;
        }
        .admin-login-title {
          font-size: 22px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 8px;
          letter-spacing: -0.3px;
        }
        .admin-login-subtitle {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          margin: 0;
          letter-spacing: 0.05em;
        }
        .admin-login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .admin-login-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .admin-login-label {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }
        .admin-login-input {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 15px;
          color: #fff;
          outline: none;
          transition: all 0.2s;
          width: 100%;
          box-sizing: border-box;
        }
        .admin-login-input::placeholder {
          color: rgba(255,255,255,0.25);
        }
        .admin-login-input:focus {
          border-color: rgba(124, 58, 237, 0.6);
          background: rgba(124, 58, 237, 0.08);
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
        }
        .admin-login-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .admin-login-error {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 13px;
          color: #fca5a5;
        }
        .admin-login-error-icon {
          font-size: 15px;
          flex-shrink: 0;
        }
        .admin-login-btn {
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 15px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 24px rgba(124, 58, 237, 0.35);
        }
        .admin-login-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 32px rgba(124, 58, 237, 0.5);
        }
        .admin-login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .admin-login-btn-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .admin-btn-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .admin-login-footer-note {
          text-align: center;
          margin-top: 24px;
          font-size: 11px;
          color: rgba(255,255,255,0.2);
        }
      `}</style>
    </div>
  );
}
