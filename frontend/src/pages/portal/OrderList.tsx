// OrderList.tsx
import { useState, useEffect } from 'react'
import apiFetch from '../../lib/api'
import type { Order } from '../../types'
import { Badge, Spinner, Empty } from '../../components/ui'

export default function OrderList() {
  const [data, setData] = useState<Order[]>([]), [loading, setLoading] = useState(true)
  useEffect(() => { apiFetch<{ data: Order[] }>('/orders').then(r => setData(r.data ?? [])).finally(() => setLoading(false)) }, [])
  return (
    <div>
      <div style={{ marginBottom: 24 }}><h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 30, fontWeight: 700, marginBottom: 4 }}>Order History</h1><p style={{ color: 'var(--muted)', fontSize: 14 }}>All your submitted shipping orders.</p></div>
      {loading && <Spinner />}
      {!loading && data.length === 0 && <Empty icon="📋" title="No orders yet" desc="Place your first shipping order." action={<a href="/orders" className="btn btn-primary">Create Order</a>} />}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr>{['Order ID', 'Route', 'Cargo', 'Weight', 'Containers', 'Priority', 'Status', 'Cost', 'Date'].map(h => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {data.map(o => (
                <tr key={o.id}>
                  <td style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: 'var(--cyan)' }}>{o.id}</td>
                  <td style={{ fontSize: 12 }}>{o.from_port} → {o.to_port}</td>
                  <td style={{ fontSize: 12 }}>{o.cargo}</td>
                  <td style={{ fontSize: 12 }}>{o.weight_tons}t</td>
                  <td style={{ fontSize: 12 }}>{o.container_count}</td>
                  <td><Badge status={o.priority} /></td>
                  <td><Badge status={o.status} /></td>
                  <td style={{ fontSize: 12, fontWeight: 600 }}>${o.estimated_cost_usd.toLocaleString()}</td>
                  <td style={{ fontSize: 11, color: 'var(--muted)' }}>{new Date(o.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
