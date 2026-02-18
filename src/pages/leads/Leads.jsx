import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { leadsApi } from '../../api/leads';

// ─── Animation Variants (mirrors dashboard) ───────────────────────────────────

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

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  new: { label: 'New', color: '#7c9cbf' },
  contacted: { label: 'Contacted', color: '#b8965a' },
  converted: { label: 'Converted', color: '#7cbf8e' },
  lost: { label: 'Lost', color: '#c07070' },
};


const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'value', label: 'Deal Value' },
  { value: 'status', label: 'Status' },
  { value: 'date', label: 'Date Added' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtValue(n) {
  if (!n && n !== 0) return '—';
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${Number(n).toLocaleString('en-IN')}`;
}

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?';
}

function getAvatarColor(name = '') {
  const palette = ['#b8965a', '#7c9cbf', '#a084ca', '#6ab5a0', '#d4af74'];
  return palette[(name.charCodeAt(0) || 0) % palette.length];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Skeleton({ w = '100%', h = '13px', radius = '3px' }) {
  return <div className="l-skeleton" style={{ width: w, height: h, borderRadius: radius }} />;
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { label: status, color: '#888' };
  return (
    <span className="l-badge" style={{
      background: `${cfg.color}14`,
      border: `1px solid ${cfg.color}28`,
      color: cfg.color,
    }}>
      <span className="l-badge__dot" style={{ background: cfg.color }} />
      {cfg.label}
    </span>
  );
}

function Avatar({ name }) {
  const color = getAvatarColor(name);
  return (
    <div className="l-avatar" style={{
      background: `${color}14`,
      border: `1px solid ${color}28`,
      color,
    }}>
      {getInitials(name)}
    </div>
  );
}

function StatCard({ label, value, loading }) {
  return (
    <motion.div variants={itemVariants} className="l-stat">
      <div className="l-stat__topline" />
      <div className="l-stat__corner" />
      <span className="l-stat__value">
        {loading ? <Skeleton w="60px" h="32px" /> : value}
      </span>
      <span className="l-stat__label">
        {loading ? <Skeleton w="80px" h="10px" /> : label}
      </span>
    </motion.div>
  );
}

function EmptyState({ filtered }) {
  return (
    <div className="l-empty">
      <div className="l-empty__icon">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      </div>
      <p>{filtered ? 'No leads match your filters.' : 'No leads yet. Add your first lead.'}</p>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

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

// ─── Leads Page ───────────────────────────────────────────────────────────────

/**
 * Props:
 *   leads      – Array<{
 *                  id, name, company, email, phone,
 *                  status, source, value, assigned, date
 *                }>
 *   loading    – boolean
 *   onAddLead  – () => void
 *   onExport   – () => void
 *   onEditLead – (lead) => void
 *   onDeleteLead – (lead) => void
 */
// ─── Add Lead Modal ───────────────────────────────────────────────────────────

const EMPTY_FORM = {
  name: '', company: '', email: '', phone: '',
  status: 'new', source: '', value: '', assigned: '',
};

function AddLeadModal({ onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const overlayRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Name is required.'); return; }
    setSaving(true); setError(null);
    try {
      const payload = { ...form, value: form.value ? Number(form.value) : null };
      const res = await leadsApi.createLead(payload);
      onSaved(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save lead.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="lm-overlay" ref={overlayRef} onClick={e => { if (e.target === overlayRef.current) onClose(); }}>
      <motion.div
        className="lm-panel"
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="lm-topline" />
        <div className="lm-corner" />
        <div className="lm-header">
          <span className="lm-eyebrow">New Lead</span>
          <button className="lm-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {error && <div className="lm-error">{error}</div>}

        <form onSubmit={handleSubmit} className="lm-form">
          <div className="lm-row">
            <div className="lm-field">
              <label className="lm-label">Name *</label>
              <input className="lm-input" name="name" value={form.name} onChange={handleChange} placeholder="Full name" required />
            </div>
            <div className="lm-field">
              <label className="lm-label">Company</label>
              <input className="lm-input" name="company" value={form.company} onChange={handleChange} placeholder="Company" />
            </div>
          </div>
          <div className="lm-row">
            <div className="lm-field">
              <label className="lm-label">Email</label>
              <input className="lm-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@example.com" />
            </div>
            <div className="lm-field">
              <label className="lm-label">Phone</label>
              <input className="lm-input" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" />
            </div>
          </div>
          <div className="lm-row">
            <div className="lm-field">
              <label className="lm-label">Status</label>
              <select className="lm-input lm-select" name="status" value={form.status} onChange={handleChange}>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </select>
            </div>
            <div className="lm-field">
              <label className="lm-label">Source</label>
              <input className="lm-input" name="source" value={form.source} onChange={handleChange} placeholder="Referral, Website…" />
            </div>
          </div>
          <div className="lm-row">
            <div className="lm-field">
              <label className="lm-label">Deal Value (₹)</label>
              <input className="lm-input" name="value" type="number" min="0" value={form.value} onChange={handleChange} placeholder="0" />
            </div>
            <div className="lm-field">
              <label className="lm-label">Assigned To</label>
              <input className="lm-input" name="assigned" value={form.assigned} onChange={handleChange} placeholder="Rep name" />
            </div>
          </div>

          <div className="lm-actions">
            <button type="button" className="lm-btn lm-btn--ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="lm-btn lm-btn--primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save Lead'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Leads Page ───────────────────────────────────────────────────────────────

export function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatus] = useState('all');
  const [sort, setSort] = useState('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  // ── Fetch leads on mount ──
  const fetchLeads = useCallback(async () => {
    setLoading(true); setFetchError(null);
    try {
      const res = await leadsApi.getLeads();
      setLeads(res.data);
    } catch {
      setFetchError('Failed to load leads.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  // ── Delete lead ──
  const handleDelete = useCallback(async (lead) => {
    setOpenMenu(null);
    try {
      await leadsApi.deleteLead(lead.id);
      setLeads(prev => prev.filter(l => l.id !== lead.id));
    } catch {
      alert('Failed to delete lead.');
    }
  }, []);

  // ── After a lead is saved via modal ──
  const handleLeadSaved = useCallback((newLead) => {
    setLeads(prev => [newLead, ...prev]);
  }, []);

  // ── Convert lead to client ──
  const handleConvert = useCallback(async (lead) => {
    setOpenMenu(null);
    try {
      await leadsApi.convertToClient(lead.id);
      setLeads(prev => prev.filter(l => l.id !== lead.id));
    } catch {
      alert('Failed to convert lead to client.');
    }
  }, []);

  // ── Derived stats ──
  const newCount = leads.filter(l => l.status === 'new').length;
  const convertedCt = leads.filter(l => l.status === 'converted').length;
  const lostCt = leads.filter(l => l.status === 'lost').length;


  // ── Filter + sort ──
  const filtered = useMemo(() => {
    let out = [...leads];

    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(l =>
        l.name?.toLowerCase().includes(q) ||
        l.company?.toLowerCase().includes(q) ||
        l.email?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      out = out.filter(l => l.status === statusFilter);
    }

    out.sort((a, b) => {
      let va, vb;
      if (sort === 'value') { va = Number(a.value) || 0; vb = Number(b.value) || 0; }
      else if (sort === 'name') { va = a.name || ''; vb = b.name || ''; }
      else if (sort === 'status') { va = a.status || ''; vb = b.status || ''; }
      else { va = a.date || ''; vb = b.date || ''; }

      if (typeof va === 'string') return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortAsc ? va - vb : vb - va;
    });

    return out;
  }, [leads, search, statusFilter, sort, sortAsc]);

  const handleSort = (field) => {
    if (sort === field) setSortAsc(p => !p);
    else { setSort(field); setSortAsc(false); }
  };

  const allStatuses = ['all', ...Object.keys(STATUS_CONFIG)];

  return (
    <>
      <AnimatePresence>
        {showModal && (
          <AddLeadModal
            onClose={() => setShowModal(false)}
            onSaved={handleLeadSaved}
          />
        )}
      </AnimatePresence>
      <style>{STYLES}</style>

      <div className="leads">
        {/* Ambient orbs — identical to dashboard */}
        <div className="leads__orb leads__orb--1" />
        <div className="leads__orb leads__orb--2" />
        <div className="leads__grid-overlay" />

        <div className="leads__inner">

          {/* ── Header ── */}
          <motion.div className="leads__header" variants={containerVariants} initial="hidden" animate="visible">
            <div className="leads__header-left">
              <motion.span variants={itemVariants} className="leads__eyebrow">Lead Management</motion.span>
              <motion.h1 variants={itemVariants} className="leads__title">Leads</motion.h1>
              <motion.p variants={itemVariants} className="leads__subtitle">
                Track, qualify and convert your pipeline prospects.
              </motion.p>
              <motion.div variants={itemVariants} className="leads__rule" />
            </div>

            <motion.div variants={itemVariants} className="leads__header-actions">
              <button className="l-btn l-btn--primary" onClick={() => setShowModal(true)}>
                <PlusIcon /> Add Lead
              </button>
            </motion.div>
          </motion.div>

          {/* ── Stat Strip ── */}
          <motion.div className="leads-stats" variants={containerVariants} initial="hidden" animate="visible">
            <StatCard label="Total Leads" value={loading ? null : leads.length} loading={loading} />
            <StatCard label="New Leads" value={loading ? null : newCount} loading={loading} />
            <StatCard label="Converted Leads" value={loading ? null : convertedCt} loading={loading} />
            <StatCard label="Lost Leads" value={loading ? null : lostCt} loading={loading} />

          </motion.div>

          {/* ── Table Panel ── */}
          <motion.div
            className="l-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="l-panel__topline" />
            <div className="l-panel__corner" />

            {/* ── Toolbar ── */}
            <div className="l-toolbar">
              {/* Search */}
              <div className="l-search">
                <span className="l-search__icon"><SearchIcon /></span>
                <input
                  className="l-search__input"
                  placeholder="Search name, company, email…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              <div className="l-toolbar__right">
                {/* Status filter pills */}
                <div className="l-filters">
                  <FilterIcon />
                  {allStatuses.map(s => {
                    const cfg = STATUS_CONFIG[s];
                    const active = statusFilter === s;
                    return (
                      <button
                        key={s}
                        className={`l-filter-pill${active ? ' l-filter-pill--active' : ''}`}
                        style={active && cfg ? {
                          background: `${cfg.color}18`,
                          borderColor: `${cfg.color}44`,
                          color: cfg.color,
                        } : {}}
                        onClick={() => setStatus(s)}
                      >
                        {s === 'all' ? 'All' : STATUS_CONFIG[s]?.label}
                      </button>
                    );
                  })}
                </div>

                {/* Sort */}
                <div className="l-sort">
                  <span className="l-sort__label">Sort</span>
                  <div className="l-sort__options">
                    {SORT_OPTIONS.map(o => (
                      <button
                        key={o.value}
                        className={`l-sort__btn${sort === o.value ? ' l-sort__btn--active' : ''}`}
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

            {/* ── Table ── */}
            <div className="l-table-wrap">
              <table className="l-table">
                <thead>
                  <tr>
                    <th className="l-th">Lead</th>
                    <th className="l-th">Status</th>
                    <th className="l-th">Source</th>
                    <th className="l-th l-th--num">Deal Value</th>
                    <th className="l-th">Assigned</th>
                    <th className="l-th">Date Added</th>
                    <th className="l-th l-th--actions" />
                  </tr>
                </thead>

                <tbody>
                  {loading
                    ? Array.from({ length: 7 }).map((_, i) => (
                      <tr key={i} className="l-tr">
                        <td className="l-td">
                          <div className="l-lead-cell">
                            <div className="l-skeleton" style={{ width: 32, height: 32, borderRadius: 3, flexShrink: 0 }} />
                            <div>
                              <Skeleton w="110px" h="12px" />
                              <div style={{ marginTop: 5 }}><Skeleton w="80px" h="10px" /></div>
                            </div>
                          </div>
                        </td>
                        <td className="l-td"><Skeleton w="80px" h="22px" radius="2px" /></td>
                        <td className="l-td"><Skeleton w="64px" h="11px" /></td>
                        <td className="l-td"><Skeleton w="52px" h="11px" /></td>
                        <td className="l-td"><Skeleton w="56px" h="11px" /></td>
                        <td className="l-td"><Skeleton w="76px" h="11px" /></td>
                        <td className="l-td" />
                      </tr>
                    ))
                    : filtered.length === 0
                      ? (
                        <tr>
                          <td colSpan={7}>
                            <EmptyState filtered={search !== '' || statusFilter !== 'all'} />
                          </td>
                        </tr>
                      )
                      : filtered.map((lead, i) => (
                        <motion.tr
                          key={lead.id ?? i}
                          className="l-tr"
                          custom={i}
                          variants={rowVariants(i)}
                          initial="hidden"
                          animate="visible"
                          onClick={() => { }}
                        >
                          {/* Lead cell */}
                          <td className="l-td">
                            <div className="l-lead-cell">
                              <Avatar name={lead.name || ''} />
                              <div>
                                <div className="l-lead-name">{lead.name || '—'}</div>
                                <div className="l-lead-company">{lead.company || ''}</div>
                                <div className="l-lead-email">{lead.email || ''}</div>
                              </div>
                            </div>
                          </td>
                          <td className="l-td"><StatusBadge status={lead.status} /></td>
                          <td className="l-td">
                            <span className="l-source">{lead.source || '—'}</span>
                          </td>
                          <td className="l-td l-td--num">
                            <span className="l-value">{fmtValue(lead.value)}</span>
                          </td>
                          <td className="l-td">
                            <span className="l-assigned">{lead.assigned || '—'}</span>
                          </td>
                          <td className="l-td">
                            <span className="l-date">{lead.date || '—'}</span>
                          </td>
                          <td className="l-td l-td--actions" onClick={e => e.stopPropagation()}>
                            <div className="l-menu-wrap">
                              <button
                                className="l-dots-btn"
                                onClick={() => setOpenMenu(openMenu === lead.id ? null : lead.id)}
                              >
                                <DotsIcon />
                              </button>
                              {openMenu === lead.id && (
                                <div className="l-menu">
                                  <div className="l-menu__topline" />
                                  <button className="l-menu__item l-menu__item--convert" onClick={() => handleConvert(lead)}>
                                    Convert to Client
                                  </button>
                                  <button className="l-menu__item l-menu__item--danger" onClick={() => handleDelete(lead)}>
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

            {/* ── Footer count ── */}
            {!loading && filtered.length > 0 && (
              <div className="l-panel__foot">
                <span className="l-panel__count">
                  Showing {filtered.length} of {leads.length} leads
                </span>
              </div>
            )}
          </motion.div>

          {fetchError && (
            <div style={{ textAlign: 'center', padding: '16px', color: 'rgba(200,100,100,0.8)', fontSize: 13 }}>
              {fetchError}
            </div>
          )}

          {/* Footer — mirrors dashboard */}
          <motion.p
            className="leads__footer"
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

// ─── Row variant helper ───────────────────────────────────────────────────────

function rowVariants(i) {
  return {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1, x: 0,
      transition: { delay: 0.4 + i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
  };
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@300;400&display=swap');

/* ── Tokens — shared with dashboard ── */
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

/* ── Shell — identical to .dash ── */
.leads {
  min-height: calc(100vh - var(--nav-h));
  background: var(--bg);
  padding: clamp(24px, 3.5vw, 44px);
  font-family: 'DM Sans', sans-serif;
  /* ── Mobile padding ── */
  @media (max-width: 768px) {
    .leads {
      padding: 16px;
      padding-bottom: 80px; /* Space for bottom nav */
    }
  }

/* Ambient orbs */
.leads__orb {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  filter: blur(90px);
}
.leads__orb--1 {
  top: -180px; right: -180px;
  width: 560px; height: 560px;
  background: radial-gradient(circle, rgba(184,150,90,0.07) 0%, transparent 70%);
}
.leads__orb--2 {
  bottom: -200px; left: -160px;
  width: 480px; height: 480px;
  background: radial-gradient(circle, rgba(100,80,180,0.055) 0%, transparent 70%);
}
.leads__grid-overlay {
  position: fixed; inset: 0; pointer-events: none; opacity: 0.012; z-index: 0;
  background-image:
    linear-gradient(rgba(184,150,90,1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(184,150,90,1) 1px, transparent 1px);
  background-size: 64px 64px;
}

/* ── Inner ── */
.leads__inner {
  position: relative; z-index: 1;
  max-width: 1380px; margin: 0 auto;
}

/* ── Header — mirrors dashboard header exactly ── */
.leads__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 28px;
}
.leads__header-left { flex: 1; min-width: 220px; }
.leads__eyebrow {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--gold);
  display: block;
  margin-bottom: 10px;
}
.leads__title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 300;
  color: var(--text-0);
  margin: 0 0 6px;
  line-height: 1.1;
  letter-spacing: -0.01em;
}
.leads__subtitle {
  font-size: 13px;
  font-weight: 300;
  color: var(--text-2);
  margin: 0;
  letter-spacing: 0.01em;
}
.leads__rule {
  width: 36px; height: 1px;
  background: linear-gradient(90deg, var(--gold), transparent);
  margin-top: 16px;
}
.leads__header-actions {
  display: flex; align-items: center; gap: 10px; flex-shrink: 0;
}

/* ── Buttons — mirrors .quick-action exactly ── */
.l-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 18px; border-radius: var(--radius);
  font-family: 'DM Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background var(--t), border-color var(--t), color var(--t), box-shadow var(--t), transform var(--t);
}
.l-btn--ghost {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text-2);
}
.l-btn--ghost:hover {
  background: var(--surface-hover);
  border-color: rgba(255,255,255,0.14);
  color: var(--text-1);
}
.l-btn--primary {
  background: linear-gradient(135deg, var(--gold), #d4af74);
  border: none;
  color: #09090e;
  font-weight: 600;
}
.l-btn--primary:hover {
  opacity: 0.88;
  box-shadow: 0 0 18px var(--gold-glow);
  transform: translateY(-1px);
}
.l-btn--primary:active { transform: translateY(0); }

/* ── Skeleton shimmer ── */
@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
}
.l-skeleton {
  display: block;
  background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 75%);
  background-size: 800px 100%;
  animation: shimmer 1.6s infinite;
  border-radius: 3px;
}

/* ── Stat strip — mirrors stat-card ── */
.leads-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 14px;
}
@media (max-width: 900px)  { .leads-stats { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 500px)  { .leads-stats { grid-template-columns: 1fr; } }

.l-stat {
  position: relative;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 22px 24px 18px;
  backdrop-filter: blur(16px);
  box-shadow: 0 6px 28px rgba(0,0,0,0.22);
  overflow: hidden;
}
.l-stat__topline {
  position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(184,150,90,0.55), transparent);
  opacity: 0.45;
}
.l-stat__corner {
  position: absolute; top: -1px; right: -1px;
  width: 14px; height: 14px;
  border-top: 1px solid rgba(184,150,90,0.28);
  border-right: 1px solid rgba(184,150,90,0.28);
  pointer-events: none;
}
.l-stat__value {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(28px, 3vw, 38px);
  font-weight: 300;
  color: var(--text-0);
  line-height: 1;
  letter-spacing: -0.02em;
  display: block;
  margin-bottom: 8px;
  min-height: 38px;
}
.l-stat__label {
  font-family: 'DM Mono', monospace;
  font-size: 9.5px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-2);
  display: block;
}

/* ── Table panel — mirrors .panel ── */
.l-panel {
  position: relative;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  backdrop-filter: blur(16px);
  box-shadow: 0 6px 28px rgba(0,0,0,0.22);
  overflow: hidden;
}
.l-panel__topline {
  position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(184,150,90,0.45), transparent);
  pointer-events: none;
}
.l-panel__corner {
  position: absolute; top: -1px; right: -1px;
  width: 16px; height: 16px;
  border-top: 1px solid rgba(184,150,90,0.32);
  border-right: 1px solid rgba(184,150,90,0.32);
  pointer-events: none;
}

/* ── Toolbar ── */
.l-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 22px 16px;
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
}
.l-toolbar__right {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
  flex-wrap: wrap;
}

/* Search */
.l-search {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0 12px;
  width: 240px;
  transition: border-color var(--t);
}
.l-search:focus-within { border-color: var(--border-gold); }
.l-search__icon { color: var(--text-3); flex-shrink: 0; }
.l-search__input {
  background: none;
  border: none;
  outline: none;
  font-family: 'DM Sans', sans-serif;
  font-size: 12.5px;
  font-weight: 300;
  color: var(--text-1);
  padding: 9px 0;
  width: 100%;
}
.l-search__input::placeholder { color: var(--text-3); }

/* Filter pills */
.l-filters {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-3);
}
.l-filter-pill {
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 5px 10px;
  border-radius: 2px;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-3);
  cursor: pointer;
  transition: background var(--t), border-color var(--t), color var(--t);
  white-space: nowrap;
}
.l-filter-pill:hover { color: var(--text-1); border-color: rgba(255,255,255,0.14); }
.l-filter-pill--active { color: var(--text-0); border-color: rgba(255,255,255,0.18); }

/* Sort */
.l-sort {
  display: flex;
  align-items: center;
  gap: 8px;
}
.l-sort__label {
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-3);
  flex-shrink: 0;
}
.l-sort__options {
  display: flex;
  gap: 4px;
}
.l-sort__btn {
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 5px 9px;
  border-radius: 2px;
  background: transparent;
  border: 1px solid transparent;
  color: var(--text-3);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: color var(--t), border-color var(--t), background var(--t);
}
.l-sort__btn:hover { color: var(--text-1); }
.l-sort__btn--active {
  color: var(--gold);
  border-color: var(--border-gold);
  background: var(--gold-soft);
}

/* ── Responsive Toolbar ── */
@media (max-width: 700px) {
  .l-toolbar, .l-toolbar__right {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    margin: 0;
  }
  .l-search { width: 100%; box-sizing: border-box; }
  .l-filters, .l-sort {
    width: 100%;
    justify-content: space-between;
    overflow-x: auto;
    padding-bottom: 4px;
    margin-top: 10px;
  }
}

/* ── Table ── */
.l-table-wrap {
  overflow-x: auto;
}
.l-table {
  width: 100%;
  border-collapse: collapse;
}
.l-th {
  font-family: 'DM Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-2);
  font-weight: 400;
  text-align: left;
  padding: 12px 20px;
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}
.l-th--num   { text-align: right; }
.l-th--actions { width: 40px; }

.l-tr {
  border-bottom: 1px solid rgba(255,255,255,0.04);
  cursor: pointer;
  transition: background var(--t);
}
.l-tr:last-child { border-bottom: none; }
.l-tr:hover { background: var(--surface-hover); }

.l-td {
  padding: 15px 20px;
  vertical-align: middle;
}
.l-td--num     { text-align: right; }
.l-td--actions { text-align: right; }

/* Lead cell */
.l-lead-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}
.l-avatar {
  width: 32px;
  height: 32px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Cormorant Garamond', serif;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}
.l-lead-name {
  font-size: 14px;
  font-weight: 400;
  color: var(--text-0);
  margin-bottom: 2px;
}
.l-lead-company {
  font-size: 12.5px;
  font-weight: 300;
  color: var(--text-2);
  margin-bottom: 1px;
}
.l-lead-email {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  color: var(--text-3);
  letter-spacing: 0.02em;
}

/* Badge */
.l-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 9px;
  border-radius: 2px;
  font-family: 'DM Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  white-space: nowrap;
}
.l-badge__dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Other cells */
.l-source {
  font-size: 13.5px;
  font-weight: 300;
  color: var(--text-2);
}
.l-value {
  font-family: 'DM Mono', monospace;
  font-size: 13px;
  color: var(--text-1);
  letter-spacing: 0.04em;
}
.l-assigned {
  font-size: 13.5px;
  font-weight: 300;
  color: var(--text-2);
}
.l-date {
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  color: var(--text-3);
  letter-spacing: 0.04em;
  white-space: nowrap;
}

/* Context menu */
.l-menu-wrap { position: relative; display: inline-block; }
.l-dots-btn {
  background: none;
  border: none;
  color: var(--text-3);
  cursor: pointer;
  padding: 4px 6px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  transition: color var(--t), background var(--t);
}
.l-dots-btn:hover {
  color: var(--text-1);
  background: var(--surface-hover);
}
.l-menu {
  position: absolute;
  right: 0; top: calc(100% + 6px);
  min-width: 140px;
  background: #13131a;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  z-index: 50;
  box-shadow: 0 12px 36px rgba(0,0,0,0.5);
}
.l-menu__topline {
  position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(184,150,90,0.45), transparent);
}
.l-menu__item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 11px 16px;
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-2);
  background: none;
  border: none;
  cursor: pointer;
  transition: background var(--t), color var(--t);
}
.l-menu__item:hover { background: var(--surface-hover); color: var(--text-0); }
.l-menu__item--danger { color: rgba(200,100,100,0.7); }
.l-menu__item--danger:hover { color: rgba(220,110,110,1); background: rgba(200,80,80,0.08); }
.l-menu__item--convert { color: rgba(184,150,90,0.8); }
.l-menu__item--convert:hover { color: var(--gold); background: rgba(184,150,90,0.08); }

/* Panel footer */
.l-panel__foot {
  padding: 14px 22px;
  border-top: 1px solid rgba(255,255,255,0.04);
}
.l-panel__count {
  font-family: 'DM Mono', monospace;
  font-size: 9.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-3);
}

/* Empty state */
.l-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 52px 0;
  gap: 12px;
}
.l-empty__icon {
  width: 44px; height: 44px;
  background: var(--surface-hover);
  border: 1px solid var(--border);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-3);
}
.l-empty p {
  font-size: 12px;
  color: var(--text-3);
  font-weight: 300;
  margin: 0;
}

/* Footer */
.leads__footer {
  text-align: center;
  margin-top: 44px;
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--text-3);
  user-select: none;
}

/* Responsive */
@media (max-width: 700px) {
  .l-toolbar { flex-direction: column; align-items: stretch; }
  .l-toolbar__right { margin-left: 0; }
  .l-search { width: 100%; }
}

/* ── Add Lead Modal ── */
.lm-overlay {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(0,0,0,0.65);
  backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
}
.lm-panel {
  position: relative;
  background: #0f0f16;
  border: 1px solid rgba(184,150,90,0.22);
  border-radius: var(--radius);
  width: 100%; max-width: 580px;
  box-shadow: 0 24px 80px rgba(0,0,0,0.7);
  overflow: hidden;
}
.lm-topline {
  position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(184,150,90,0.6), transparent);
}
.lm-corner {
  position: absolute; top: -1px; right: -1px;
  width: 18px; height: 18px;
  border-top: 1px solid rgba(184,150,90,0.45);
  border-right: 1px solid rgba(184,150,90,0.45);
  pointer-events: none;
}
.lm-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.lm-eyebrow {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px; font-weight: 300;
  color: var(--text-0); letter-spacing: -0.01em;
}
.lm-close {
  background: none; border: none; color: var(--text-3);
  font-size: 16px; cursor: pointer; padding: 4px 8px;
  border-radius: var(--radius);
  transition: color var(--t), background var(--t);
}
.lm-close:hover { color: var(--text-0); background: rgba(255,255,255,0.06); }
.lm-error {
  margin: 12px 24px 0;
  padding: 10px 14px;
  background: rgba(200,80,80,0.1);
  border: 1px solid rgba(200,80,80,0.25);
  border-radius: var(--radius);
  font-size: 13px; color: rgba(220,110,110,0.9);
}
.lm-form { padding: 20px 24px 24px; }
.lm-row {
  display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
  margin-bottom: 14px;
}
@media (max-width: 500px) { .lm-row { grid-template-columns: 1fr; } }
.lm-field { display: flex; flex-direction: column; gap: 6px; }
.lm-label {
  font-family: 'DM Mono', monospace;
  font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--text-2);
}
.lm-input {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: var(--radius);
  padding: 9px 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13.5px; font-weight: 300;
  color: var(--text-0);
  outline: none;
  transition: border-color var(--t), background var(--t);
  width: 100%; box-sizing: border-box;
}
.lm-input::placeholder { color: var(--text-3); }
.lm-input:focus {
  border-color: rgba(184,150,90,0.5);
  background: rgba(255,255,255,0.06);
}
.lm-select { cursor: pointer; appearance: none; }
.lm-actions {
  display: flex; justify-content: flex-end; gap: 10px;
  margin-top: 20px; padding-top: 16px;
  border-top: 1px solid rgba(255,255,255,0.06);
}
.lm-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 20px; border-radius: var(--radius);
  font-family: 'DM Mono', monospace; font-size: 10.5px;
  letter-spacing: 0.14em; text-transform: uppercase;
  cursor: pointer;
  transition: background var(--t), border-color var(--t), color var(--t), opacity var(--t);
}
.lm-btn--ghost {
  background: var(--surface); border: 1px solid var(--border); color: var(--text-2);
}
.lm-btn--ghost:hover { background: var(--surface-hover); color: var(--text-1); }
.lm-btn--primary {
  background: linear-gradient(135deg, var(--gold), #d4af74);
  border: none; color: #09090e; font-weight: 600;
}
.lm-btn--primary:hover { opacity: 0.88; }
.lm-btn--primary:disabled { opacity: 0.5; cursor: not-allowed; }
`;
