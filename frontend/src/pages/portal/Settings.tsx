// Settings.tsx
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import { Sun, Moon } from 'lucide-react'

export default function Settings({ show }: { show: (m: string, t?: 'success'|'error'|'info') => void }) {
  const nav = useNavigate()
  const { theme, toggle } = useTheme()

  const sections = [
    { icon: '🔒', title: 'Change Password', desc: 'Update your account password', action: () => nav('/change-password'), btn: 'Change' },
    { icon: '👤', title: 'Edit Profile', desc: 'Update name, phone, and company', action: () => nav('/profile'), btn: 'Edit' },
    { icon: '📋', title: 'Activity Log', desc: 'View recent account activity', action: () => nav('/activity'), btn: 'View' },
    { icon: '📦', title: 'Order History', desc: 'View all your past orders', action: () => nav('/orders/history'), btn: 'View' },
    { icon: '🧾', title: 'Invoices', desc: 'Manage and pay invoices', action: () => nav('/invoices'), btn: 'View' },
    { icon: '💰', title: 'Pricing & Plans', desc: 'Upgrade or change your plan', action: () => nav('/pricing'), btn: 'View' },
    { icon: '🔔', title: 'Notification Preferences', desc: 'Control your email and alert settings', action: () => nav('/profile'), btn: 'Manage' },
    { icon: '🗑️', title: 'Delete Account', desc: 'Permanently delete your account and data', action: () => show('Please contact support to delete your account.', 'info'), btn: 'Contact Support', danger: true },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 30, fontWeight: 700, marginBottom: 4 }}>Settings</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>Manage your account and preferences.</p>
      </div>

      {/* Theme Toggle Card */}
      <div className="card" style={{ marginBottom: 12, maxWidth: 640 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 24 }}>{theme === 'dark' ? '🌙' : '☀️'}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>Appearance</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>
              Currently: <strong style={{ color: 'var(--accent)' }}>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</strong>
            </div>
          </div>
          <button
            onClick={toggle}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px',
              borderRadius: 10, cursor: 'pointer', fontFamily: 'Satoshi,sans-serif',
              fontSize: 13, fontWeight: 600, transition: 'all .2s',
              background: theme === 'dark' ? 'rgba(245,158,11,0.12)' : 'rgba(37,99,255,0.1)',
              border: theme === 'dark' ? '1px solid rgba(245,158,11,0.3)' : '1px solid rgba(37,99,255,0.25)',
              color: theme === 'dark' ? 'var(--amber)' : 'var(--accent)',
            }}
          >
            {theme === 'dark'
              ? <><Sun size={15} /> Switch to Light</>
              : <><Moon size={15} /> Switch to Dark</>
            }
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 640 }}>
        {sections.map(s => (
          <div key={s.title} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px' }}>
            <span style={{ fontSize: 24, flexShrink: 0 }}>{s.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{s.desc}</div>
            </div>
            <button
              className={`btn btn-sm ${(s as { danger?: boolean }).danger ? 'btn-danger' : 'btn-secondary'}`}
              onClick={s.action}
            >
              {s.btn}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
