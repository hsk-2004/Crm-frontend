import React, { useState, useEffect } from 'react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --bg: #0a0a0f;
    --bg-light: #f8f6f3;
    --surface: rgba(255, 255, 255, 0.033);
    --surface-hover: rgba(255, 255, 255, 0.05);
    --border: rgba(255, 255, 255, 0.07);
    --border-hover: rgba(184, 150, 90, 0.4);
    --accent: #b8965a;
    --accent-glow: rgba(184, 150, 90, 0.15);
    --accent-soft: rgba(184, 150, 90, 0.08);
    --text-primary: #f0ece4;
    --text-muted: rgba(240, 236, 228, 0.60);
    --text-secondary: rgba(240, 236, 228, 0.82);
    --transition: 180ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  [data-theme="light"] {
    --bg: #f8f6f3;
    --bg-light: #0a0a0f;
    --surface: rgba(0, 0, 0, 0.04);
    --surface-hover: rgba(0, 0, 0, 0.08);
    --border: rgba(0, 0, 0, 0.12);
    --border-hover: rgba(184, 150, 90, 0.5);
    --text-primary: #0a0a0f;
    --text-muted: rgba(10, 10, 15, 0.4);
    --text-secondary: rgba(10, 10, 15, 0.65);
  }

  .settings-root {
    min-height: 100vh;
    background: var(--bg);
    padding: 40px 20px;
    font-family: 'DM Sans', sans-serif;
    transition: background-color var(--transition);
    position: relative;
  }

  .settings-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 70% 20%, rgba(184, 140, 90, 0.04) 0%, transparent 60%),
      radial-gradient(ellipse 40% 60% at 20% 80%, rgba(100, 80, 160, 0.02) 0%, transparent 50%);
    pointer-events: none;
    opacity: 0.5;
  }

  .settings-container {
    max-width: 1000px;
    margin: 0 auto;
    position: relative;
  }

  .settings-header {
    margin-bottom: 40px;
    animation: slideIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .settings-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 300;
    color: var(--text-primary);
    margin: 0 0 8px;
    letter-spacing: -0.01em;
    line-height: 1.1;
  }

  .settings-title em {
    font-style: italic;
    color: var(--accent);
  }

  .settings-subtitle {
    font-size: 14px;
    color: var(--text-secondary);
    margin: 0;
    font-weight: 300;
    letter-spacing: 0.01em;
  }

  .settings-tabs {
    display: flex;
    gap: 12px;
    margin-bottom: 32px;
    border-bottom: 1px solid var(--border);
    padding-bottom: 12px;
    animation: tabsIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
    animation-delay: 0.1s;
  }

  @keyframes tabsIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .tab-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    color: var(--text-secondary);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all var(--transition);
    letter-spacing: 0.01em;
    position: relative;
    margin-bottom: -14px;
  }

  .tab-button:hover:not(.active) {
    color: var(--text-primary);
  }

  .tab-button.active {
    color: var(--accent);
    border-bottom-color: var(--accent);
    box-shadow: 0 2px 0 -2px var(--accent-glow);
  }

  .tab-button svg {
    stroke: currentColor;
  }

  .settings-content {
    animation: contentIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
    animation-delay: 0.2s;
  }

  @keyframes contentIn {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .settings-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 2px;
    padding: 36px;
    backdrop-filter: blur(20px);
    box-shadow: 0 32px 80px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(184, 150, 90, 0.06) inset;
    transition: border-color var(--transition);
    position: relative;
  }

  .card-accent {
    position: absolute;
    pointer-events: none;
  }

  .card-accent--top {
    top: -1px;
    right: -1px;
    width: 24px;
    height: 24px;
    border-top: 1px solid rgba(184, 150, 90, 0.3);
    border-right: 1px solid rgba(184, 150, 90, 0.3);
  }

  .card-accent--bottom {
    bottom: -1px;
    left: -1px;
    width: 24px;
    height: 24px;
    border-bottom: 1px solid rgba(184, 150, 90, 0.15);
    border-left: 1px solid rgba(184, 150, 90, 0.15);
  }

  .profile-header-block {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 28px;
  }

  .avatar-large {
    width: 64px;
    height: 64px;
    border-radius: 2px;
    background: linear-gradient(135deg, #b8965a 0%, #d4af74 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 24px;
    font-weight: 600;
    color: #0a0a0f;
    box-shadow: 0 0 16px rgba(184, 150, 90, 0.25);
    flex-shrink: 0;
  }

  .profile-info {
    flex: 1;
  }

  .profile-name {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 22px;
    font-weight: 400;
    color: var(--text-primary);
    margin: 0 0 4px;
  }

  .profile-email {
    font-size: 14px;
    color: var(--text-secondary);
    margin: 0 0 8px;
  }

  .profile-badge {
    display: inline-block;
    padding: 4px 10px;
    background: rgba(184, 150, 90, 0.12);
    border: 1px solid rgba(184, 150, 90, 0.3);
    border-radius: 2px;
    font-size: 10px;
    font-weight: 500;
    color: var(--accent);
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .settings-field-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 20px;
  }

  .settings-field {
    margin-bottom: 20px;
    position: relative;
  }

  .field-label {
    display: block;
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(240, 236, 228, 0.65);
    font-weight: 400;
    margin-bottom: 8px;
  }

  [data-theme="light"] .field-label {
    color: rgba(10, 10, 15, 0.5);
  }

  .field-input,
  .field-select {
    width: 100%;
    padding: 11px 14px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 2px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 300;
    color: var(--text-primary);
    box-sizing: border-box;
    transition: border-color var(--transition), background var(--transition), box-shadow var(--transition);
    outline: none;
    letter-spacing: 0.01em;
  }

  [data-theme="light"] .field-input,
  [data-theme="light"] .field-select {
    background: rgba(0, 0, 0, 0.04);
    border-color: rgba(0, 0, 0, 0.1);
  }

  .field-input::placeholder {
    color: rgba(240, 236, 228, 0.18);
    font-style: italic;
  }

  [data-theme="light"] .field-input::placeholder {
    color: rgba(10, 10, 15, 0.3);
  }

  .field-input:focus,
  .field-select:focus {
    border-color: rgba(184, 150, 90, 0.55);
    background: rgba(255, 255, 255, 0.06);
    box-shadow: 0 0 0 3px rgba(184, 150, 90, 0.07);
  }

  [data-theme="light"] .field-input:focus,
  [data-theme="light"] .field-select:focus {
    background: rgba(0, 0, 0, 0.06);
  }

  .field-select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23b8965a' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 36px;
  }

  .field-hint {
    font-size: 12.5px;
    color: var(--text-muted);
    margin: 6px 0 0;
    font-style: italic;
    font-weight: 300;
  }

  .settings-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(184, 150, 90, 0.2), transparent);
    margin: 24px 0;
  }

  .save-notification {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    background: rgba(184, 150, 90, 0.12);
    border: 1px solid rgba(184, 150, 90, 0.3);
    border-radius: 2px;
    color: var(--accent);
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 20px;
    animation: slideDown 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .save-notification svg {
    flex-shrink: 0;
    stroke: var(--accent);
  }

  .preference-group {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding: 16px 0;
  }

  .preference-header {
    flex: 1;
  }

  .preference-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
    margin: 0 0 4px;
    letter-spacing: 0.01em;
  }

  .preference-description {
    font-size: 13px;
    color: var(--text-secondary);
    margin: 0;
    font-weight: 300;
  }

  .theme-toggle {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .theme-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 16px;
    border: 1px solid var(--border);
    background: var(--surface);
    border-radius: 2px;
    color: var(--text-secondary);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition);
    white-space: nowrap;
    font-family: 'DM Sans', sans-serif;
  }

  .theme-btn:hover:not(.active) {
    border-color: var(--border-hover);
    background: var(--surface-hover);
    color: var(--text-primary);
  }

  .theme-btn.active {
    background: rgba(184, 150, 90, 0.12);
    border-color: rgba(184, 150, 90, 0.4);
    color: var(--accent);
    box-shadow: 0 0 12px rgba(184, 150, 90, 0.15);
  }

  .toggle-switch {
    display: flex;
    align-items: center;
    cursor: pointer;
    flex-shrink: 0;
  }

  .toggle-switch input {
    display: none;
  }

  .toggle-slider {
    display: inline-block;
    width: 48px;
    height: 24px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    position: relative;
    transition: background var(--transition);
    border: 1px solid rgba(255, 255, 255, 0.09);
  }

  [data-theme="light"] .toggle-slider {
    background: rgba(0, 0, 0, 0.08);
    border-color: rgba(0, 0, 0, 0.12);
  }

  .toggle-slider::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 10px;
    background: var(--text-primary);
    top: 2px;
    left: 2px;
    transition: left var(--transition);
  }

  .toggle-switch input:checked + .toggle-slider {
    background: rgba(184, 150, 90, 0.3);
    border-color: rgba(184, 150, 90, 0.5);
  }

  .toggle-switch input:checked + .toggle-slider::after {
    left: 26px;
  }

  .btn-primary {
    width: 100%;
    padding: 13px;
    background: linear-gradient(135deg, #b8965a 0%, #d4af74 50%, #b8965a 100%);
    background-size: 200% 100%;
    background-position: 100% 0;
    color: #0a0a0f;
    border: none;
    border-radius: 2px;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background-position var(--transition), opacity var(--transition), transform 0.15s ease;
    margin-top: 8px;
    position: relative;
    overflow: hidden;
  }

  .btn-primary:hover {
    background-position: 0% 0;
    transform: translateY(-1px);
  }

  .btn-primary:active {
    transform: translateY(0);
  }

  .about-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .about-block {
    margin-bottom: 8px;
  }

  .about-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 20px;
    font-weight: 400;
    color: var(--text-primary);
    margin: 0 0 12px;
    letter-spacing: -0.01em;
  }

  .about-text {
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.6;
    margin: 0;
    font-weight: 300;
    letter-spacing: 0.01em;
  }

  .about-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 16px;
    margin: 8px 0;
  }

  .about-item {
    background: rgba(184, 150, 90, 0.04);
    border: 1px solid rgba(184, 150, 90, 0.15);
    border-radius: 2px;
    padding: 16px;
    text-align: center;
    transition: all var(--transition);
  }

  .about-item:hover {
    border-color: rgba(184, 150, 90, 0.3);
    background: rgba(184, 150, 90, 0.08);
  }

  .about-icon {
    display: flex;
    justify-content: center;
    margin-bottom: 12px;
    color: var(--accent);
  }

  .about-item-title {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-primary);
    margin: 0 0 6px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .about-item-text {
    font-size: 16px;
    font-weight: 600;
    color: var(--accent);
    margin: 0;
    font-family: 'Cormorant Garamond', Georgia, serif;
  }

  .about-features {
    margin: 8px 0;
  }

  .features-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 16px;
    font-weight: 400;
    color: var(--text-primary);
    margin: 0 0 16px;
    letter-spacing: -0.01em;
  }

  .features-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
  }

  .feature-item {
    padding: 10px 12px;
    background: rgba(184, 150, 90, 0.04);
    border-left: 2px solid var(--accent);
    border-radius: 2px;
    font-size: 13px;
    color: var(--text-secondary);
    font-weight: 300;
    line-height: 1.5;
  }

  .feature-item::before {
    content: '✓ ';
    color: var(--accent);
    font-weight: 600;
  }

  .about-footer {
    text-align: center;
    padding-top: 12px;
  }

  .about-footer-text {
    font-size: 13px;
    color: var(--text-secondary);
    margin: 0 0 12px;
    line-height: 1.5;
    font-weight: 300;
  }

  .footer-accent {
    color: var(--accent);
    font-weight: 500;
    letter-spacing: 0.01em;
  }

  .about-links {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .about-link {
    font-size: 12px;
    color: var(--accent);
    text-decoration: none;
    font-weight: 400;
    transition: opacity var(--transition);
    letter-spacing: 0.01em;
  }

  .about-link:hover {
    opacity: 0.75;
  }

  .link-separator {
    color: rgba(184, 150, 90, 0.3);
  }

  @media (max-width: 768px) {
    .settings-root {
      padding: 24px 16px;
    }

    .settings-card {
      padding: 24px;
    }

    .settings-tabs {
      gap: 8px;
      overflow-x: auto;
    }

    .tab-button {
      padding: 8px 12px;
      font-size: 12px;
    }

    .tab-button svg {
      width: 16px;
      height: 16px;
    }

    .settings-title {
      font-size: 28px;
    }

    .settings-field-group {
      grid-template-columns: 1fr;
    }

    .profile-header-block {
      flex-direction: column;
      text-align: center;
    }

    .about-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .preference-group {
      flex-direction: column;
      align-items: flex-start;
    }

    .theme-toggle {
      width: 100%;
    }

    .theme-btn {
      flex: 1;
    }

    .settings-field-group {
      gap: 12px;
    }

    .features-list {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 480px) {
    .settings-root {
      padding: 16px 12px;
    }

    .settings-header {
      margin-bottom: 24px;
    }

    .settings-title {
      font-size: 24px;
    }

    .settings-card {
      padding: 16px;
    }

    .avatar-large {
      width: 48px;
      height: 48px;
      font-size: 18px;
    }

    .profile-name {
      font-size: 16px;
    }

    .tab-button {
      font-size: 11px;
      padding: 6px 10px;
    }

    .about-grid {
      grid-template-columns: 1fr;
    }
  }
`;

export function Settings() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'dark';
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailDigest, setEmailDigest] = useState('weekly');
  const [formData, setFormData] = useState({
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    company: 'Acme Corporation',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem('app-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="settings-root">
        <div className="settings-container">
          {/* Header */}
          <div className="settings-header">
            <div>
              <h1 className="settings-title">
                Settings &amp; <em>Account</em>
              </h1>
              <p className="settings-subtitle">Manage your profile, preferences, and system settings</p>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="settings-tabs">
            <button
              className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Profile
            </button>
            <button
              className={`tab-button ${activeTab === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              Preferences
            </button>
            <button
              className={`tab-button ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              About CRM
            </button>
          </div>

          {/* Content */}
          <div className="settings-content">

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="settings-card profile-card">
                <div className="card-accent card-accent--top" />
                <div className="card-accent card-accent--bottom" />

                <div className="profile-header-block">
                  <div className="avatar-large">{formData.first_name[0]}{formData.last_name[0]}</div>
                  <div className="profile-info">
                    <h2 className="profile-name">{formData.first_name} {formData.last_name}</h2>
                    <p className="profile-email">{formData.email}</p>
                    <span className="profile-badge">Premium Member</span>
                  </div>
                </div>

                <div className="settings-divider" />

                {saved && (
                  <div className="save-notification">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Changes saved successfully
                  </div>
                )}

                <div className="settings-field-group">
                  <div className="settings-field">
                    <label className="field-label">First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      className="field-input"
                      value={formData.first_name}
                      onChange={handleFormChange}
                      placeholder="John"
                    />
                  </div>
                  <div className="settings-field">
                    <label className="field-label">Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      className="field-input"
                      value={formData.last_name}
                      onChange={handleFormChange}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="settings-field">
                  <label className="field-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="field-input"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="john@example.com"
                  />
                </div>

                <div className="settings-field">
                  <label className="field-label">Company</label>
                  <input
                    type="text"
                    name="company"
                    className="field-input"
                    value={formData.company}
                    onChange={handleFormChange}
                    placeholder="Your company name"
                  />
                </div>

                <div className="settings-field">
                  <label className="field-label">Password</label>
                  <input
                    type="password"
                    className="field-input"
                    placeholder="••••••••"
                  />
                  <p className="field-hint">Leave blank to keep current password</p>
                </div>

                <button className="btn-primary" onClick={handleSaveProfile}>Save Changes</button>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="settings-card preferences-card">
                <div className="card-accent card-accent--top" />
                <div className="card-accent card-accent--bottom" />

                <div className="preference-group">
                  <div className="preference-header">
                    <h3 className="preference-title">Appearance</h3>
                    <p className="preference-description">Choose your preferred theme</p>
                  </div>
                  <div className="theme-toggle">
                    <button
                      className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                      onClick={() => toggleTheme('dark')}
                      aria-label="Dark theme"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                      </svg>
                      <span>Dark</span>
                    </button>
                    <button
                      className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                      onClick={() => toggleTheme('light')}
                      aria-label="Light theme"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="5" />
                        <line x1="12" y1="1" x2="12" y2="3" />
                        <line x1="12" y1="21" x2="12" y2="23" />
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                        <line x1="1" y1="12" x2="3" y2="12" />
                        <line x1="21" y1="12" x2="23" y2="12" />
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                      </svg>
                      <span>Light</span>
                    </button>
                  </div>
                </div>

                <div className="settings-divider" />

                <div className="preference-group">
                  <div className="preference-header">
                    <h3 className="preference-title">Notifications</h3>
                    <p className="preference-description">Receive updates about your account and activity</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notificationsEnabled}
                      onChange={(e) => setNotificationsEnabled(e.target.checked)}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>

                <div className="settings-divider" />

                <div className="preference-group">
                  <div className="preference-header">
                    <h3 className="preference-title">Email Digest</h3>
                    <p className="preference-description">How often you receive email updates</p>
                  </div>
                  <select
                    className="field-select"
                    value={emailDigest}
                    onChange={(e) => setEmailDigest(e.target.value)}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="never">Never</option>
                  </select>
                </div>

                <div className="settings-divider" />

                <div className="preference-group">
                  <div className="preference-header">
                    <h3 className="preference-title">Marketing Emails</h3>
                    <p className="preference-description">Receive product updates and special offers</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked={false} />
                    <span className="toggle-slider" />
                  </label>
                </div>

                <button className="btn-primary" style={{ marginTop: '24px' }}>Save Preferences</button>
              </div>
            )}

            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="settings-card about-card">
                <div className="card-accent card-accent--top" />
                <div className="card-accent card-accent--bottom" />

                <div className="about-content">
                  <div className="about-block">
                    <h2 className="about-title">Professional CRM Solution</h2>
                    <p className="about-text">
                      Our CRM platform is designed to streamline your sales operations and enhance customer relationships.
                      Built with modern technology and user-centric design principles, we provide powerful tools to help you succeed
                      in today's competitive market.
                    </p>
                  </div>

                  <div className="settings-divider" />

                  <div className="about-grid">
                    <div className="about-item">
                      <div className="about-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M12 2L15.09 8.26H22L17.45 12.5L20.09 18.74H12L7.45 12.5L10.09 8.26H2L7.45 2H12Z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <h4 className="about-item-title">Version</h4>
                      <p className="about-item-text">2.1.0</p>
                    </div>

                    <div className="about-item">
                      <div className="about-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <h4 className="about-item-title">Users</h4>
                      <p className="about-item-text">50K+</p>
                    </div>

                    <div className="about-item">
                      <div className="about-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" strokeLinecap="round" strokeLinejoin="round" />
                          <polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <h4 className="about-item-title">Uptime</h4>
                      <p className="about-item-text">99.9%</p>
                    </div>

                    <div className="about-item">
                      <div className="about-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <h4 className="about-item-title">Status</h4>
                      <p className="about-item-text">Operational</p>
                    </div>
                  </div>

                  <div className="settings-divider" />

                  <div className="about-features">
                    <h3 className="features-title">Key Features</h3>
                    <ul className="features-list">
                      <li className="feature-item">Advanced lead management and tracking</li>
                      <li className="feature-item">Real-time sales pipeline visibility</li>
                      <li className="feature-item">Automated workflow and task management</li>
                      <li className="feature-item">Comprehensive reporting and analytics</li>
                      <li className="feature-item">Seamless team collaboration tools</li>
                      <li className="feature-item">Mobile-friendly responsive design</li>
                    </ul>
                  </div>

                  <div className="settings-divider" />

                  <div className="about-footer">
                    <p className="about-footer-text">
                      <span className="footer-accent">Developed with care</span> to help you build meaningful customer relationships
                    </p>
                    <div className="about-links">
                      <a href="#" className="about-link">Documentation</a>
                      <span className="link-separator">•</span>
                      <a href="#" className="about-link">Support</a>
                      <span className="link-separator">•</span>
                      <a href="#" className="about-link">Privacy Policy</a>
                      <span className="link-separator">•</span>
                      <a href="#" className="about-link">Terms of Service</a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}