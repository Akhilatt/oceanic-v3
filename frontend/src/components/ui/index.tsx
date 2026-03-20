import { useEffect } from 'react'
import type { ShipStatus, VesselStatus, Priority, TicketStatus } from '../../types'
import type { Toast } from '../../hooks/useToast'

/* ── STATUS BADGE ─────────────────────────────────────────────────────────── */
type AnyStatus = ShipStatus | VesselStatus | Priority | TicketStatus | string
export function Badge({ status }: { status: AnyStatus }) {
  const map: Record<string, string> = {
    'In Transit': 'badge badge-transit', Delivered: 'badge badge-delivered', Delayed: 'badge badge-delayed',
    Active: 'badge badge-active', 'In Port': 'badge badge-port', Maintenance: 'badge badge-delayed',
    Open: 'badge badge-open', Resolved: 'badge badge-resolved',
    High: 'badge badge-high', Normal: 'badge badge-normal', Low: 'badge badge-low',
    Paid: 'badge badge-delivered', Unpaid: 'badge badge-delayed', Pending: 'badge badge-pending',
    Cancelled: 'badge badge-delayed',
  }
  const dots: Record<string, string> = {
    'In Transit': '#60a5fa', Delivered: '#34d399', Delayed: '#fb7185',
    Active: '#34d399', 'In Port': '#fcd34d', Open: '#60a5fa', Resolved: '#34d399',
    High: '#fb7185', Normal: '#60a5fa', Low: '#6b82b0', Paid: '#34d399', Unpaid: '#fb7185',
  }
  return (
    <span className={map[status] ?? 'badge badge-normal'}>
      {dots[status] && <span style={{ width: 5, height: 5, borderRadius: '50%', background: dots[status], display: 'inline-block', flexShrink: 0 }} />}
      {status}
    </span>
  )
}

/* ── PROGRESS BAR ─────────────────────────────────────────────────────────── */
export function Progress({ value, size = 'md' }: { value: number; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <div className={`progress progress-${size}`}>
      <div className="progress-bar" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  )
}

/* ── SPINNER ──────────────────────────────────────────────────────────────── */
export function Spinner({ center = true }: { center?: boolean }) {
  return <div className="spinner" style={center ? {} : { margin: 0 }} />
}

/* ── EMPTY STATE ──────────────────────────────────────────────────────────── */
export function Empty({ icon, title, desc, action }: { icon: string; title: string; desc?: string; action?: React.ReactNode }) {
  return (
    <div className="empty">
      <div className="empty-icon">{icon}</div>
      <div className="empty-title">{title}</div>
      {desc && <div className="empty-desc">{desc}</div>}
      {action && <div style={{ marginTop: 20 }}>{action}</div>}
    </div>
  )
}

/* ── TOAST ────────────────────────────────────────────────────────────────── */
export function ToastBar({ toast, onDone }: { toast: Toast; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t) }, [])
  const icons: Record<string, string> = { success: '✓', error: '✕', info: 'i' }
  const colors: Record<string, string> = { success: 'var(--emerald)', error: 'var(--rose)', info: 'var(--cyan)' }
  return (
    <div className={`toast ${toast.type}`}>
      <span style={{ width: 22, height: 22, borderRadius: '50%', background: colors[toast.type], color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icons[toast.type]}
      </span>
      {toast.msg}
    </div>
  )
}

/* ── ALERT ────────────────────────────────────────────────────────────────── */
export function Alert({ type, msg }: { type: 'error' | 'success' | 'info' | 'warn'; msg: string }) {
  return <div className={`alert alert-${type}`}>{msg}</div>
}

/* ── TABS ─────────────────────────────────────────────────────────────────── */
export function Tabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div className="tabs">
      {tabs.map(t => (
        <button key={t} className={`tab ${active === t ? 'active' : ''}`} onClick={() => onChange(t)}>{t}</button>
      ))}
    </div>
  )
}

/* ── FORM COMPONENTS ──────────────────────────────────────────────────────── */
export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {children}
    </div>
  )
}

export function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Field label={label}>
      <input className="form-input" {...props} />
    </Field>
  )
}

export function Textarea({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Field label={label}>
      <textarea className="form-input" {...props} />
    </Field>
  )
}

export function Select({ label, children, ...props }: { label: string } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Field label={label}>
      <select className="form-input form-select" {...props}>{children}</select>
    </Field>
  )
}

/* ── DATA ROW ─────────────────────────────────────────────────────────────── */
export function DataRow({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="data-row">
      <span className="data-row-label">{label}</span>
      <span className="data-row-value" style={mono ? { fontFamily: 'JetBrains Mono, monospace', fontSize: 12 } : {}}>{value}</span>
    </div>
  )
}

/* ── SECTION HEADER ───────────────────────────────────────────────────────── */
export function SectionHeader({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
      <div>
        <h2 className="section-title">{title}</h2>
        {sub && <p className="section-sub">{sub}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

/* ── STAT CARD ────────────────────────────────────────────────────────────── */
export function StatCard({ label, value, sub, color, icon }: { label: string; value: string | number; sub?: string; color: string; icon: string }) {
  return (
    <div className="stat-card animate-in">
      <div className="bg-glow" style={{ background: color }} />
      <div className="stat-label">{icon} {label}</div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
      <div className="accent-line" style={{ background: `linear-gradient(90deg,${color},transparent)` }} />
    </div>
  )
}

/* ── SHIP CARD ────────────────────────────────────────────────────────────── */
export function ShipCard({ s, onClick }: { s: import('../../types').Shipment; onClick?: () => void }) {
  return (
    <div className="card card-hover" style={{ padding: 0, overflow: 'hidden', cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
      <div style={{ position: 'relative' }}>
        <img src={s.image} alt={s.id} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: 10, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span style={{ background: 'rgba(6,13,26,.8)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: 99, fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: 'var(--cyan)', border: '1px solid rgba(0,212,255,.2)' }}>{s.id}</span>
          <Badge status={s.status} />
        </div>
      </div>
      <div style={{ padding: '14px 16px' }}>
        <p style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{s.route}</p>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 2 }}>📦 {s.cargo} · {s.weight_tons.toLocaleString()}t</p>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>🚢 {s.vessel}</p>
        <Progress value={s.progress} size="sm" />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--dim)', marginTop: 5 }}>
          <span>{s.progress}% complete</span><span>ETA: {s.eta}</span>
        </div>
      </div>
    </div>
  )
}

/* ── VESSEL CARD ──────────────────────────────────────────────────────────── */
export function VesselCard({ v }: { v: import('../../types').Vessel }) {
  return (
    <div className="card card-hover" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ position: 'relative' }}>
        <img src={v.image} alt={v.name} style={{ width: '100%', height: 170, objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: 10, right: 12 }}><Badge status={v.status} /></div>
        <div style={{ position: 'absolute', bottom: 10, left: 12, fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'var(--cyan)', background: 'rgba(6,13,26,.8)', padding: '3px 8px', borderRadius: 6, border: '1px solid rgba(0,212,255,.2)' }}>{v.id}</div>
      </div>
      <div style={{ padding: '14px 16px' }}>
        <p style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 15, fontWeight: 600, marginBottom: 10 }}>{v.name}</p>
        {[['Type', v.type], ['Route', v.route], ['Capacity', `${v.capacity_teu.toLocaleString()} TEU`], ['Flag 🚩', v.flag], ['Built', String(v.year_built)], ['Speed', `${v.speed_knots} kn`]].map(([l, val]) => (
          <div key={l} style={{ display: 'flex', gap: 8, marginBottom: 4, fontSize: 12 }}>
            <span style={{ color: 'var(--muted)', width: 68, flexShrink: 0 }}>{l}</span>
            <span>{val}</span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 10 }}>
          {'★'.repeat(Math.round(v.rating)).split('').map((s, i) => (
            <span key={i} style={{ color: 'var(--amber)', fontSize: 13 }}>{s}</span>
          ))}
          <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 4 }}>{v.rating}</span>
        </div>
      </div>
    </div>
  )
}
