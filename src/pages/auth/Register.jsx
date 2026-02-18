import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .register-root {
    min-height: 100vh;
    background: #0a0a0f;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .register-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 70% 20%, rgba(180, 140, 90, 0.08) 0%, transparent 60%),
      radial-gradient(ellipse 40% 60% at 20% 80%, rgba(100, 80, 160, 0.06) 0%, transparent 50%);
    pointer-events: none;
  }

  .register-panel {
    width: 100%;
    max-width: 460px;
    position: relative;
    animation: panelIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes panelIn {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .register-header {
    margin-bottom: 40px;
    text-align: left;
  }

  .register-eyebrow {
    font-size: 10px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #b8965a;
    font-weight: 400;
    margin-bottom: 12px;
    display: block;
  }

  .register-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(36px, 6vw, 52px);
    font-weight: 300;
    color: #f0ece4;
    line-height: 1.1;
    margin: 0 0 6px;
    letter-spacing: -0.01em;
  }

  .register-title em {
    font-style: italic;
    color: #b8965a;
  }

  .register-subtitle {
    font-size: 13px;
    color: rgba(240, 236, 228, 0.38);
    font-weight: 300;
    margin: 14px 0 0;
    letter-spacing: 0.02em;
    line-height: 1.6;
  }

  .register-divider {
    width: 32px;
    height: 1px;
    background: linear-gradient(90deg, #b8965a, transparent);
    margin: 20px 0;
  }

  .register-card {
    background: rgba(255, 255, 255, 0.033);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 2px;
    padding: 36px 36px 32px;
    backdrop-filter: blur(20px);
    box-shadow: 0 32px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(184, 150, 90, 0.06) inset;
  }

  .field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .field {
    margin-bottom: 20px;
    position: relative;
    animation: fieldIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .field:nth-child(1) { animation-delay: 0.08s; }
  .field:nth-child(2) { animation-delay: 0.13s; }
  .field:nth-child(3) { animation-delay: 0.18s; }
  .field:nth-child(4) { animation-delay: 0.23s; }
  .field:nth-child(5) { animation-delay: 0.28s; }

  @keyframes fieldIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .field label {
    display: block;
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(240, 236, 228, 0.45);
    font-weight: 400;
    margin-bottom: 8px;
  }

  .field input {
    width: 100%;
    padding: 11px 14px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 2px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 300;
    color: #f0ece4;
    box-sizing: border-box;
    transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
    outline: none;
    letter-spacing: 0.01em;
  }

  .field input::placeholder {
    color: rgba(240, 236, 228, 0.18);
    font-style: italic;
  }

  .field input:focus {
    border-color: rgba(184, 150, 90, 0.55);
    background: rgba(255,255,255,0.06);
    box-shadow: 0 0 0 3px rgba(184, 150, 90, 0.07);
  }

  .field input:focus + .field-line {
    transform: scaleX(1);
  }

  .alert-wrap {
    margin-bottom: 20px;
    padding: 12px 14px;
    background: rgba(200, 60, 60, 0.12);
    border: 1px solid rgba(200, 60, 60, 0.3);
    border-radius: 2px;
    font-size: 13px;
    color: #e89090;
    font-weight: 300;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .alert-close {
    background: none;
    border: none;
    color: rgba(232, 144, 144, 0.6);
    cursor: pointer;
    font-size: 16px;
    line-height: 1;
    padding: 0;
    flex-shrink: 0;
  }
  .alert-close:hover { color: #e89090; }

  .submit-btn {
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
    transition: background-position 0.4s ease, opacity 0.2s ease, transform 0.15s ease;
    margin-top: 8px;
    position: relative;
    overflow: hidden;
  }

  .submit-btn:not(:disabled):hover {
    background-position: 0% 0;
    transform: translateY(-1px);
  }

  .submit-btn:not(:disabled):active {
    transform: translateY(0);
  }

  .submit-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .submit-btn .btn-spinner {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 1.5px solid rgba(10,10,15,0.3);
    border-top-color: #0a0a0f;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    margin-right: 8px;
    vertical-align: middle;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .register-footer {
    text-align: center;
    margin-top: 24px;
    font-size: 12.5px;
    color: rgba(240, 236, 228, 0.3);
    letter-spacing: 0.02em;
  }

  .register-footer a {
    color: #b8965a;
    text-decoration: none;
    font-weight: 400;
    transition: opacity 0.2s;
  }

  .register-footer a:hover {
    opacity: 0.75;
  }

  .corner-accent {
    position: absolute;
    top: -1px;
    right: -1px;
    width: 24px;
    height: 24px;
    border-top: 1px solid rgba(184,150,90,0.5);
    border-right: 1px solid rgba(184,150,90,0.5);
    pointer-events: none;
  }

  .corner-accent-bl {
    position: absolute;
    bottom: -1px;
    left: -1px;
    width: 24px;
    height: 24px;
    border-bottom: 1px solid rgba(184,150,90,0.3);
    border-left: 1px solid rgba(184,150,90,0.3);
    pointer-events: none;
  }
`;

// Helper: flatten DRF error response into a readable string
function parseDRFError(err) {
  const data = err.response?.data;
  if (!data) return 'Registration failed. Please try again.';
  if (typeof data === 'string') return data;
  if (data.detail) return data.detail;
  // Field-level errors: { email: ['...'], password: ['...'] }
  const messages = Object.entries(data)
    .map(([field, msgs]) => {
      const text = Array.isArray(msgs) ? msgs.join(' ') : msgs;
      return `${field.charAt(0).toUpperCase() + field.slice(1)}: ${text}`;
    })
    .join('  ·  ');
  return messages || 'Registration failed.';
}

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.password_confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password2: formData.password_confirm,
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(parseDRFError(err));
    } finally {
      setLoading(false);
    }
  };

  const displayError = error;

  return (
    <>
      <style>{styles}</style>
      <div className="register-root">
        <div className="register-panel">
          <div className="register-header">
            <span className="register-eyebrow">New member</span>
            <h1 className="register-title">
              Create your<br /><em>account</em>
            </h1>
            <div className="register-divider" />
            <p className="register-subtitle">
              Join us — it only takes a moment.
            </p>
          </div>

          <div className="register-card" style={{ position: 'relative' }}>
            <div className="corner-accent" />
            <div className="corner-accent-bl" />

            {displayError && (
              <div className="alert-wrap">
                <span>{displayError}</span>
                <button className="alert-close" onClick={() => setError(null)} aria-label="Dismiss">×</button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  required
                  autoComplete="username"
                />
              </div>

              <div className="field">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Choose a strong password"
                  required
                  autoComplete="new-password"
                />
              </div>

              <div className="field">
                <label htmlFor="password_confirm">Confirm Password</label>
                <input
                  id="password_confirm"
                  type="password"
                  name="password_confirm"
                  value={formData.password_confirm}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  required
                  autoComplete="new-password"
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading || success}>
                {loading && <span className="btn-spinner" />}
                {loading ? 'Creating Account…' : success ? '✓ Account Created!' : 'Create Account'}
              </button>
            </form>
          </div>

          <p className="register-footer">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
}