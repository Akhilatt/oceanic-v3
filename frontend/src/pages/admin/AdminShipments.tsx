// AdminShipments.tsx
import { useState, useEffect } from 'react'
import apiFetch from '../../lib/api'
import type { Shipment } from '../../types'
import { Badge, Progress, Spinner } from '../../components/ui'

export default function AdminShipments({ show }: { show: (m: string, t?: 'success'|'error'|'info') => void }) {
  const [data, setData] = useState<Shipment[]>([]), [loading, setLoading] = useState(true)
  useEffect(() => { apiFetch<{ data: Shipment[] }>('/shipments?limit=50').then(r => setData(r.data ?? [])).finally(() => setLoading(false)) }, [])

  async function updateStatus(id: string, status: string) {
    await apiFetch(`/shipments/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) })
    setData(d => d.map(s => s.id === id ? { ...s, status: status as Shipment['status'] } : s))
    show(`${id} updated to ${status}`, 'success')
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}><h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 30, fontWeight: 700, marginBottom: 4 }}>📦 All Shipments</h1><p style={{ color: 'var(--muted)', fontSize: 14 }}>Admin view — manage all shipments.</p></div>
      {loading ? <Spinner /> : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead><tr>{['ID', 'Route', 'Vessel', 'Status', 'Progress', 'Priority', 'Cost', 'Actions'].map(h => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {data.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: 'var(--cyan)' }}>{s.id}</td>
                    <td style={{ fontSize: 12 }}>{s.route}</td>
                    <td style={{ fontSize: 12, color: 'var(--muted)' }}>{s.vessel}</td>
                    <td><Badge status={s.status} /></td>
                    <td style={{ width: 100 }}><Progress value={s.progress} size="sm" /><span style={{ fontSize: 10, color: 'var(--dim)' }}>{s.progress}%</span></td>
                    <td><Badge status={s.priority} /></td>
                    <td style={{ fontSize: 12, fontWeight: 600 }}>${s.cost_usd.toLocaleString()}</td>
                    <td>
                      <select style={{ background: 'var(--navy)', border: '1px solid var(--border)', color: 'var(--text)', padding: '4px 8px', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}
                        value={s.status} onChange={e => updateStatus(s.id, e.target.value)}>
                        {['In Transit', 'Delivered', 'Delayed'].map(st => <option key={st}>{st}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
