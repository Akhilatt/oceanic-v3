import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from './hooks/useAuth'
import { useToast } from './hooks/useToast'
import { useTheme } from './hooks/useTheme'
import { ToastBar } from './components/ui'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import apiFetch from './lib/api'

// Public pages
import Home from './pages/public/Home'
import About from './pages/public/About'
import ServicesPage from './pages/public/Services'
import PricingPublic from './pages/public/PricingPublic'
import Contact from './pages/public/Contact'
import PublicTracking from './pages/public/PublicTracking'
import BlogList from './pages/public/BlogList'
import BlogPost from './pages/public/BlogPost'

// Auth pages
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'

// Portal pages
import Dashboard from './pages/portal/Dashboard'
import Shipments from './pages/portal/Shipments'
import ShipmentDetail from './pages/portal/ShipmentDetail'
import Tracking from './pages/portal/Tracking'
import Fleet from './pages/portal/Fleet'
import VesselDetail from './pages/portal/VesselDetail'
import Orders from './pages/portal/Orders'
import OrderList from './pages/portal/OrderList'
import Analytics from './pages/portal/Analytics'
import AnalyticsPorts from './pages/portal/AnalyticsPorts'
import AnalyticsRevenue from './pages/portal/AnalyticsRevenue'
import Invoices from './pages/portal/Invoices'
import Pricing from './pages/portal/Pricing'
import Quote from './pages/portal/Quote'
import Notifications from './pages/portal/Notifications'
import Support from './pages/portal/Support'
import TicketDetail from './pages/portal/TicketDetail'
import Reviews from './pages/portal/Reviews'
import Documents from './pages/portal/Documents'
import Profile from './pages/portal/Profile'
import Settings from './pages/portal/Settings'
import ChangePassword from './pages/portal/ChangePassword'
import Activity from './pages/portal/Activity'

// Admin pages
import AdminUsers from './pages/admin/AdminUsers'
import AdminShipments from './pages/admin/AdminShipments'
import AdminContacts from './pages/admin/AdminContacts'
import AdminTickets from './pages/admin/AdminTickets'
import AdminStats from './pages/admin/AdminStats'

import type { User } from './types'
import type { Theme } from './hooks/useTheme'

interface PortalProps {
  user: User
  onLogout: () => void
  show: (m: string, t?: 'success' | 'error' | 'info') => void
  children: React.ReactNode
  title: string
  theme: Theme
  onToggleTheme: () => void
}

function Portal({ user, onLogout, show, children, title, theme, onToggleTheme }: PortalProps) {
  const [sideOpen, setSideOpen] = useState(false)
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    apiFetch<{ unread: number }>('/notifications')
      .then(r => setUnread(r.unread ?? 0))
      .catch(() => {})
  }, [])

  return (
    <div className="app-shell">
      <div className="grid-bg" />
      <Sidebar
        user={user}
        onLogout={onLogout}
        unread={unread}
        open={sideOpen}
        onClose={() => setSideOpen(false)}
      />
      <div className="main-area">
        <Topbar
          title={title}
          user={user}
          onMenuClick={() => setSideOpen(true)}
          unread={unread}
          theme={theme}
          onToggleTheme={onToggleTheme}
        />
        <div className="page-content">{children}</div>
      </div>
    </div>
  )
}

function Guard({
  user, onLogout, show, children, title, adminOnly, theme, onToggleTheme
}: PortalProps & { adminOnly?: boolean }) {
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return (
    <Portal user={user} onLogout={onLogout} show={show} title={title} theme={theme} onToggleTheme={onToggleTheme}>
      {children}
    </Portal>
  )
}

export default function App() {
  const { user, login, logout } = useAuth()
  const { toast, show, clear } = useToast()
  const { theme, toggle: toggleTheme } = useTheme()

  const p = (title: string, adminOnly = false) => (el: React.ReactNode) => (
    <Guard
      user={user!}
      onLogout={logout}
      show={show}
      title={title}
      adminOnly={adminOnly}
      theme={theme}
      onToggleTheme={toggleTheme}
    >
      {el}
    </Guard>
  )

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"         element={<Home />} />
        <Route path="/about"    element={<About />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/pricing"  element={<PricingPublic />} />
        <Route path="/contact"  element={<Contact />} />
        <Route path="/track"    element={<PublicTracking />} />
        <Route path="/blog"     element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />

        {/* Auth */}
        <Route path="/login"            element={<Login onLogin={login} show={show} />} />
        <Route path="/signup"           element={<Signup show={show} />} />
        <Route path="/forgot-password"  element={<ForgotPassword show={show} />} />
        <Route path="/reset-password"   element={<ResetPassword show={show} />} />

        {/* Portal */}
        <Route path="/dashboard"          element={p('Dashboard')(<Dashboard show={show} />)} />
        <Route path="/shipments"          element={p('Shipments')(<Shipments show={show} />)} />
        <Route path="/shipments/:id"      element={p('Shipment Detail')(<ShipmentDetail />)} />
        <Route path="/tracking"           element={p('Live Tracking')(<Tracking />)} />
        <Route path="/fleet"              element={p('Fleet')(<Fleet />)} />
        <Route path="/fleet/:id"          element={p('Vessel Detail')(<VesselDetail />)} />
        <Route path="/orders"             element={p('Create Order')(<Orders show={show} />)} />
        <Route path="/orders/history"     element={p('Order History')(<OrderList />)} />
        <Route path="/analytics"          element={p('Analytics')(<Analytics />)} />
        <Route path="/analytics/ports"    element={p('Port Statistics')(<AnalyticsPorts />)} />
        <Route path="/analytics/revenue"  element={p('Revenue Analytics')(<AnalyticsRevenue />)} />
        <Route path="/invoices"           element={p('Invoices')(<Invoices show={show} />)} />
        <Route path="/pricing"            element={p('Pricing')(<Pricing show={show} />)} />
        <Route path="/quote"              element={p('Get Quote')(<Quote />)} />
        <Route path="/notifications"      element={p('Notifications')(<Notifications />)} />
        <Route path="/support"            element={p('Support')(<Support show={show} />)} />
        <Route path="/support/:id"        element={p('Ticket Detail')(<TicketDetail />)} />
        <Route path="/reviews"            element={p('Reviews')(<Reviews show={show} />)} />
        <Route path="/documents"          element={p('Documents')(<Documents />)} />
        <Route path="/profile"            element={p('My Profile')(<Profile show={show} />)} />
        <Route path="/settings"           element={p('Settings')(<Settings show={show} />)} />
        <Route path="/change-password"    element={p('Change Password')(<ChangePassword show={show} />)} />
        <Route path="/activity"           element={p('Activity Log')(<Activity />)} />

        {/* Admin */}
        <Route path="/admin/users"     element={p('Users', true)(<AdminUsers show={show} />)} />
        <Route path="/admin/shipments" element={p('All Shipments', true)(<AdminShipments show={show} />)} />
        <Route path="/admin/contacts"  element={p('Contact Leads', true)(<AdminContacts />)} />
        <Route path="/admin/tickets"   element={p('All Tickets', true)(<AdminTickets show={show} />)} />
        <Route path="/admin/stats"     element={p('Admin Stats', true)(<AdminStats />)} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {toast && <ToastBar key={toast.id} toast={toast} onDone={clear} />}
    </BrowserRouter>
  )
}
