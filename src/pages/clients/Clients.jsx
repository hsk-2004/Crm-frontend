import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { clientsApi } from '../../api/clients';



const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

function rowVariants(i) {
  return {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1, x: 0,
      transition: { delay: 0.4 + i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
  };
}



const HEALTH_CONFIG = {
  active: { label: 'Active', color: '#6ab5a0' },
  at_risk: { label: 'At Risk', color: '#d4af74' },
  churned: { label: 'Churned', color: '#c07070' },
  onboard: { label: 'Onboarding', color: '#7c9cbf' },
  inactive: { label: 'Inactive', color: '#888' },
};

const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'revenue', label: 'Revenue' },
  { value: 'health', label: 'Health' },
  { value: 'since', label: 'Client Since' },
];



function fmtRevenue(n) {
  if (!n && n !== 0) return '—';
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${Number(n).toLocaleString('en-IN')}`;
}

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?';
}

function getAvatarColor(name = '') {
  const palette = ['#b8965a', '#7c9cbf', '#a084ca', '#6ab5a0', '#d4af74', '#c07070'];
  return palette[(name.charCodeAt(0) || 0) % palette.length];
}



function Skeleton({ w = '100%', h = '13px', radius = '3px' }) {
  return <div className="c-skeleton" style={{ width: w, height: h, borderRadius: radius }} />;
}

function HealthBadge({ health }) {
  const cfg = HEALTH_CONFIG[health] || { label: health, color: '#888' };
  return (
    <span className="c-badge" style={{
      background: `${cfg.color}14`,
      border: `1px solid ${cfg.color}28`,
      color: cfg.color,
    }}>
      <span className="c-badge__dot" style={{ background: cfg.color }} />
      {cfg.label}
    </span>
  );
}

function Avatar({ name, logo }) {
  const color = getAvatarColor(name);
  if (logo) {
    return (
      <div className="c-avatar" style={{ background: `${color}10`, border: `1px solid ${color}22` }}>
        <img src={logo} alt={name} className="c-avatar__img" />
      </div>
    );
  }
  return (
    <div className="c-avatar" style={{ background: `${color}14`, border: `1px solid ${color}28`, color }}>
      {getInitials(name)}
    </div>
  );
}

function StatCard({ label, value, loading }) {
  return (
    <motion.div variants={itemVariants} className="c-stat">
      <div className="c-stat__topline" />
      <div className="c-stat__corner" />
      <span className="c-stat__value">
        {loading ? <Skeleton w="60px" h="32px" /> : value}
      </span>
      <span className="c-stat__label">
        {loading ? <Skeleton w="80px" h="10px" /> : label}
      </span>
    </motion.div>
  );
}

function EmptyState({ filtered }) {
  return (
    <div className="c-empty">
      <div className="c-empty__icon">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <p>{filtered ? 'No clients match your filters.' : 'No clients yet. Add your first client.'}</p>
    </div>
  );
}



const SearchIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const PlusIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="4.5" x2="12" y2="19.5" /><line x1="4.5" y1="12" x2="19.5" y2="12" />
  </svg>
);
const ExportIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);
const ChevronIcon = ({ asc }) => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: asc ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const DotsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" />
  </svg>
);
const FilterIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);
const LinkIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);





export function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [search, setSearch] = useState('');
  const [healthFilter, setHealth] = useState('all');
  const [sort, setSort] = useState('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);

  
  const fetchClients = useCallback(async () => {
    setLoading(true); setFetchError(null);
    try {
      const res = await clientsApi.getClients();
      setClients(res.data);
    } catch {
      setFetchError('Failed to load clients.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  
  const handleDelete = useCallback(async (client) => {
    setOpenMenu(null);
    try {
      await clientsApi.deleteClient(client.id);
      setClients(prev => prev.filter(c => c.id !== client.id));
    } catch {
      alert('Failed to delete client.');
    }
  }, []);

  
  const totalRevenue = clients.reduce((s, c) => s + (Number(c.revenue) || 0), 0);
  const totalMrr = clients.reduce((s, c) => s + (Number(c.mrr) || 0), 0);
  const activeCount = clients.filter(c => c.health === 'active').length;
  const atRiskCount = clients.filter(c => c.health === 'at_risk').length;

  
  const filtered = useMemo(() => {
    let out = [...clients];

    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(c =>
        c.name?.toLowerCase().includes(q) ||
        c.company?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.industry?.toLowerCase().includes(q)
      );
    }

    if (healthFilter !== 'all') {
      out = out.filter(c => c.health === healthFilter);
    }

    out.sort((a, b) => {
      let va, vb;
      if (sort === 'revenue') { va = Number(a.revenue) || 0; vb = Number(b.revenue) || 0; }
      else if (sort === 'health') { va = a.health || ''; vb = b.health || ''; }
      else if (sort === 'since') { va = a.since || ''; vb = b.since || ''; }
      else { va = a.name || ''; vb = b.name || ''; }

      if (typeof va === 'string') return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortAsc ? va - vb : vb - va;
    });

    return out;
  }, [clients, search, healthFilter, sort, sortAsc]);

  const handleSort = (field) => {
    if (sort === field) setSortAsc(p => !p);
    else { setSort(field); setSortAsc(true); }
  };

  const allHealths = ['all', ...Object.keys(HEALTH_CONFIG)];

  return (
    <>
      <style>{STYLES}</style>

      <div className="clients">
        <div className="clients__orb clients__orb--1" />
        <div className="clients__orb clients__orb--2" />
        <div className="clients__grid-overlay" />

        <div className="clients__inner">

          {}
          <motion.div className="clients__header" variants={containerVariants} initial="hidden" animate="visible">
            <div className="clients__header-left">
              <motion.span variants={itemVariants} className="clients__eyebrow">Client Management</motion.span>
              <motion.h1 variants={itemVariants} className="clients__title">Clients</motion.h1>
              <motion.p variants={itemVariants} className="clients__subtitle">
                Monitor relationships, health and revenue across your client base.
              </motion.p>
              <motion.div variants={itemVariants} className="clients__rule" />
            </div>
            <motion.div variants={itemVariants} className="clients__header-actions">
              <button className="c-btn c-btn--primary" onClick={() => { }}>
                <PlusIcon /> Add Client
              </button>
            </motion.div>
          </motion.div>

          {}
          <motion.div className="clients-stats" variants={containerVariants} initial="hidden" animate="visible">
            <StatCard label="Total Clients" value={loading ? null : clients.length} loading={loading} />
            <StatCard label="Total Revenue" value={loading ? null : fmtRevenue(totalRevenue)} loading={loading} />
            <StatCard label="Monthly Recurring" value={loading ? null : fmtRevenue(totalMrr)} loading={loading} />
            <StatCard label="Active" value={loading ? null : activeCount} loading={loading} />
          </motion.div>

          {}
          {!loading && atRiskCount > 0 && (
            <motion.div
              className="c-risk-banner"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="c-risk-banner__dot" />
              <span>
                <strong>{atRiskCount}</strong> client{atRiskCount > 1 ? 's are' : ' is'} marked at risk — consider scheduling a check-in.
              </span>
              <button className="c-risk-banner__filter" onClick={() => setHealth('at_risk')}>
                View at-risk →
              </button>
            </motion.div>
          )}

          {}
          <motion.div
            className="c-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="c-panel__topline" />
            <div className="c-panel__corner" />

            {}
            <div className="c-toolbar">
              <div className="c-search">
                <span className="c-search__icon"><SearchIcon /></span>
                <input
                  className="c-search__input"
                  placeholder="Search name, company, industry…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              <div className="c-toolbar__right">
                {}
                <div className="c-filters">
                  <FilterIcon />
                  {allHealths.map(h => {
                    const cfg = HEALTH_CONFIG[h];
                    const active = healthFilter === h;
                    return (
                      <button
                        key={h}
                        className={`c-filter-pill${active ? ' c-filter-pill--active' : ''}`}
                        style={active && cfg ? {
                          background: `${cfg.color}18`,
                          borderColor: `${cfg.color}44`,
                          color: cfg.color,
                        } : {}}
                        onClick={() => setHealth(h)}
                      >
                        {h === 'all' ? 'All' : HEALTH_CONFIG[h]?.label}
                      </button>
                    );
                  })}
                </div>

                {}
                <div className="c-sort">
                  <span className="c-sort__label">Sort</span>
                  <div className="c-sort__options">
                    {SORT_OPTIONS.map(o => (
                      <button
                        key={o.value}
                        className={`c-sort__btn${sort === o.value ? ' c-sort__btn--active' : ''}`}
                        onClick={() => handleSort(o.value)}
                      >
                        {o.label}
                        {sort === o.value && <ChevronIcon asc={sortAsc} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {}
            <div className="c-table-wrap">
              <table className="c-table">
                <thead>
                  <tr>
                    <th className="c-th">Client</th>
                    <th className="c-th">Health</th>
                    <th className="c-th">Industry</th>
                    <th className="c-th c-th--num">Revenue</th>
                    <th className="c-th c-th--num">MRR</th>
                    <th className="c-th">Assigned</th>
                    <th className="c-th">Since</th>
                    <th className="c-th c-th--actions" />
                  </tr>
                </thead>

                <tbody>
                  {loading
                    ? Array.from({ length: 7 }).map((_, i) => (
                      <tr key={i} className="c-tr">
                        <td className="c-td">
                          <div className="c-client-cell">
                            <div className="c-skeleton" style={{ width: 36, height: 36, borderRadius: 3, flexShrink: 0 }} />
                            <div>
                              <Skeleton w="110px" h="12px" />
                              <div style={{ marginTop: 5 }}><Skeleton w="80px" h="10px" /></div>
                            </div>
                          </div>
                        </td>
                        <td className="c-td" data-label="Health"><Skeleton w="80px" h="22px" radius="2px" /></td>
                        <td className="c-td" data-label="Industry"><Skeleton w="72px" h="11px" /></td>
                        <td className="c-td" data-label="Revenue"><Skeleton w="56px" h="11px" /></td>
                        <td className="c-td" data-label="MRR"><Skeleton w="48px" h="11px" /></td>
                        <td className="c-td" data-label="Assigned"><Skeleton w="60px" h="11px" /></td>
                        <td className="c-td" data-label="Since"><Skeleton w="72px" h="11px" /></td>
                        <td className="c-td" />
                      </tr>
                    ))
                    : filtered.length === 0
                      ? (
                        <tr>
                          <td colSpan={8}>
                            <EmptyState filtered={search !== '' || healthFilter !== 'all'} />
                          </td>
                        </tr>
                      )
                      : filtered.map((client, i) => (
                        <motion.tr
                          key={client.id ?? i}
                          className="c-tr"
                          variants={rowVariants(i)}
                          initial="hidden"
                          animate="visible"
                          onClick={() => { }}
                        >
                          {}
                          <td className="c-td">
                            <div className="c-client-cell">
                              <Avatar name={client.name || client.company || ''} logo={client.logo} />
                              <div>
                                <div className="c-client-name">{client.name || client.company || '—'}</div>
                                {client.name && client.company && (
                                  <div className="c-client-company">{client.company}</div>
                                )}
                                <div className="c-client-email">{client.email || ''}</div>
                              </div>
                            </div>
                          </td>

                          <td className="c-td" data-label="Health"><HealthBadge health={client.health} /></td>

                          <td className="c-td" data-label="Industry">
                            <span className="c-industry">{client.industry || '—'}</span>
                          </td>

                          <td className="c-td c-td--num" data-label="Revenue">
                            <span className="c-revenue">{fmtRevenue(client.revenue)}</span>
                          </td>

                          <td className="c-td c-td--num" data-label="MRR">
                            <span className="c-mrr">{client.mrr ? fmtRevenue(client.mrr) : '—'}</span>
                          </td>

                          <td className="c-td" data-label="Assigned">
                            <span className="c-assigned">{client.assigned || '—'}</span>
                          </td>

                          <td className="c-td" data-label="Since">
                            <span className="c-since">{client.since || '—'}</span>
                          </td>

                          {}
                          <td className="c-td c-td--actions" onClick={e => e.stopPropagation()}>
                            <div className="c-menu-wrap">
                              <button
                                className="c-dots-btn"
                                onClick={() => setOpenMenu(openMenu === client.id ? null : client.id)}
                              >
                                <DotsIcon />
                              </button>
                              {openMenu === client.id && (
                                <div className="c-menu">
                                  <div className="c-menu__topline" />
                                  <button className="c-menu__item c-menu__item--danger" onClick={() => handleDelete(client)}>
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))
                  }
                </tbody>
              </table>
            </div>

            {}
            {!loading && filtered.length > 0 && (
              <div className="c-panel__foot">
                <span className="c-panel__count">
                  Showing {filtered.length} of {clients.length} clients
                </span>
                {atRiskCount > 0 && (
                  <span className="c-panel__risk-note">
                    <span className="c-panel__risk-dot" />
                    {atRiskCount} at risk
                  </span>
                )}
              </div>
            )}
          </motion.div>

          {}
          <motion.p
            className="clients__footer"
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


.clients {
  min-height: calc(100vh - var(--nav-h));
  background: var(--bg);
  padding: clamp(24px, 3.5vw, 44px);
  font-family: 'DM Sans', sans-serif;
  position: relative;
  overflow: hidden;
}

@media (max-width: 768px) {
  .clients {
    padding: 16px;
    padding-bottom: 80px;
  }
}
.clients__orb {
  position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; filter: blur(90px);
}
.clients__orb--1 {
  top: -180px; right: -180px; width: 560px; height: 560px;
  background: radial-gradient(circle, rgba(184,150,90,0.07) 0%, transparent 70%);
}
.clients__orb--2 {
  bottom: -200px; left: -160px; width: 480px; height: 480px;
  background: radial-gradient(circle, rgba(100,80,180,0.055) 0%, transparent 70%);
}
.clients__grid-overlay {
  position: fixed; inset: 0; pointer-events: none; opacity: 0.012; z-index: 0;
  background-image:
    linear-gradient(rgba(184,150,90,1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(184,150,90,1) 1px, transparent 1px);
  background-size: 64px 64px;
}
.clients__inner {
  position: relative; z-index: 1;
  max-width: 1380px; margin: 0 auto;
}


.clients__header {
  display: flex; align-items: flex-end; justify-content: space-between;
  flex-wrap: wrap; gap: 20px; margin-bottom: 28px;
}
.clients__header-left { flex: 1; min-width: 220px; }
.clients__eyebrow {
  font-family: 'DM Mono', monospace; font-size: 10px;
  letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--gold); display: block; margin-bottom: 10px;
}
.clients__title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(28px, 4vw, 44px); font-weight: 300;
  color: var(--text-0); margin: 0 0 6px;
  line-height: 1.1; letter-spacing: -0.01em;
}
.clients__subtitle {
  font-size: 13px; font-weight: 300; color: var(--text-2); margin: 0; letter-spacing: 0.01em;
}
.clients__rule {
  width: 36px; height: 1px;
  background: linear-gradient(90deg, var(--gold), transparent);
  margin-top: 16px;
}
.clients__header-actions { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }


.c-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 18px; border-radius: var(--radius);
  font-family: 'DM Mono', monospace; font-size: 10.5px;
  letter-spacing: 0.14em; text-transform: uppercase;
  cursor: pointer;
  transition: background var(--t), border-color var(--t), color var(--t), box-shadow var(--t), transform var(--t);
}
.c-btn--ghost {
  background: var(--surface); border: 1px solid var(--border); color: var(--text-2);
}
.c-btn--ghost:hover {
  background: var(--surface-hover); border-color: rgba(255,255,255,0.14); color: var(--text-1);
}
.c-btn--primary {
  background: linear-gradient(135deg, var(--gold), #d4af74);
  border: none; color: #09090e; font-weight: 600;
}
.c-btn--primary:hover {
  opacity: 0.88; box-shadow: 0 0 18px var(--gold-glow); transform: translateY(-1px);
}
.c-btn--primary:active { transform: translateY(0); }


@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
}
.c-skeleton {
  display: block;
  background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 75%);
  background-size: 800px 100%;
  animation: shimmer 1.6s infinite;
  border-radius: 3px;
}


.clients-stats {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 14px; margin-bottom: 14px;
}
@media (max-width: 900px) { .clients-stats { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 500px) { .clients-stats { grid-template-columns: 1fr; } }

.c-stat {
  position: relative;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 22px 24px 18px;
  backdrop-filter: blur(16px); box-shadow: 0 6px 28px rgba(0,0,0,0.22);
  overflow: hidden;
}
.c-stat__topline {
  position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(184,150,90,0.55), transparent);
  opacity: 0.45;
}
.c-stat__corner {
  position: absolute; top: -1px; right: -1px;
  width: 14px; height: 14px;
  border-top: 1px solid rgba(184,150,90,0.28);
  border-right: 1px solid rgba(184,150,90,0.28);
  pointer-events: none;
}
.c-stat__value {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(28px, 3vw, 38px); font-weight: 300;
  color: var(--text-0); line-height: 1;
  letter-spacing: -0.02em; display: block;
  margin-bottom: 8px; min-height: 38px;
}
.c-stat__label {
  font-family: 'DM Mono', monospace; font-size: 9.5px;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--text-2); display: block;
}


.c-risk-banner {
  display: flex; align-items: center; gap: 10px;
  padding: 11px 18px; margin-bottom: 14px;
  background: rgba(192,112,112,0.07);
  border: 1px solid rgba(192,112,112,0.2);
  border-radius: var(--radius);
  font-size: 12.5px; font-weight: 300; color: var(--text-1);
}
.c-risk-banner__dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #c07070; flex-shrink: 0;
  box-shadow: 0 0 6px rgba(192,112,112,0.6);
}
.c-risk-banner strong { font-weight: 500; color: #d08080; }
.c-risk-banner__filter {
  margin-left: auto; background: none; border: none;
  font-family: 'DM Mono', monospace; font-size: 9.5px;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: rgba(192,112,112,0.7); cursor: pointer;
  transition: color var(--t); white-space: nowrap; padding: 0;
}
.c-risk-banner__filter:hover { color: #c07070; }


.c-panel {
  position: relative;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); backdrop-filter: blur(16px);
  box-shadow: 0 6px 28px rgba(0,0,0,0.22); overflow: hidden;
}
.c-panel__topline {
  position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(184,150,90,0.45), transparent);
  pointer-events: none;
}
.c-panel__corner {
  position: absolute; top: -1px; right: -1px;
  width: 16px; height: 16px;
  border-top: 1px solid rgba(184,150,90,0.32);
  border-right: 1px solid rgba(184,150,90,0.32);
  pointer-events: none;
}


.c-toolbar {
  display: flex; align-items: center; gap: 12px;
  padding: 18px 22px 16px; border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
}
.c-toolbar__right {
  display: flex; align-items: center; gap: 12px;
  margin-left: auto; flex-wrap: wrap;
}
.c-search {
  display: flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,0.03); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 0 12px; width: 240px;
  transition: border-color var(--t);
}
.c-search:focus-within { border-color: var(--border-gold); }
.c-search__icon { color: var(--text-3); flex-shrink: 0; }
.c-search__input {
  background: none; border: none; outline: none;
  font-family: 'DM Sans', sans-serif; font-size: 12.5px;
  font-weight: 300; color: var(--text-1); padding: 9px 0; width: 100%;
}
.c-search__input::placeholder { color: var(--text-3); }

.c-filters { display: flex; align-items: center; gap: 6px; color: var(--text-3); }
.c-filter-pill {
  font-family: 'DM Mono', monospace; font-size: 9px;
  letter-spacing: 0.14em; text-transform: uppercase;
  padding: 5px 10px; border-radius: 2px;
  background: transparent; border: 1px solid var(--border);
  color: var(--text-3); cursor: pointer;
  transition: background var(--t), border-color var(--t), color var(--t);
  white-space: nowrap;
}
.c-filter-pill:hover { color: var(--text-1); border-color: rgba(255,255,255,0.14); }
.c-filter-pill--active { color: var(--text-0); border-color: rgba(255,255,255,0.18); }

.c-sort { display: flex; align-items: center; gap: 8px; }
.c-sort__label {
  font-family: 'DM Mono', monospace; font-size: 9px;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--text-3); flex-shrink: 0;
}
.c-sort__options { display: flex; gap: 4px; }
.c-sort__btn {
  font-family: 'DM Mono', monospace; font-size: 9px;
  letter-spacing: 0.12em; text-transform: uppercase;
  padding: 5px 9px; border-radius: 2px;
  background: transparent; border: 1px solid transparent;
  color: var(--text-3); cursor: pointer;
  display: inline-flex; align-items: center; gap: 4px;
  transition: color var(--t), border-color var(--t), background var(--t);
}
.c-sort__btn:hover { color: var(--text-1); }
.c-sort__btn--active {
  color: var(--gold); border-color: var(--border-gold); background: var(--gold-soft);
}


@media (max-width: 700px) {
  .c-toolbar, .c-toolbar__right {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    margin: 0;
  }
  .c-search { width: 100%; box-sizing: border-box; }
  .c-filters, .c-sort {
    width: 100%;
    justify-content: space-between;
    overflow-x: auto;
    padding-bottom: 4px;
    margin-top: 10px;
  }
}


.c-table-wrap { overflow-x: auto; }
.c-table { width: 100%; border-collapse: collapse; }
.c-th {
  font-family: 'DM Mono', monospace; font-size: 10.5px;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--text-2); font-weight: 400;
  text-align: left; padding: 12px 20px;
  border-bottom: 1px solid var(--border); white-space: nowrap;
}
.c-th--num     { text-align: right; }
.c-th--actions { width: 40px; }

.c-tr {
  border-bottom: 1px solid rgba(255,255,255,0.04);
  cursor: pointer;
  transition: background var(--t);
}
.c-tr:last-child { border-bottom: none; }
.c-tr:hover { background: var(--surface-hover); }

.c-td { padding: 15px 20px; vertical-align: middle; }
.c-td--num     { text-align: right; }
.c-td--actions { text-align: right; }


.c-client-cell { display: flex; align-items: center; gap: 12px; }
.c-avatar {
  width: 36px; height: 36px; border-radius: var(--radius);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Cormorant Garamond', serif;
  font-size: 14px; font-weight: 600; flex-shrink: 0;
  overflow: hidden;
}
.c-avatar__img { width: 100%; height: 100%; object-fit: contain; }
.c-client-name  { font-size: 14px; font-weight: 400; color: var(--text-0); margin-bottom: 2px; }
.c-client-company { font-size: 12.5px; font-weight: 300; color: var(--text-2); margin-bottom: 1px; }
.c-client-email {
  font-family: 'DM Mono', monospace; font-size: 11px;
  color: var(--text-3); letter-spacing: 0.02em;
}


.c-badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 9px; border-radius: 2px;
  font-family: 'DM Mono', monospace; font-size: 10.5px;
  letter-spacing: 0.12em; text-transform: uppercase; white-space: nowrap;
}
.c-badge__dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }

.c-industry  { font-size: 13.5px; font-weight: 300; color: var(--text-2); }
.c-revenue   { font-family: 'DM Mono', monospace; font-size: 13px; color: var(--text-1); letter-spacing: 0.04em; }
.c-mrr       { font-family: 'DM Mono', monospace; font-size: 12.5px; color: var(--text-2); letter-spacing: 0.04em; }
.c-assigned  { font-size: 13.5px; font-weight: 300; color: var(--text-2); }
.c-since     { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--text-3); letter-spacing: 0.04em; white-space: nowrap; }


.c-menu-wrap { position: relative; display: inline-block; }
.c-dots-btn {
  background: none; border: none; color: var(--text-3); cursor: pointer;
  padding: 4px 6px; border-radius: var(--radius);
  display: flex; align-items: center;
  transition: color var(--t), background var(--t);
}
.c-dots-btn:hover { color: var(--text-1); background: var(--surface-hover); }
.c-menu {
  position: absolute; right: 0; top: calc(100% + 6px);
  min-width: 150px; background: #13131a;
  border: 1px solid var(--border); border-radius: var(--radius);
  overflow: hidden; z-index: 50;
  box-shadow: 0 12px 36px rgba(0,0,0,0.5);
}
.c-menu__topline {
  position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(184,150,90,0.45), transparent);
}
.c-menu__item {
  display: flex; align-items: center; gap: 8px;
  width: 100%; text-align: left; padding: 11px 16px;
  font-family: 'DM Mono', monospace; font-size: 10px;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--text-2); background: none; border: none;
  cursor: pointer; transition: background var(--t), color var(--t);
}
.c-menu__item:hover { background: var(--surface-hover); color: var(--text-0); }
.c-menu__item--danger { color: rgba(200,100,100,0.7); }
.c-menu__item--danger:hover { color: rgba(220,110,110,1); background: rgba(200,80,80,0.08); }
.c-menu__divider { height: 1px; background: var(--border); margin: 2px 0; }


.c-panel__foot {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 22px; border-top: 1px solid rgba(255,255,255,0.04);
}
.c-panel__count {
  font-family: 'DM Mono', monospace; font-size: 9.5px;
  letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-3);
}
.c-panel__risk-note {
  display: flex; align-items: center; gap: 6px;
  font-family: 'DM Mono', monospace; font-size: 9.5px;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: rgba(192,112,112,0.6);
}
.c-panel__risk-dot {
  width: 5px; height: 5px; border-radius: 50%; background: #c07070;
}


.c-empty {
  display: flex; flex-direction: column; align-items: center;
  padding: 52px 0; gap: 12px;
}
.c-empty__icon {
  width: 44px; height: 44px; background: var(--surface-hover);
  border: 1px solid var(--border); border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-3);
}
.c-empty p { font-size: 12px; color: var(--text-3); font-weight: 300; margin: 0; }


.clients__footer {
  text-align: center; margin-top: 44px;
  font-family: 'DM Mono', monospace; font-size: 10px;
  letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--text-3); user-select: none;
}


@media (max-width: 768px) {
  .c-table-wrap { overflow-x: visible; }
  .c-table { display: block; }
  .c-table thead { display: none; }
  .c-table tbody { display: block; }
  .c-tr {
    display: block;
    position: relative;
    background: rgba(255,255,255,0.02);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    margin-bottom: 16px;
    padding: 16px;
  }
  .c-tr:hover { background: rgba(255,255,255,0.04); }
  
  .c-td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
    border: none;
    text-align: right;
  }
  .c-td::before {
    content: attr(data-label);
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: var(--text-3);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-right: 12px;
    text-align: left;
    flex-shrink: 0;
  }
  
  
  .c-td:first-child {
    display: block;
    text-align: left;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 8px;
    padding-right: 32px; 
  }
  .c-td:first-child::before { display: none; }
  
  
  .c-td--actions {
    position: absolute;
    top: 16px;
    right: 16px;
    padding: 0;
    width: auto;
    justify-content: flex-end;
  }
  .c-td--actions::before { display: none; }
  
  
  .c-client-cell { gap: 12px; }
  .c-revenue, .c-mrr { font-size: 14px; }
}

@media (max-width: 700px) {
  .c-toolbar { flex-direction: column; align-items: stretch; }
  .c-toolbar__right { margin-left: 0; }
  .c-search { width: 100%; }
}
`;