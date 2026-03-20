import { useState, useEffect } from 'react'
import apiFetch from '../../lib/api'
import type { User } from '../../types'
import { Spinner, Tabs, DataRow } from '../../components/ui'

export default function Profile({ show }: { show: (m: string, t?: 'success'|'error'|'info') => void }) {
  const [profile, setProfile] = useState<User | null>(null)
  const [tab, setTab] = useState('Info')
  const [form, setForm] = useState({ name: '', phone: '', company: '', address: '' })
  const [saving, setSaving] = useState(false)
  const s = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [k]: e.target.value }))

  useEffect(() => {
    apiFetch<User>('/profile').then(r => { setProfile(r); setForm({ name: r.name, phone: r.phone ?? '', company: r.company ?? '', address: r.address ?? '' }) }).catch(() => {})
  }, [])

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    try { const r = await apiFetch<{ user: User }>('/profile', { method: 'PATCH', body: JSON.stringify(form) }); setProfile(p => p ? { ...p, ...r.user } : p); show('Profile updated!', 'success') }
    catch (err) { show(err instanceof Error ? err.message : 'Failed', 'error') } finally { setSaving(false) }
  }

  if (!profile) return <Spinner />

  const planColors: Record<string, string> = { starter: '#2563ff', professional: '#00d4ff', enterprise: '#f59e0b' }

  return (
    <div>
      {/* Profile Header */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative' }}>
          <img src={profile.avatar} alt="av" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent)' }} />
          {profile.verified && <div style={{ position: 'absolute', bottom: 0, right: 0, width: 22, height: 22, borderRadius: '50%', background: 'var(--emerald)', border: '2px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>✓</div>}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{profile.name}</h2>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>{profile.email}</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ padding: '3px 12px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: `${planColors[profile.plan] ?? '#2563ff'}20`, color: planColors[profile.plan] ?? 'var(--accent)', border: `1px solid ${planColors[profile.plan] ?? 'var(--accent)'}40` }}>{profile.plan.toUpperCase()} PLAN</span>
            <span style={{ padding: '3px 12px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: 'rgba(255,255,255,.06)', color: 'var(--muted)', border: '1px solid var(--border)' }}>{profile.role.toUpperCase()}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 32, fontWeight: 700, color: 'var(--cyan)' }}>{profile.credits.toLocaleString()}</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>Credits</div>
          <div style={{ fontSize: 12, color: 'var(--dim)', marginTop: 6 }}>Member since {new Date(profile.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}</div>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}><Tabs tabs={['Info', 'Account', 'Preferences']} active={tab} onChange={setTab} /></div>

      {tab === 'Info' && (
        <div className="card" style={{ maxWidth: 520 }}>
          <h3 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Edit Profile</h3>
          <form onSubmit={saveProfile}>
            {[['name', 'Full Name'], ['phone', 'Phone Number'], ['company', 'Company'], ['address', 'Address']].map(([k, l]) => (
              <div key={k} className="form-group"><label className="form-label">{l}</label><input className="form-input" value={form[k as keyof typeof form]} onChange={s(k as keyof typeof form)} required={k === 'name'} /></div>
            ))}
            <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
          </form>
        </div>
      )}

      {tab === 'Account' && (
        <div className="card" style={{ maxWidth: 480 }}>
          <h3 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Account Details</h3>
          <DataRow label="User ID" value={profile.id} mono />
          <DataRow label="Email" value={profile.email} />
          <DataRow label="Role" value={profile.role} />
          <DataRow label="Plan" value={profile.plan} />
          <DataRow label="Verified" value={profile.verified ? '✅ Yes' : '❌ No'} />
          <DataRow label="2FA" value={profile.two_fa ? '✅ Enabled' : '❌ Disabled'} />
          <DataRow label="Last Login" value={profile.last_login ? new Date(profile.last_login).toLocaleString() : 'This session'} />
          <div style={{ marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a href="/change-password" className="btn btn-secondary btn-sm">🔒 Change Password</a>
            <a href="/activity" className="btn btn-secondary btn-sm">📋 Activity Log</a>
          </div>
        </div>
      )}

      {tab === 'Preferences' && (
        <div className="card" style={{ maxWidth: 480 }}>
          <h3 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Preferences</h3>
          {[['Email Notifications', 'Receive shipment and order updates', profile.notifications_enabled]].map(([label, desc, enabled]) => (
            <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
              <div><div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{label as string}</div><div style={{ fontSize: 12, color: 'var(--muted)' }}>{desc as string}</div></div>
              <label style={{ position: 'relative', width: 44, height: 24, cursor: 'pointer', flexShrink: 0 }}>
                <input type="checkbox" style={{ opacity: 0, width: 0, height: 0 }} defaultChecked={enabled as boolean}
                  onChange={async e => { await apiFetch('/profile/notifications', { method: 'PATCH', body: JSON.stringify({ notifications_enabled: e.target.checked }) }); show('Saved!', 'success') }} />
                <span style={{ position: 'absolute', inset: 0, borderRadius: 99, background: enabled ? 'var(--accent)' : 'rgba(255,255,255,.12)', transition: '.2s' }} />
                <span style={{ position: 'absolute', top: 2, left: enabled ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: '.2s' }} />
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
