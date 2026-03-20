import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import apiFetch from '../../lib/api'
import type { Vessel, CrewMember, VesselLog } from '../../types'
import { Badge, Spinner, DataRow, Tabs } from '../../components/ui'

export default function VesselDetail() {
  const { id } = useParams(); const nav = useNavigate()
  const [v, setV] = useState<Vessel | null>(null)
  const [crew, setCrew] = useState<CrewMember[]>([])
  const [logs, setLogs] = useState<VesselLog[]>([])
  const [tab, setTab] = useState('Overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    Promise.all([
      apiFetch<{ data: Vessel }>(`/fleet/${id}`).then(r => setV(r.data)),
      apiFetch<{ data: CrewMember[] }>(`/fleet/${id}/crew`).then(r => setCrew(r.data ?? [])),
      apiFetch<{ data: VesselLog[] }>(`/fleet/${id}/logs`).then(r => setLogs(r.data ?? [])),
    ]).finally(() => setLoading(false))
  }, [id])

  if (loading) return <Spinner />
  if (!v) return <div className="empty"><div className="empty-title">Vessel not found</div></div>

  return (
    <div>
      <button className="btn btn-ghost btn-sm" onClick={() => nav(-1)} style={{ marginBottom: 20 }}>← Back to Fleet</button>

      {/* Hero */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ position: 'relative' }}>
          <img src={v.image} alt={v.name} style={{ width: '100%', height: 240, objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,13,26,.9) 0%, transparent 50%)' }} />
          <div style={{ position: 'absolute', bottom: 24, left: 28, right: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: 'var(--cyan)', marginBottom: 4 }}>{v.id}</div>
                <h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 28, fontWeight: 700 }}>{v.name}</h1>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,.7)', marginTop: 4 }}>{v.type} · Flag: {v.flag}</p>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ display: 'flex' }}>{'★'.repeat(Math.round(v.rating)).split('').map((_, i) => <span key={i} style={{ color: 'var(--amber)', fontSize: 18 }}>★</span>)}</div>
                <Badge status={v.status} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <Tabs tabs={['Overview', 'Crew', 'Voyage Logs']} active={tab} onChange={setTab} />
      </div>

      {tab === 'Overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>
          <div className="card">
            <h3 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Vessel Specs</h3>
            <DataRow label="Type" value={v.type} />
            <DataRow label="Capacity" value={`${v.capacity_teu.toLocaleString()} TEU`} />
            <DataRow label="Speed" value={`${v.speed_knots} knots`} />
            <DataRow label="Fuel Type" value={v.fuel_type} />
            <DataRow label="Year Built" value={String(v.year_built)} />
            <DataRow label="Flag State" value={v.flag} />
            <DataRow label="Crew Size" value={`${v.crew_count} members`} />
            <DataRow label="Rating" value={`${v.rating}/5.0`} />
          </div>
          <div className="card">
            <h3 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Current Operation</h3>
            <DataRow label="Status" value={<Badge status={v.status} />} />
            <DataRow label="Route" value={v.route} />
            <DataRow label="Next Port" value={v.next_port} />
            <DataRow label="Maintenance Due" value={new Date(v.maintenance_due).toLocaleDateString()} />
          </div>
        </div>
      )}

      {tab === 'Crew' && (
        <div className="card">
          <h3 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Crew Manifest</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 14 }}>
            {crew.map((c, i) => (
              <div key={i} className="card-sm" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg,var(--accent),var(--cyan))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                  {c.name[0]}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--cyan)', marginBottom: 2 }}>{c.role}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{c.nationality} · {c.experience_years}yr exp</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'Voyage Logs' && (
        <div className="card">
          <h3 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Voyage Logs</h3>
          {logs.map((l, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: 'var(--cyan)', flexShrink: 0, paddingTop: 2 }}>{l.date}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{l.event}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>📍 {l.position}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
