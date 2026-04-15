# 🌊 Oceanic Ships — Full Stack Platform v3

## Quick Start

### Backend (Python FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# API Docs: http://localhost:8000/docs
```

### Frontend (React + TypeScript + Tailwind)
```bash
cd frontend
npm install
npm run dev
# App: http://localhost:5173
```

### Demo Login
```
Email:    admin@oceanic.com
Password: 123456
```

---

## Project Structure

```
oceanic-ships/
├── backend/
│   ├── main.py              # FastAPI — 40+ endpoints
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── public/      # 8 pages (Home, About, Services, Pricing, Contact, Tracking, Blog×2)
    │   │   ├── auth/        # 4 pages (Login, Signup, ForgotPassword, ResetPassword)
    │   │   ├── portal/      # 23 pages (Dashboard, Shipments, Fleet, Analytics, etc.)
    │   │   └── admin/       # 5 pages (Users, Shipments, Contacts, Tickets, Stats)
    │   ├── components/
    │   │   ├── ui/          # Badge, Progress, StatCard, ShipCard, VesselCard, Toast, etc.
    │   │   └── layout/      # Sidebar, Topbar, PublicNav
    │   ├── hooks/           # useAuth, useToast
    │   ├── lib/             # api.ts (fetch wrapper)
    │   ├── types/           # All TypeScript types
    │   ├── styles/          # globals.css (premium dark design system)
    │   ├── App.tsx          # Router + 40 routes + protected routes
    │   └── main.tsx
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.ts
```

---

## Pages (40+)

### Public (8)
| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, features, routes, testimonials, pricing preview |
| About | `/about` | Company story, stats, leadership team |
| Services | `/services` | FCL, LCL, Breakbulk, Customs, Express, Analytics |
| Pricing | `/pricing` | Starter / Professional / Enterprise plans |
| Contact | `/contact` | Contact form + office info |
| Track | `/track` | Public shipment tracking (no login required) |
| Blog List | `/blog` | Maritime insights articles |
| Blog Post | `/blog/:slug` | Individual article view |

### Auth (4)
| Page | Route |
|------|-------|
| Login | `/login` |
| Signup | `/signup` |
| Forgot Password | `/forgot-password` |
| Reset Password | `/reset-password` |

### Portal (23)
| Page | Route |
|------|-------|
| Dashboard | `/dashboard` |
| Shipments | `/shipments` |
| Shipment Detail | `/shipments/:id` |
| Live Tracking | `/tracking` |
| Fleet | `/fleet` |
| Vessel Detail | `/fleet/:id` |
| Create Order | `/orders` |
| Order History | `/orders/history` |
| Analytics | `/analytics` |
| Port Stats | `/analytics/ports` |
| Revenue | `/analytics/revenue` |
| Invoices | `/invoices` |
| Pricing | `/pricing` |
| Quote | `/quote` |
| Notifications | `/notifications` |
| Support | `/support` |
| Ticket Detail | `/support/:id` |
| Reviews | `/reviews` |
| Documents | `/documents` |
| Profile | `/profile` |
| Settings | `/settings` |
| Change Password | `/change-password` |
| Activity Log | `/activity` |

### Admin (5) — Admin role only
| Page | Route |
|------|-------|
| Users | `/admin/users` |
| All Shipments | `/admin/shipments` |
| Contact Leads | `/admin/contacts` |
| All Tickets | `/admin/tickets` |
| Admin Stats | `/admin/stats` |

---

## API Endpoints (40+)

| Group | Count | Endpoints |
|-------|-------|-----------|
| System | 2 | health, version |
| Auth | 7 | signup, login, logout, refresh, forgot-pw, reset-pw, change-pw |
| Profile | 5 | get, update, avatar, notifications, activity |
| Dashboard | 2 | stats, map-data |
| Shipments | 6 | list, get, create, update, delete, documents |
| Tracking | 2 | track, events |
| Orders | 4 | create, list, get, cancel |
| Fleet | 5 | list, get, update, crew, logs |
| Analytics | 4 | overview, performance, revenue, ports |
| Contact | 2 | submit, leads (admin) |
| Support | 4 | create-ticket, list, get, update |
| Notifications | 3 | list, mark-read, mark-all-read |
| Reviews | 2 | create, list |
| Invoices | 3 | create, list, pay |
| Admin | 3 | users, update-user, stats |
| Pricing | 2 | plans, quote |

---

## Design System

- **Fonts**: Clash Display (headings) + Satoshi (body) + JetBrains Mono (IDs/code)
- **Theme**: Deep navy dark — `#060d1a` base with `#2563ff` accent and `#00d4ff` cyan
- **Components**: `globals.css` — full design system with cards, buttons, badges, tables, forms, animations
- **Responsive**: Mobile sidebar with hamburger, responsive grids throughout

## React Native Ready

Same REST API — just swap:
- `localStorage` → `AsyncStorage`
- `fetch('/api/...')` → `fetch('http://your-ip:8000/api/...')`

All types are in `src/types/index.ts` — reuse directly in React Native.
