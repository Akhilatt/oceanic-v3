import { useState, useEffect } from 'react'
import apiFetch from '../../lib/api'
import type { AnalyticsOverview, AnalyticsPerformance } from '../../types'
import { StatCard, Spinner, Progress } from '../../components/ui'

export default function Analytics() {
  const [ov, setOv] = useState<AnalyticsOverview | null>(null)
  const [perf, setPerf] = useState<AnalyticsPerformance | null>(null)

  useEffect(() => {
    apiFetch<{ data: AnalyticsOverview }>('/analytics/overview').then(r => setOv(r.data)).catch(() => {})
    apiFetch<{ data: AnalyticsPerformance }>('/analytics/performance').then(r => setPerf(r.data)).catch(() => {})
  }, [])

  if (!ov || !perf) return <Spinner />
  const maxBar = Math.max(...ov.weekly_throughput.map(d => d.value))
  const maxRev = Math.max(...ov.monthly_revenue.map(d => d.value))

  return (
    <div>
      <div style={{ marginBottom: 24 }}><h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 30, fontWeight: 700, marginBottom: 4 }}>Analytics</h1><p style={{ color: 'var(--muted)', fontSize: 14 }}>Performance insights across shipments, routes, and fleet.</p></div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 16, marginBottom: 24 }}>
        {[
          ['On-Time Rate', `${perf.on_time_delivery_rate}%`, '#10b981', '✅', 'Delivery performance'],
          ['Avg Transit', `${perf.average_transit_days}d`, '#2563ff', '⏱', 'Days per voyage'],
          ['Fleet Util.', `${perf.fleet_utilization_pct}%`, '#f59e0b', '⚓', 'Active utilization'],
          ['Satisfaction', `${perf.customer_satisfaction}★`, '#f43f5e', '😊', 'Client score out of 5'],
          ['CO₂ Offset', `${perf.carbon_offset_tons}t`, '#10b981', '🌿', 'Carbon program'],
          ['Revenue Growth', `+${perf.revenue_growth_pct}%`, '#8b5cf6', '📈', 'Year over year'],
        ].map(([l, v, c, ic, sub]) => <StatCard key={l as string} label={l as string} value={v as string} color={c as string} icon={ic as string} sub={sub as string} />)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 20, marginBottom: 20 }}>
        {/* Weekly Bar Chart */}
        <div className="card">
          <h3 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 18, fontWeight: 600, marginBottom: 24 }}>Weekly Throughput</h3>
          <div className="bar-chart" style={{ height: 180 }}>
            {ov.weekly_throughput.map(d => (
              <div key={d.day} className="bar-col">
                <span className="bar-val">{d.value}</span>
                <div className="bar-fill" style={{ height: `${(d.value / maxBar) * 150}px` }} />
                <span className="bar-lbl">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="card">
          <h3 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 18, fontWeight: 600, marginBottom: 24 }}>Monthly Revenue ($M)</h3>
          <div className="bar-chart" style={{ height: 180 }}>
            {ov.monthly_revenue.map(d => (
              <div key={d.month} className="bar-col">
                <span className="bar-val">{d.value}</span>
                <div className="bar-fill" style={{ height: `${(d.value / maxRev) * 150}px`, background: 'linear-gradient(180deg,var(--amber),#b45309)' }} />
                <span className="bar-lbl">{d.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 20 }}>
        {/* Trade Lanes */}
        <div className="card">
          <h3 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Trade Lane Reliability</h3>
          {ov.trade_lanes.map(l => (
            <div key={l.lane} style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                <span>{l.lane}</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>{l.on_time_pct}%</span>
              </div>
              <Progress value={l.on_time_pct} size="md" />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--dim)', marginTop: 4 }}>
                <span>{l.delay_pct}% delays</span>
                <span>{l.volume} shipments</span>
              </div>
            </div>
          ))}
        </div>

        {/* Cargo Mix */}
        <div className="card">
          <h3 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Cargo Mix</h3>
          {ov.cargo_by_type.map((c, i) => {
            const colors = ['#2563ff', '#00d4ff', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6']
            return (
              <div key={c.type} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                    <span>{c.type}</span>
                    <span style={{ fontWeight: 700, color: colors[i] }}>{c.pct}%</span>
                  </div>
                  <div className="progress progress-sm"><div className="progress-bar" style={{ width: `${c.pct}%`, background: colors[i] }} /></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
