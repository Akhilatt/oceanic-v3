// AdminUsers.tsx
import { useState, useEffect } from 'react'
import apiFetch from '../../lib/api'
import { Spinner, Empty, Badge } from '../../components/ui'

export default function AdminUsers({ show }: { show: (m: string, t?: 'success'|'error'|'info') => void }) {
  const [users, setUsers] = useState<{ id: string; name: string; email: string; role: string; plan: string; verified: boolean; created_at: string }[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { apiFetch<{ data: typeof users }>('/admin/users').then(r => setUsers(r.data ?? [])).finally(() => setLoading(false)) }, [])

  async function verify(id: string) {
    await apiFetch(`/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify({ verified: true }) })
    setUsers(u => u.map(x => x.id === id ? { ...x, verified: true } : x))
    show('User verified!', 'success')
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}><h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 30, fontWeight: 700, marginBottom: 4 }}>👥 Users</h1><p style={{ color: 'var(--muted)', fontSize: 14 }}>All registered users on the platform.</p></div>
      {loading ? <Spinner /> : (
        <div className="card">
          <div style={{ marginBottom: 16, fontSize: 13, color: 'var(--muted)' }}>Total: <strong style={{ color: 'var(--text)' }}>{users.length}</strong> users</div>
          <div className="table-wrap">
            <table>
              <thead><tr>{['Name', 'Email', 'Role', 'Plan', 'Verified', 'Joined', 'Action'].map(h => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontSize: 13, fontWeight: 600 }}>{u.name}</td>
                    <td style={{ fontSize: 12, color: 'var(--muted)' }}>{u.email}</td>
                    <td><Badge status={u.role === 'admin' ? 'High' : 'Normal'} /></td>
                    <td style={{ fontSize: 12 }}>{u.plan}</td>
                    <td>{u.verified ? <span style={{ color: 'var(--emerald)' }}>✅</span> : <span style={{ color: 'var(--rose)' }}>❌</span>}</td>
                    <td style={{ fontSize: 11, color: 'var(--muted)' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td>{!u.verified && <button className="btn btn-success btn-sm" onClick={() => verify(u.id)}>Verify</button>}</td>
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
