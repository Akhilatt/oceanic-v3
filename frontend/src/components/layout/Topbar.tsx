import { useNavigate } from 'react-router-dom'
import { Bell, Sun, Moon, Menu } from 'lucide-react'
import type { User as U } from '../../types'
import type { Theme } from '../../hooks/useTheme'

interface Props {
  title: string
  user: U
  onMenuClick: () => void
  unread: number
  theme: Theme
  onToggleTheme: () => void
}

export default function Topbar({ title, user, onMenuClick, unread, theme, onToggleTheme }: Props) {
  const nav = useNavigate()

  return (
    <div className="topbar">
      <button className="icon-btn" onClick={onMenuClick} style={{ flexShrink: 0 }}>
        <Menu size={17} />
      </button>

      <span className="topbar-title">{title}</span>

      <div className="topbar-actions">
        {/* Theme Toggle */}
        <button
          className="icon-btn"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          <span style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'opacity .25s, transform .25s',
            opacity: theme === 'dark' ? 1 : 0,
            transform: theme === 'dark' ? 'rotate(0deg) scale(1)' : 'rotate(90deg) scale(0)',
          }}>
            <Sun size={16} />
          </span>
          <span style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'opacity .25s, transform .25s',
            opacity: theme === 'light' ? 1 : 0,
            transform: theme === 'light' ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0)',
          }}>
            <Moon size={16} />
          </span>
        </button>

        {/* Notifications */}
        <button className="icon-btn" onClick={() => nav('/notifications')}>
          <Bell size={16} />
          {unread > 0 && <span className="dot">{unread > 9 ? '9+' : unread}</span>}
        </button>

        {/* Avatar */}
        <button className="icon-btn" onClick={() => nav('/profile')} style={{ padding: 0 }}>
          <img
            src={user.avatar ?? `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
            alt="av"
            style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-strong)' }}
          />
        </button>
      </div>
    </div>
  )
}
