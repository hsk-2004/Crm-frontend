import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';



const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@300;400&display=swap');


:root {
  --nav-h: 64px;
  --gold:          #b8965a;
  --gold-glow:     rgba(184,150,90,0.2);
  --gold-soft:     rgba(184,150,90,0.08);
  --bg:            #09090e;
  --surface:       rgba(255,255,255,0.028);
  --surface-hover: rgba(255,255,255,0.046);
  --border:        rgba(255,255,255,0.07);
  --border-gold:   rgba(184,150,90,0.22);
  --text-0:        #f0ece4;
  --text-1:        rgba(240,236,228,0.82);
  --text-2:        rgba(240,236,228,0.60);
  --text-3:        rgba(240,236,228,0.42);
  --radius:        3px;
  --t:             200ms cubic-bezier(0.4,0,0.2,1);
}

[data-theme="light"] {
  --bg:            #f5f3ef;
  --surface:       rgba(0,0,0,0.04);
  --surface-hover: rgba(0,0,0,0.07);
  --border:        rgba(0,0,0,0.10);
  --border-gold:   rgba(184,150,90,0.30);
  --text-0:        #0a0a0f;
  --text-1:        rgba(10,10,15,0.85);
  --text-2:        rgba(10,10,15,0.60);
  --text-3:        rgba(10,10,15,0.40);
}


.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--nav-h);
  background: var(--bg);
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  border-bottom: 1px solid var(--border);
  font-family: 'DM Sans', sans-serif;
  transition: background var(--t), box-shadow var(--t);
}

[data-theme="light"] .navbar {
  background: rgba(245,243,239,0.92);
}


.navbar::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(184,150,90,0.55), transparent);
  opacity: 0.45;
  pointer-events: none;
}


.navbar::after {
  content: '';
  position: absolute;
  top: -1px; right: -1px;
  width: 16px; height: 16px;
  border-top: 1px solid rgba(184,150,90,0.28);
  border-right: 1px solid rgba(184,150,90,0.28);
  pointer-events: none;
  z-index: 1;
}

.navbar--scrolled {
  background: rgba(9,9,14,0.88);
  box-shadow: 0 8px 32px rgba(0,0,0,0.45);
}
.navbar--scrolled::before { opacity: 1; }
.navbar--scrolled::after  { border-color: rgba(184,150,90,0.55); }


.navbar-container {
  max-width: 1380px;
  margin: 0 auto;
  padding: 0 clamp(16px, 3.5vw, 44px);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}


.navbar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  transition: opacity var(--t);
}
.navbar-logo:hover { opacity: 0.75; }


.navbar-logo__icon {
  width: 32px;
  height: 32px;
  background: var(--gold-soft);
  border: 1px solid rgba(184,150,90,0.2);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gold);
  flex-shrink: 0;
  transition: box-shadow var(--t), border-color var(--t);
}
.navbar-logo:hover .navbar-logo__icon {
  border-color: var(--border-gold);
  box-shadow: 0 0 14px var(--gold-glow);
}


.navbar-logo__name {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 22px;
  font-weight: 300;
  color: var(--text-0);
  line-height: 1;
  letter-spacing: 0.04em;
  display: block;
}


.navbar-logo__eyebrow {
  font-family: 'DM Mono', monospace;
  font-size: 9.5px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--gold);
  display: block;
  margin-top: 3px;
}


.navbar-logo__rule {
  width: 24px;
  height: 1px;
  background: linear-gradient(90deg, var(--gold), transparent);
  margin-top: 5px;
}


.navbar-menu {
  display: flex;
  align-items: center;
  gap: 10px;
}


.navbar-sep {
  width: 1px;
  height: 22px;
  background: var(--border);
  flex-shrink: 0;
}


.navbar-user {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 4px 12px 4px 4px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 40px;
  transition: border-color var(--t), background var(--t);
  cursor: default;
}
.navbar-user:hover {
  background: var(--surface-hover);
  border-color: var(--border-gold);
}


.navbar-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(184,150,90,0.14);
  border: 1px solid rgba(184,150,90,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Cormorant Garamond', serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--gold);
  flex-shrink: 0;
}


.navbar-user__name {
  font-size: 14px;
  font-weight: 400;
  color: var(--text-1);
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: 0.01em;
}


.navbar-logout {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  border-radius: var(--radius);
  font-family: 'DM Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  cursor: pointer;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text-2);
  transition: background var(--t), border-color var(--t), color var(--t);
  white-space: nowrap;
}
.navbar-logout:hover:not(:disabled) {
  background: var(--surface-hover);
  border-color: rgba(255,255,255,0.14);
  color: var(--text-1);
}
.navbar-logout:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.navbar-logout__spinner {
  display: block;
  width: 12px;
  height: 12px;
  border: 1.5px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }


.navbar-login {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  border-radius: var(--radius);
  font-family: 'DM Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  cursor: pointer;
  background: linear-gradient(135deg, var(--gold), #d4af74);
  border: none;
  color: #09090e;
  font-weight: 600;
  text-decoration: none;
  transition: opacity var(--t), box-shadow var(--t), transform var(--t);
}
.navbar-login:hover {
  opacity: 0.88;
  box-shadow: 0 0 18px var(--gold-glow);
  transform: translateY(-1px);
}
.navbar-login:active { transform: translateY(0); }


@media (max-width: 520px) {
  .navbar-logo__eyebrow,
  .navbar-logo__rule { display: none; }
  .navbar-user__name { display: none; }
  .navbar-sep        { display: none; }
  .navbar-logout__label { display: none; }
  .navbar-logout { padding: 9px; } 
  .navbar-container  { padding: 0 16px; }
}
`;



function GridIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
      <rect x="1" y="1" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.9" />
      <rect x="10" y="1" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.4" />
      <rect x="1" y="10" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.4" />
      <rect x="10" y="10" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}



export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    navigate('/login');
  };

  const initials = user
    ? (user.first_name?.[0] || user.email?.[0] || '?').toUpperCase()
    : null;

  return (
    <>
      <style>{STYLES}</style>

      <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
        <div className="navbar-container">

          {}
          <Link to="/" className="navbar-logo">
            <div className="navbar-logo__icon">
              <GridIcon />
            </div>
            <div>
              <span className="navbar-logo__name">CRM</span>
              <span className="navbar-logo__eyebrow">Dashboard</span>
              <div className="navbar-logo__rule" />
            </div>
          </Link>

          {}
          <div className="navbar-menu">
            {user ? (
              <>
                <div className="navbar-user">
                  <div className="navbar-avatar">{initials}</div>
                  <span className="navbar-user__name">
                    {user.first_name || user.email}
                  </span>
                </div>

                <div className="navbar-sep" />

                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="navbar-logout"
                >
                  {loggingOut
                    ? <span className="navbar-logout__spinner" />
                    : <><SignOutIcon /> <span className="navbar-logout__label">Sign out</span></>
                  }
                </button>
              </>
            ) : (
              <Link to="/login" className="navbar-login">
                <span>Sign in</span>
                <ArrowIcon />
              </Link>
            )}
          </div>

        </div>
      </nav>
    </>
  );
}