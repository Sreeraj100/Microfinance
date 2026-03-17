import React from 'react';
import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div className="auth-page">
      {/* ── Left decorative panel (hidden on mobile) ─────────────── */}
      <div className="auth-deco" aria-hidden="true">
        <div className="auth-deco__orb auth-deco__orb--1" />
        <div className="auth-deco__orb auth-deco__orb--2" />
        <div className="auth-deco__orb auth-deco__orb--3" />

        <div className="auth-deco__content">
          <div className="auth-deco__logo">
            <img src="/Icon.png" alt="" className="auth-deco__logo-img" aria-hidden="true" />
            MicroFinance
          </div>
          <p className="auth-deco__tagline">
            Empowering communities through transparent savings, loans, and financial inclusion.
          </p>

          <div className="auth-deco__features">
            <div className="auth-deco__feature">
              <span className="auth-deco__feature-icon">💳</span>
              <span className="auth-deco__feature-text">Track loans, repayments & interest in real-time</span>
            </div>
            <div className="auth-deco__feature">
              <span className="auth-deco__feature-icon">🏦</span>
              <span className="auth-deco__feature-text">Weekly savings ledger with 1% monthly interest</span>
            </div>
            <div className="auth-deco__feature">
              <span className="auth-deco__feature-icon">📋</span>
              <span className="auth-deco__feature-text">Attendance tracking with automated fine system</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ─────────────────────────────────────── */}
      <div className="auth-panel">
        <div className="auth-card">
          <Outlet />
        </div>

        <p style={{
          marginTop: '1.5rem',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          textAlign: 'center',
        }}>
          © {new Date().getFullYear()} MicroFinance Management System
        </p>
      </div>
    </div>
  );
};

export default PublicLayout;
