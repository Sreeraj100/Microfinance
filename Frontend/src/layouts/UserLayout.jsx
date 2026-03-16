import React, { useContext, useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/dashboard',    icon: '⬡', label: 'Dashboard'    },
  { to: '/my-loans',     icon: '💳', label: 'My Loans'     },
  { to: '/my-savings',   icon: '🏦', label: 'My Savings'   },
  { to: '/my-attendance',icon: '📋', label: 'Attendance'   },
];

const UserLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  const handleNavClick = () => { if (window.innerWidth <= 768) setSidebarOpen(false); };

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setSidebarOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (sidebarOpen && window.innerWidth <= 768) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const initials = user?.name ? user.name[0].toUpperCase() : 'U';

  return (
    <div className="layout-shell">

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`sidebar${sidebarOpen ? ' sidebar--open' : ''}`} aria-label="User navigation">

        <div className="sidebar-logo">
          <div className="sidebar-logo__icon" aria-hidden="true">✦</div>
          <div>
            <div className="sidebar-logo__text">MicroFinance</div>
            <div className="sidebar-logo__badge">Member Portal</div>
          </div>
        </div>

        <nav className="sidebar-section" style={{ flex: 1, paddingTop: '1.25rem' }}>
          <div className="sidebar-section__label">My Account</div>
          {NAV_ITEMS.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              onClick={handleNavClick}
            >
              <span className="nav-icon" aria-hidden="true">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user" onClick={handleLogout} title="Click to logout">
            <div className="sidebar-avatar" aria-hidden="true">{initials}</div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div className="sidebar-user__name">{user?.name || 'Member'}</div>
              <div className="sidebar-user__role">Member</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="rgba(255,255,255,.35)" strokeWidth="2" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="layout-main">
        <header className="topbar">
          <div className="topbar__left">
            <button
              className="hamburger"
              onClick={() => setSidebarOpen(o => !o)}
              aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={sidebarOpen}
            >
              {sidebarOpen ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="6"  x2="21" y2="6"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              )}
            </button>
          </div>

          <div className="topbar__right">
            <div className="topbar__user">
              <div className="topbar-avatar" aria-hidden="true">{initials}</div>
              <span className="topbar__user-name">{user?.name || 'Member'}</span>
            </div>
            <button
              className="btn btn-ghost"
              onClick={handleLogout}
              style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Logout
            </button>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default UserLayout;
