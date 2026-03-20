import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

export default function PublicNav() {
  const nav = useNavigate()
  const [open, setOpen] = useState(false)
  const { theme, toggle } = useTheme()

  const links = [
    ['/', 'Home'],
    ['/about', 'About'],
    ['/services', 'Services'],
    ['/pricing', 'Pricing'],
    ['/track', 'Track'],
    ['/blog', 'Blog'],
    ['/contact', 'Contact'],
  ]

  return (
    <>
      <nav className="pub-nav">
        <Link to="/" className="pub-logo">
          <div className="logo-mark" style={{ width: 34, height: 34, fontSize: 16 }}>🌊</div>
          <span className="logo-text">Oceanic Ships</span>
        </Link>

        {/* Desktop Links */}
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }} className="hidden-mobile">
          {links.map(([href, label]) => (
            <Link key={href} to={href} className="pub-nav-link">{label}</Link>
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginLeft: 16 }}>
          {/* Theme toggle */}
          <button
            onClick={toggle}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{
              width: 36, height: 36, borderRadius: 9, cursor: 'pointer',
              background: 'var(--input-bg)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--muted)', transition: 'all .2s', position: 'relative', overflow: 'hidden',
            }}
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

          <button className="btn btn-secondary btn-sm" onClick={() => nav('/login')}>Login</button>
          <button className="btn btn-primary btn-sm" onClick={() => nav('/signup')}>Sign Up</button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="show-mobile"
          style={{
            width: 36, height: 36, borderRadius: 9,
            background: 'var(--input-bg)', border: '1px solid var(--border)',
            display: 'none', alignItems: 'center', justifyContent: 'center',
            color: 'var(--muted)', cursor: 'pointer',
          }}
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      {open && (
        <div style={{
          position: 'fixed', top: 68, left: 0, right: 0, zIndex: 99,
          background: 'var(--navy)', borderBottom: '1px solid var(--border)',
          padding: '12px 24px 20px',
          display: 'flex', flexDirection: 'column', gap: 0,
        }}>
          {links.map(([href, label]) => (
            <Link
              key={href} to={href} className="pub-nav-link"
              style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', display: 'block' }}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => { nav('/login'); setOpen(false) }}>Login</button>
            <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => { nav('/signup'); setOpen(false) }}>Sign Up</button>
          </div>
        </div>
      )}

      <style>{`
        .hidden-mobile { display: flex !important }
        .show-mobile   { display: none !important }
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important }
          .show-mobile   { display: flex !important }
        }
      `}</style>
    </>
  )
}
