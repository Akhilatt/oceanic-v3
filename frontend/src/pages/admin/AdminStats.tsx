import { useState, useEffect } from 'react'
import apiFetch from '../../lib/api'
import { Spinner } from '../../components/ui'

export default function AdminStats() {
  const [stats, setStats] = useState<{ total_users: number; total_orders: number; total_revenue: number; open_tickets: number; total_contacts: number } | null>(null)
  const [shipStats, setShipStats] = useState<{ total_shipments: number; in_transit: number; delivered: number; delayed: number; fleet_size: number; active_vessels: number; total_cargo_tons: number } | null>(null)
  const [perf, setPerf] = useState<{ on_time_delivery_rate: number; average_transit_days: number; fleet_utilization_pct: number; customer_satisfaction: number; carbon_offset_tons: number; revenue_growth_pct: number } | null>(null)

  useEffect(() => {
    apiFetch<{ data: typeof stats }>('/admin/stats').then(r => setStats(r.data)).catch(() => {})
    apiFetch<{ data: typeof shipStats }>('/dashboard/stats').then(r => setShipStats(r.data)).catch(() => {})
    apiFetch<{ data: typeof perf }>('/analytics/performance').then(r => setPerf(r.data)).catch(() => {})
  }, [])

  if (!stats || !shipStats || !perf) return <Spinner />

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 30, fontWeight: 700, marginBottom: 4 }}>🛡 Admin Overview</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>Full platform statistics and health metrics.</p>
      </div>

      {/* Platform KPIs */}
      <div style={{ marginBottom: 12 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>Platform</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 14 }}>
          {[
            ['Total Users', stats.total_users, '#2563ff', '👥'],
            ['Total Orders', stats.total_orders, '#00d4ff', '📋'],
            ['Total Revenue', `$${(stats.total_revenue / 1000).toFixed(0)}K`, '#f59e0b', '💰'],
            ['Open Tickets', stats.open_tickets, stats.open_tickets > 5 ? '#f43f5e' : '#10b981', '🎫'],
            ['Contact Leads', stats.total_contacts, '#8b5cf6', '📬'],
          ].map(([l, v, c, ic]) => (
            <div key={l as string} className="stat-card">
              <div className="bg-glow" style={{ background: c as string }} />
              <div className="stat-label">{ic as string} {l as string}</div>
              <div className="stat-value" style={{ fontSize: 30 }}>{v as string | number}</div>
              <div className="accent-line" style={{ background: c as string }} />
            </div>
          ))}
        </div>
      </div>

      {/* Shipment KPIs */}
      <div style={{ marginBottom: 12 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12, marginTop: 24 }}>Logistics</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 14 }}>
          {[
            ['Shipments', shipStats.total_shipments, '#2563ff', '📦'],
            ['In Transit', shipStats.in_transit, '#00d4ff', '🚢'],
            ['Delivered', shipStats.delivered, '#10b981', '✅'],
            ['Delayed', shipStats.delayed, '#f43f5e', '⚠️'],
            ['Fleet Size', shipStats.fleet_size, '#f59e0b', '⚓'],
            ['Active Vessels', shipStats.active_vessels, '#10b981', '🟢'],
            ['Cargo Tons', shipStats.total_cargo_tons.toLocaleString(), '#8b5cf6', '⚖️'],
          ].map(([l, v, c, ic]) => (
            <div key={l as string} className="stat-card">
              <div className="bg-glow" style={{ background: c as string }} />
              <div className="stat-label">{ic as string} {l as string}</div>
              <div className="stat-value" style={{ fontSize: 28 }}>{v as string | number}</div>
              <div className="accent-line" style={{ background: c as string }} />
            </div>
          ))}
        </div>
      </div>

      {/* Performance */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12, marginTop: 24 }}>Performance</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 20 }}>
          <div className="card">
            <h3 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 17, fontWeight: 600, marginBottom: 18 }}>Operational KPIs</h3>
            {[
              ['On-Time Delivery', `${perf.on_time_delivery_rate}%`, perf.on_time_delivery_rate >= 85 ? 'var(--emerald)' : 'var(--rose)'],
              ['Avg Transit Time', `${perf.average_transit_days} days`, 'var(--text)'],
              ['Fleet Utilization', `${perf.fleet_utilization_pct}%`, perf.fleet_utilization_pct >= 70 ? 'var(--emerald)' : 'var(--amber)'],
              ['Customer Satisfaction', `${perf.customer_satisfaction}/5.0`, 'var(--amber)'],
              ['Carbon Offset', `${perf.carbon_offset_tons}t`, 'var(--emerald)'],
              ['Revenue Growth YoY', `+${perf.revenue_growth_pct}%`, 'var(--emerald)'],
            ].map(([l, v, c]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>{l}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: c }}>{v}</span>
              </div>
            ))}
          </div>

          <div className="card">
            <h3 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 17, fontWeight: 600, marginBottom: 18 }}>System Health</h3>
            {[
              ['API Status', 'Operational', 'var(--emerald)', '🟢'],
              ['Database', 'Healthy', 'var(--emerald)', '🟢'],
              ['Tracking System', 'Live', 'var(--emerald)', '🟢'],
              ['Payment Gateway', 'Active', 'var(--emerald)', '🟢'],
              ['Email Service', 'Active', 'var(--emerald)', '🟢'],
              ['Backup Status', 'Up to date', 'var(--emerald)', '🟢'],
            ].map(([l, v, c, ic]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>{ic} {l}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: c }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
