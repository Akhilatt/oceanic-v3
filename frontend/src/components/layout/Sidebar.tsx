import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Package, MapPin, Anchor, FilePlus, BarChart3,
  DollarSign, Bell, LifeBuoy, User, LogOut, Ship, Globe, FileText,
  Star, Receipt, Users, Settings, ShieldCheck, X, TrendingUp
} from 'lucide-react'
import type { User as UserType } from '../../types'
import apiFetch from '../../lib/api'

interface Props { user: UserType; onLogout: () => void; unread: number; open: boolean; onClose: () => void }

const NAV = [
  { group: 'Main', items: [
    { path: '/dashboard',     label: 'Dashboard',      icon: LayoutDashboard },
    { path: '/shipments',     label: 'Shipments',      icon: Package },
    { path: '/tracking',      label: 'Live Tracking',  icon: MapPin },
    { path: '/fleet',         label: 'Fleet',          icon: Anchor },
    { path: '/orders',        label: 'Create Order',   icon: FilePlus },
  ]},
  { group: 'Finance', items: [
    { path: '/invoices',      label: 'Invoices',       icon: Receipt },
    { path: '/pricing',       label: 'Pricing',        icon: DollarSign },
    { path: '/quote',         label: 'Get Quote',      icon: TrendingUp },
  ]},
  { group: 'Insights', items: [
    { path: '/analytics',     label: 'Analytics',      icon: BarChart3 },
    { path: '/analytics/ports', label: 'Port Stats',   icon: Globe },
    { path: '/analytics/revenue', label: 'Revenue',    icon: TrendingUp },
  ]},
  { group: 'Account', items: [
    { path: '/notifications', label: 'Notifications',  icon: Bell, badge: true },
    { path: '/support',       label: 'Support',        icon: LifeBuoy },
    { path: '/reviews',       label: 'Reviews',        icon: Star },
    { path: '/documents',     label: 'Documents',      icon: FileText },
    { path: '/profile',       label: 'My Profile',     icon: User },
    { path: '/settings',      label: 'Settings',       icon: Settings },
  ]},
]

const ADMIN_NAV = [
  { group: 'Admin', items: [
    { path: '/admin/users',      label: 'Users',       icon: Users },
    { path: '/admin/shipments',  label: 'All Shipments',icon: Package },
    { path: '/admin/contacts',   label: 'Contacts',    icon: Globe },
    { path: '/admin/tickets',    label: 'All Tickets', icon: LifeBuoy },
    { path: '/admin/stats',      label: 'Admin Stats', icon: ShieldCheck },
  ]},
]

export default function Sidebar({ user, onLogout, unread, open, onClose }: Props) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  async function handleLogout() {
    try { await apiFetch('/auth/logout', { method: 'POST' }) } catch (_) {}
    onLogout(); navigate('/login')
  }

  function go(path: string) { navigate(path); onClose() }

  const groups = user.role === 'admin' ? [...NAV, ...ADMIN_NAV] : NAV

  return (
    <>
      {open && <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 99, backdropFilter: 'blur(4px)' }} className="lg:hidden" />}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-mark">🌊</div>
          <span className="logo-text">Oceanic Ships</span>
          <button onClick={onClose} style={{ marginLeft: 'auto', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }} className="lg:hidden">
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="nav-section">
          {groups.map(g => (
            <div key={g.group}>
              <p className="nav-group-label">{g.group}</p>
              {g.items.map(({ path, label, icon: Icon, badge }: { path: string; label: string; icon: React.ComponentType<{size?: number}>; badge?: boolean }) => (
                <button key={path} onClick={() => go(path)}
                  className={`nav-link w-full ${pathname === path || pathname.startsWith(path + '/') ? 'active' : ''}`}>
                  <Icon size={16} />
                  <span style={{ flex: 1, textAlign: 'left' }}>{label}</span>
                  {badge && unread > 0 && <span className="nav-badge">{unread > 9 ? '9+' : unread}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* User */}
        <div className="sidebar-user">
          <div className="user-card" onClick={() => go('/profile')}>
            <img className="user-avatar" src={user.avatar ?? `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt="av" />
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div className="user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
              <div className="user-role">{user.plan} · {user.role}</div>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout}><LogOut size={14} /> Sign Out</button>
        </div>
      </aside>
    </>
  )
}
