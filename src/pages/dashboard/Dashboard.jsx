import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// ─── Animation Variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Animated Number ──────────────────────────────────────────────────────────

function AnimatedNumber({ target, prefix = '', suffix = '', duration = 1600 }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (target === null || target === undefined) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  if (target === null || target === undefined) return <span className="dash-skeleton dash-skeleton--inline" />;
  return <span>{prefix}{current.toLocaleString()}{suffix}</span>;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ w = '100%', h = '14px', radius = '3px' }) {
  return (
    <div className="dash-skeleton" style={{ width: w, height: h, borderRadius: radius }} />
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, delta, icon, prefix = '', suffix = '', loading }) {
  const [hovered, setHovered] = useState(false);
  const isPositive = delta >= 0;

  return (
    <motion.div
      variants={cardVariants}
      className={`stat-card${hovered ? ' stat-card--hovered' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top shimmer line */}
      <div className="stat-card__topline" />
      {/* Corner tick */}
      <div className="stat-card__corner" />

      {/* Header row */}
      <div className="stat-card__header">
        <span className="stat-card__label">
          {loading ? <Skeleton w="80px" h="10px" /> : label}
        </span>
        <div className="stat-card__icon">{icon}</div>
      </div>

      {/* Value */}
      <div className="stat-card__value">
        {loading
          ? <Skeleton w="100px" h="40px" radius="2px" />
          : <AnimatedNumber target={value} prefix={prefix} suffix={suffix} />
        }
      </div>

      {/* Delta */}
      <div className="stat-card__footer">
        {loading ? (
          <Skeleton w="100px" h="11px" />
        ) : (
          <>
            <span className={`stat-card__delta ${isPositive ? 'stat-card__delta--up' : 'stat-card__delta--down'}`}>
              {isPositive ? '↑' : '↓'} {Math.abs(delta)}%
            </span>
            <span className="stat-card__period">vs last month</span>
          </>
        )}
      </div>
    </motion.div>
  );
}

// ─── Activity Row ─────────────────────────────────────────────────────────────

const TYPE_CONFIG = {
  lead: { color: '#b8965a', label: 'LEAD' },
  client: { color: '#7c9cbf', label: 'CLIENT' },
  team: { color: '#a084ca', label: 'TEAM' },
};

function ActivityRow({ name, action, time, type, index }) {
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.lead;
  return (
    <motion.div
      className="activity-row"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 + index * 0.065, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="activity-row__avatar" style={{ background: `${cfg.color}18`, border: `1px solid ${cfg.color}30`, color: cfg.color }}>
        {name?.[0]?.toUpperCase()}
      </div>
      <div className="activity-row__body">
        <span className="activity-row__name">{name}</span>
        <span className="activity-row__action"> {action}</span>
      </div>
      <span className="activity-row__time">{time}</span>
      <span className="activity-row__badge" style={{ background: `${cfg.color}14`, border: `1px solid ${cfg.color}28`, color: cfg.color }}>
        {cfg.label}
      </span>
    </motion.div>
  );
}

function ActivitySkeleton() {
  return (
    <div className="activity-row">
      <div className="dash-skeleton" style={{ width: 32, height: 32, borderRadius: 3, flexShrink: 0 }} />
      <div className="activity-row__body">
        <Skeleton w="60%" h="12px" />
      </div>
      <Skeleton w="40px" h="10px" />
      <Skeleton w="44px" h="20px" radius="3px" />
    </div>
  );
}

// ─── Pipeline Bar ─────────────────────────────────────────────────────────────

function PipelineBar({ label, value, max, color, index, loading }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <motion.div
      className="pipeline-bar"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 + index * 0.075, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="pipeline-bar__meta">
        {loading ? <Skeleton w="80px" h="11px" /> : <span className="pipeline-bar__label">{label}</span>}
        {loading ? <Skeleton w="24px" h="11px" /> : <span className="pipeline-bar__value">{value}</span>}
      </div>
      <div className="pipeline-bar__track">
        <motion.div
          className="pipeline-bar__fill"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
          initial={{ width: 0 }}
          animate={{ width: loading ? '0%' : `${pct}%` }}
          transition={{ delay: 0.7 + index * 0.075, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </motion.div>
  );
}

// ─── Quick Action Button ──────────────────────────────────────────────────────

function QuickAction({ label, icon, onClick, variant = 'ghost' }) {
  return (
    <button className={`quick-action quick-action--${variant}`} onClick={onClick}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

/**
 * Dashboard component.
 *
 * Props (all optional — wire up to your API):
 *   stats:    { totalLeads, activeClients, teamMembers, conversions,
 *               leadsDelta, clientsDelta, teamDelta, conversionsDelta }
 *   activity: Array<{ id, name, action, time, type }>
 *   pipeline: Array<{ label, value, color }>
 *   loading:  boolean
 *   onAddLead: () => void
 *   onExport:  () => void
 *   userName:  string   (e.g. from useAuth)
 *   dateLabel: string   (e.g. "Feb 2026")
 */
export function Dashboard({
  stats = {},
  activity = [],
  pipeline = [],
  loading = false,
  onAddLead,
  onExport,
  userName,
  dateLabel,
}) {
  // Derive total pipeline count
  const pipelineTotal = pipeline.reduce((sum, s) => sum + (s.value || 0), 0);
  const pipelineMax = pipelineTotal || 1;

  const statCards = [
    {
      label: 'Total Leads',
      value: stats.totalLeads,
      delta: stats.leadsDelta ?? 0,
      icon: <LeadIcon />,
    },
    {
      label: 'Active Clients',
      value: stats.activeClients,
      delta: stats.clientsDelta ?? 0,
      icon: <ClientIcon />,
    },
    {
      label: 'New Leads (This Month)',
      value: stats.newLeads,
      delta: stats.newLeadsDelta ?? 0,
      icon: <LeadIcon />,
    },
    {
      label: 'Closed Leads',
      value: stats.closedLeads,
      delta: stats.closedLeadsDelta ?? 0,
      icon: <ClientIcon />,
    },
  ];


  // Current greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <>
      <style>{STYLES}</style>

      <div className="dash">
        {/* Ambient orbs */}
        <div className="dash__orb dash__orb--1" />
        <div className="dash__orb dash__orb--2" />
        <div className="dash__grid-overlay" />

        <div className="dash__inner">

          {/* ── Header ───────────────────────────────────── */}
          <motion.div
            className="dash__header"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="dash__header-left">
              <motion.span variants={itemVariants} className="dash__eyebrow">
                {dateLabel || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </motion.span>
              <motion.h1 variants={itemVariants} className="dash__title">
                {greeting}{userName ? `, ${userName.split(' ')[0]}` : ''}
              </motion.h1>
              <motion.p variants={itemVariants} className="dash__subtitle">
                Here's what's happening across your workspace today.
              </motion.p>
              <motion.div variants={itemVariants} className="dash__rule" />
            </div>

            <motion.div variants={itemVariants} className="dash__header-actions">
              <QuickAction
                label="Export"
                variant="ghost"
                onClick={onExport}
                icon={<ExportIcon />}
              />
              <QuickAction
                label="Add Lead"
                variant="primary"
                onClick={onAddLead}
                icon={<PlusIcon />}
              />
            </motion.div>
          </motion.div>

          {/* ── Stat Cards ───────────────────────────────── */}
          <motion.div
            className="dash-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {statCards.map((card) => (
              <StatCard key={card.label} {...card} loading={loading} />
            ))}
          </motion.div>

          {/* ── Bottom Row ───────────────────────────────── */}
          <div className="dash-bottom">

            {/* Activity Feed */}
            <motion.div
              className="panel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="panel__topline" />
              <div className="panel__corner" />

              <div className="panel__head">
                <div>
                  <span className="panel__label">Recent Activity</span>
                  <p className="panel__sub">Latest updates across your CRM</p>
                </div>
                {!loading && activity.length > 0 && (
                  <button className="panel__see-all">View all →</button>
                )}
              </div>

              <div className="panel__body">
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => <ActivitySkeleton key={i} />)
                  : activity.length === 0
                    ? <EmptyState message="No recent activity yet." />
                    : activity.map((item, i) => (
                      <ActivityRow key={item.id ?? i} {...item} index={i} />
                    ))
                }
              </div>
            </motion.div>

            {/* Pipeline */}
            <motion.div
              className="panel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.46, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="panel__topline" />
              <div className="panel__corner" />

              <div className="panel__head">
                <div>
                  <span className="panel__label">Lead Overview</span>
                  <p className="panel__sub">Current lead status summary</p>

                </div>
              </div>

              <div className="panel__body">
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="pipeline-bar">
                      <div className="pipeline-bar__meta">
                        <Skeleton w="80px" h="11px" />
                        <Skeleton w="24px" h="11px" />
                      </div>
                      <Skeleton w="100%" h="3px" radius="2px" />
                    </div>
                  ))
                  : pipeline.length === 0
                    ? <EmptyState message="No pipeline data yet." />
                    : pipeline.map((item, i) => (
                      <PipelineBar key={item.label} {...item} max={pipelineMax} index={i} />
                    ))
                }
              </div>

              {/* Total */}
              {!loading && pipeline.length > 0 && (
                <div className="panel__total">
                  <span className="panel__total-label">Total Pipeline</span>
                  <span className="panel__total-value">{pipelineTotal.toLocaleString()}</span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Footer */}
          <motion.p
            className="dash__footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            Secured · Encrypted · Compliant
          </motion.p>
        </div>
      </div>
    </>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ message }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <p>{message}</p>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function LeadIcon() {
  return (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}
function ClientIcon() {
  return (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
    </svg>
  );
}
function TeamIcon() {
  return (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  );
}
function ConversionIcon() {
  return (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
  );
}
function ExportIcon() {
  return (
    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@300;400&display=swap');

/* ── Tokens ── */
:root {
  --nav-h: 64px;
  --gold: #b8965a;
  --gold-glow: rgba(184,150,90,0.2);
  --gold-soft: rgba(184,150,90,0.08);
  --bg: #09090e;
  --surface: rgba(255,255,255,0.028);
  --surface-hover: rgba(255,255,255,0.046);
  --border: rgba(255,255,255,0.07);
  --border-gold: rgba(184,150,90,0.22);
  --text-0: #f0ece4;
  --text-1: rgba(240,236,228,0.82);
  --text-2: rgba(240,236,228,0.60);
  --text-3: rgba(240,236,228,0.42);
  --up: rgba(100,200,120,0.85);
  --down: rgba(220,100,100,0.85);
  --radius: 3px;
  --t: 200ms cubic-bezier(0.4,0,0.2,1);
}

/* ── Skeleton shimmer ── */
@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
.dash-skeleton {
  display: block;
  background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 75%);
  background-size: 800px 100%;
  animation: shimmer 1.6s infinite;
  border-radius: 3px;
}
.dash-skeleton--inline { width: 80px; height: 10px; display: inline-block; vertical-align: middle; }

/* ── Shell ── */
.dash {
  min-height: calc(100vh - var(--nav-h));
  background: var(--bg);
  padding: clamp(24px, 3.5vw, 44px);
  font-family: 'DM Sans', sans-serif;
  position: relative;
  overflow: hidden;
}

/* Ambient orbs */
.dash__orb {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  filter: blur(90px);
}
.dash__orb--1 {
  top: -180px; right: -180px;
  width: 560px; height: 560px;
  background: radial-gradient(circle, rgba(184,150,90,0.07) 0%, transparent 70%);
}
.dash__orb--2 {
  bottom: -200px; left: -160px;
  width: 480px; height: 480px;
  background: radial-gradient(circle, rgba(100,80,180,0.055) 0%, transparent 70%);
}

/* Subtle grid */
.dash__grid-overlay {
  position: fixed; inset: 0; pointer-events: none; opacity: 0.012; z-index: 0;
  background-image:
    linear-gradient(rgba(184,150,90,1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(184,150,90,1) 1px, transparent 1px);
  background-size: 64px 64px;
}

/* ── Inner ── */
.dash__inner {
  position: relative; z-index: 1;
  max-width: 1380px; margin: 0 auto;
}

/* ── Header ── */
.dash__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 32px;
}
.dash__header-left { flex: 1; min-width: 220px; }
.dash__eyebrow {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--gold);
  display: block;
  margin-bottom: 10px;
}
.dash__title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 300;
  color: var(--text-0);
  margin: 0 0 6px;
  line-height: 1.1;
  letter-spacing: -0.01em;
}
.dash__subtitle {
  font-size: 13px;
  font-weight: 300;
  color: var(--text-2);
  margin: 0;
  letter-spacing: 0.01em;
}
.dash__rule {
  width: 36px; height: 1px;
  background: linear-gradient(90deg, var(--gold), transparent);
  margin-top: 16px;
}
.dash__header-actions {
  display: flex; align-items: center; gap: 10px; flex-shrink: 0;
}

/* Quick actions */
.quick-action {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 18px; border-radius: var(--radius);
  font-family: 'DM Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background var(--t), border-color var(--t), color var(--t), box-shadow var(--t), transform var(--t);
}
.quick-action--ghost {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text-2);
}
.quick-action--ghost:hover {
  background: var(--surface-hover);
  border-color: rgba(255,255,255,0.14);
  color: var(--text-1);
}
.quick-action--primary {
  background: linear-gradient(135deg, var(--gold), #d4af74);
  border: none;
  color: #09090e;
  font-weight: 600;
}
.quick-action--primary:hover {
  opacity: 0.88;
  box-shadow: 0 0 18px var(--gold-glow);
  transform: translateY(-1px);
}
.quick-action--primary:active { transform: translateY(0); }

/* ── Stat grid ── */
.dash-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 14px;
}
@media (max-width: 1100px) { .dash-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px)  { .dash-grid { grid-template-columns: 1fr; } }

/* ── Stat card ── */
.stat-card {
  position: relative;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 26px 26px 22px;
  cursor: default;
  backdrop-filter: blur(16px);
  box-shadow: 0 6px 28px rgba(0,0,0,0.22);
  transition: background var(--t), border-color var(--t), box-shadow var(--t);
  overflow: hidden;
}
.stat-card--hovered {
  background: var(--surface-hover);
  border-color: var(--border-gold);
  box-shadow: 0 20px 56px rgba(0,0,0,0.38), inset 0 0 0 1px rgba(184,150,90,0.06);
}
.stat-card__topline {
  position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(184,150,90,0.55), transparent);
  opacity: 0.45;
  transition: opacity var(--t);
}
.stat-card--hovered .stat-card__topline { opacity: 1; }
.stat-card__corner {
  position: absolute; top: -1px; right: -1px;
  width: 16px; height: 16px;
  border-top: 1px solid rgba(184,150,90,0.28);
  border-right: 1px solid rgba(184,150,90,0.28);
  transition: border-color var(--t);
  pointer-events: none;
}
.stat-card--hovered .stat-card__corner {
  border-color: rgba(184,150,90,0.65);
}
.stat-card__header {
  display: flex; align-items: flex-start; justify-content: space-between;
  margin-bottom: 18px;
}
.stat-card__label {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-2);
  font-weight: 400;
}
.stat-card__icon {
  width: 30px; height: 30px; flex-shrink: 0;
  background: var(--gold-soft);
  border: 1px solid rgba(184,150,90,0.2);
  border-radius: var(--radius);
  display: flex; align-items: center; justify-content: center;
  color: var(--gold);
}
.stat-card__value {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(34px, 3.5vw, 46px);
  font-weight: 300;
  color: var(--text-0);
  line-height: 1;
  margin-bottom: 10px;
  letter-spacing: -0.02em;
  min-height: 46px;
}
.stat-card__footer {
  display: flex; align-items: center; gap: 6px;
  min-height: 16px;
}
.stat-card__delta {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.06em;
}
.stat-card__delta--up   { color: var(--up); }
.stat-card__delta--down { color: var(--down); }
.stat-card__period {
  font-size: 11px;
  color: var(--text-3);
  font-weight: 300;
}

/* ── Bottom grid ── */
.dash-bottom {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 14px;
}
@media (max-width: 1000px) { .dash-bottom { grid-template-columns: 1fr; } }

/* ── Panel (shared card) ── */
.panel {
  position: relative;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 26px;
  backdrop-filter: blur(16px);
  box-shadow: 0 6px 28px rgba(0,0,0,0.22);
  overflow: hidden;
}
.panel__topline {
  position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(184,150,90,0.45), transparent);
}
.panel__corner {
  position: absolute; top: -1px; right: -1px;
  width: 16px; height: 16px;
  border-top: 1px solid rgba(184,150,90,0.32);
  border-right: 1px solid rgba(184,150,90,0.32);
  pointer-events: none;
}
.panel__head {
  display: flex; align-items: flex-start; justify-content: space-between;
  margin-bottom: 20px;
  gap: 12px;
}
.panel__label {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gold);
  display: block;
  margin-bottom: 4px;
}
.panel__sub {
  font-size: 13px;
  color: var(--text-2);
  font-weight: 300;
  margin: 0;
  letter-spacing: 0.02em;
}
.panel__see-all {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--text-2);
  background: none;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: color var(--t);
  flex-shrink: 0;
  padding: 0;
}
.panel__see-all:hover { color: var(--gold); }
.panel__body { display: flex; flex-direction: column; gap: 0; }
.panel__total {
  display: flex; justify-content: space-between; align-items: center;
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid rgba(255,255,255,0.05);
}
.panel__total-label {
  font-family: 'DM Mono', monospace;
  font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--text-3);
}
.panel__total-value {
  font-family: 'Cormorant Garamond', serif;
  font-size: 28px; font-weight: 300;
  color: var(--text-0); letter-spacing: -0.02em;
}

/* ── Activity row ── */
.activity-row {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.activity-row:last-child { border-bottom: none; }
.activity-row__avatar {
  width: 30px; height: 30px; border-radius: var(--radius); flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Cormorant Garamond', serif;
  font-size: 13px; font-weight: 600;
}
.activity-row__body {
  flex: 1; min-width: 0;
  font-size: 14px; color: var(--text-1);
  font-weight: 300;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.activity-row__name { color: var(--text-0); font-weight: 400; }
.activity-row__action { font-weight: 300; }
.activity-row__time {
  font-family: 'DM Mono', monospace;
  font-size: 11.5px; color: var(--text-2); letter-spacing: 0.06em;
  flex-shrink: 0;
}
.activity-row__badge {
  padding: 3px 7px;
  border-radius: 2px;
  font-family: 'DM Mono', monospace;
  font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase;
  flex-shrink: 0;
}

/* ── Pipeline bar ── */
.pipeline-bar { margin-bottom: 14px; }
.pipeline-bar:last-child { margin-bottom: 0; }
.pipeline-bar__meta {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 6px;
}
.pipeline-bar__label {
  font-family: 'DM Sans', sans-serif;
  font-size: 13.5px; font-weight: 400; color: var(--text-1);
}
.pipeline-bar__value {
  font-family: 'DM Mono', monospace;
  font-size: 12.5px; color: var(--text-1); letter-spacing: 0.04em;
}
.pipeline-bar__track {
  height: 3px; background: rgba(255,255,255,0.05);
  border-radius: 2px; overflow: hidden;
}
.pipeline-bar__fill { height: 100%; border-radius: 2px; }

/* ── Empty state ── */
.empty-state {
  display: flex; flex-direction: column; align-items: center;
  padding: 32px 0; gap: 10px;
}
.empty-state__icon {
  width: 40px; height: 40px; border-radius: 8px;
  background: var(--surface-hover);
  border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-3);
}
.empty-state p {
  font-size: 12px; color: var(--text-3);
  font-weight: 300; margin: 0;
  font-family: 'DM Sans', sans-serif;
}

/* ── Footer ── */
.dash__footer {
  text-align: center; margin-top: 44px;
  font-family: 'DM Mono', monospace;
  font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--text-3); user-select: none;
}
`;