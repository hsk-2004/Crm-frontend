    import React, { useState } from 'react';
    import { useNavigate, Link } from 'react-router-dom';
    import { motion, AnimatePresence } from 'framer-motion';
    import { useAuth } from '../../hooks/useAuth';

    // ─── Animation Variants ───────────────────────────────────────────────────────

    const containerVariants = {
      hidden: {},
      visible: {
        transition: { staggerChildren: 0.09, delayChildren: 0.1 },
      },
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
      visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      },
    };

    // ─── Input Field ──────────────────────────────────────────────────────────────

    function InputField({ id, name, type = 'text', value, onChange, label, placeholder, required }) {
      const [focused, setFocused] = useState(false);

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label
            htmlFor={id}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: 400,
              color: focused ? '#b8965a' : 'rgba(240,236,228,0.38)',
              transition: 'color 0.2s',
              display: 'block',
            }}
          >
            {label}
          </label>

          <div style={{ position: 'relative' }}>
            <input
              id={id}
              name={name}
              type={type}
              value={value}
              onChange={onChange}
              required={required}
              placeholder={placeholder}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              style={{
                width: '100%',
                padding: '11px 14px',
                background: focused ? 'rgba(184,150,90,0.04)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${focused ? 'rgba(184,150,90,0.45)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '2px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '14px',
                fontWeight: 300,
                color: 'rgba(240,236,228,0.9)',
                outline: 'none',
                boxSizing: 'border-box',
                boxShadow: focused ? '0 0 0 3px rgba(184,150,90,0.07)' : 'none',
                caretColor: '#b8965a',
                transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
              }}
            />

            <motion.div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: '2px',
                background: 'linear-gradient(90deg, #b8965a, #d4af74)',
                borderRadius: '0 0 2px 2px',
              }}
              animate={{ width: focused ? '100%' : '0%' }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      );
    }

    // ─── Login Component ──────────────────────────────────────────────────────────

    export function Login() {
      const navigate = useNavigate();
      const { login, error: authError } = useAuth();
      const [formData, setFormData] = useState({ email: '', password: '' });
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
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Invalid credentials. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };


      return (
        <>
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@300;400&display=swap');

            @keyframes lp-drift {
              0%, 100% { transform: translate(0,0) scale(1); }
              33%       { transform: translate(30px,-20px) scale(1.05); }
              66%       { transform: translate(-20px,15px) scale(0.97); }
            }
            .lp-orb-1 { animation: lp-drift 24s ease-in-out infinite; }
            .lp-orb-2 { animation: lp-drift 33s ease-in-out infinite; animation-delay: -12s; }

            .lp-input::placeholder { color: rgba(240,236,228,0.16); font-style: italic; }

            .lp-forgot { color: rgba(240,236,228,0.22); text-decoration: none; transition: color 0.2s; }
            .lp-forgot:hover { color: #b8965a; }

            .lp-register-link { color: #b8965a; text-decoration: none; transition: opacity 0.2s; }
            .lp-register-link:hover { opacity: 0.7; }
          `}</style>

          <div style={{
            minHeight: '100vh',
            background: '#0a0a0f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            fontFamily: "'DM Sans', sans-serif",
            position: 'relative',
            overflow: 'hidden',
          }}>

            {/* Ambient orbs */}
            <div className="lp-orb-1" style={{
              position: 'absolute', top: '-160px', right: '-160px',
              width: '520px', height: '520px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(184,150,90,0.09) 0%, transparent 70%)',
              filter: 'blur(60px)', pointerEvents: 'none',
            }} />
            <div className="lp-orb-2" style={{
              position: 'absolute', bottom: '-160px', left: '-160px',
              width: '460px', height: '460px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(100,80,160,0.07) 0%, transparent 70%)',
              filter: 'blur(80px)', pointerEvents: 'none',
            }} />

            {/* Grid overlay */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.018,
              backgroundImage: `linear-gradient(rgba(184,150,90,1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(184,150,90,1) 1px, transparent 1px)`,
              backgroundSize: '64px 64px',
            }} />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '420px' }}
            >

              {/* Header */}
              <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ marginBottom: '32px' }}>
                <motion.span variants={itemVariants} style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '10px',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: '#b8965a',
                  fontWeight: 400,
                  display: 'block',
                  marginBottom: '12px',
                }}>
                  Member access
                </motion.span>

                <motion.h1 variants={itemVariants} style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 'clamp(36px, 6vw, 52px)',
                  fontWeight: 300,
                  color: '#f0ece4',
                  lineHeight: 1.1,
                  margin: '0 0 6px',
                  letterSpacing: '-0.01em',
                }}>
                  Welcome<br />
                  <em style={{ fontStyle: 'italic', color: '#b8965a' }}>back</em>
                </motion.h1>

                <motion.div variants={itemVariants} style={{
                  width: '32px', height: '1px',
                  background: 'linear-gradient(90deg, #b8965a, transparent)',
                  margin: '16px 0',
                }} />

                <motion.p variants={itemVariants} style={{
                  fontSize: '13px',
                  color: 'rgba(240,236,228,0.32)',
                  fontWeight: 300,
                  margin: 0,
                  letterSpacing: '0.02em',
                  lineHeight: 1.6,
                }}>
                  Sign in to access your workspace.
                </motion.p>
              </motion.div>

              {/* Card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: 'relative',
                  background: 'rgba(255,255,255,0.033)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '2px',
                  padding: '36px 36px 32px',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 32px 80px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(184,150,90,0.06)',
                }}
              >
                {/* Corner accents */}
                <div style={{
                  position: 'absolute', top: '-1px', right: '-1px',
                  width: '24px', height: '24px',
                  borderTop: '1px solid rgba(184,150,90,0.5)',
                  borderRight: '1px solid rgba(184,150,90,0.5)',
                  pointerEvents: 'none',
                }} />
                <div style={{
                  position: 'absolute', bottom: '-1px', left: '-1px',
                  width: '24px', height: '24px',
                  borderBottom: '1px solid rgba(184,150,90,0.3)',
                  borderLeft: '1px solid rgba(184,150,90,0.3)',
                  pointerEvents: 'none',
                }} />

                {/* Top shimmer line */}
                <motion.div
                  style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(184,150,90,0.6), transparent)',
                  }}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                />

                {/* Error banner */}
                <AnimatePresence>
                  {(error || authError) && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: -8, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -8, height: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 14px',
                        background: 'rgba(200,60,60,0.10)',
                        border: '1px solid rgba(200,60,60,0.28)',
                        borderRadius: '2px',
                        fontSize: '13px',
                        color: '#e89090',
                        fontWeight: 300,
                        overflow: 'hidden',
                      }}
                    >
                      <svg style={{ width: '14px', height: '14px', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                      <span style={{ flex: 1 }}>{error || authError}</span>
                      <button
                        onClick={() => setError(null)}
                        style={{ background: 'none', border: 'none', color: 'rgba(232,144,144,0.5)', cursor: 'pointer', fontSize: '16px', lineHeight: 1, padding: 0 }}
                      >×</button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form */}
                <motion.form
                  onSubmit={handleSubmit}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                >
                  <motion.div variants={itemVariants}>
                    <InputField id="email" name="email" type="email" value={formData.email}
                      onChange={handleChange} label="Email Address" placeholder="you@company.com" required />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <InputField id="password" name="password" type="password" value={formData.password}
                      onChange={handleChange} label="Password" placeholder="••••••••" required />
                  </motion.div>

                  {/* Forgot password */}
                  <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-8px' }}>
                    <Link to="/forgot-password" className="lp-forgot" style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '10px',
                      letterSpacing: '0.14em',
                    }}>
                      Forgot password?
                    </Link>
                  </motion.div>

                  {/* Submit */}
                  <motion.div variants={itemVariants} style={{ paddingTop: '4px' }}>
                    <motion.button
                      type="submit"
                      disabled={loading || success}
                      whileHover={{ scale: (loading || success) ? 1 : 1.015 }}
                      whileTap={{ scale: (loading || success) ? 1 : 0.985 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      style={{
                        position: 'relative',
                        width: '100%',
                        padding: '13px',
                        background: 'linear-gradient(135deg, #b8965a 0%, #d4af74 50%, #b8965a 100%)',
                        color: '#0a0a0f',
                        border: 'none',
                        borderRadius: '2px',
                        fontFamily: "'DM Mono', monospace",
                        fontSize: '11px',
                        fontWeight: 500,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        cursor: (loading || success) ? 'not-allowed' : 'pointer',
                        overflow: 'hidden',
                        boxShadow: (loading || success) ? 'none' : '0 8px 28px rgba(184,150,90,0.28)',
                        opacity: loading ? 0.6 : 1,
                        transition: 'box-shadow 0.3s, opacity 0.2s',
                      }}
                    >
                      {!loading && !success && (
                        <motion.div
                          style={{
                            position: 'absolute', inset: 0, pointerEvents: 'none',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
                            transform: 'skewX(-12deg)',
                          }}
                          initial={{ x: '-120%' }}
                          animate={{ x: '220%' }}
                          transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.9, ease: 'easeInOut' }}
                        />
                      )}

                      <AnimatePresence mode="wait">
                        {loading ? (
                          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <motion.span
                              style={{
                                display: 'block', width: '12px', height: '12px',
                                border: '1.5px solid rgba(10,10,15,0.3)',
                                borderTopColor: '#0a0a0f', borderRadius: '50%',
                              }}
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 0.75, ease: 'linear' }}
                            />
                            Authenticating
                          </motion.div>
                        ) : success ? (
                          <motion.div key="success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            Access Granted
                          </motion.div>
                        ) : (
                          <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            Sign In
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </motion.div>
                </motion.form>
              </motion.div>

              {/* Footer link */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                style={{
                  textAlign: 'center',
                  marginTop: '24px',
                  fontSize: '12.5px',
                  color: 'rgba(240,236,228,0.25)',
                  letterSpacing: '0.02em',
                }}
              >
                Don't have an account?{' '}
                <Link to="/register" className="lp-register-link" style={{ fontWeight: 400 }}>
                  Create one
                </Link>
              </motion.p>
            </motion.div>

            {/* Footer stamp */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              style={{
                position: 'absolute',
                bottom: '24px',
                fontFamily: "'DM Mono', monospace",
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(240,236,228,0.1)',
                userSelect: 'none',
              }}
            >
              Secured · Encrypted · Compliant
            </motion.p>
          </div>
        </>
      );
    }