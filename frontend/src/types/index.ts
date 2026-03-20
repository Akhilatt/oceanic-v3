export type Role = 'admin' | 'user'
export type ShipStatus = 'In Transit' | 'Delivered' | 'Delayed'
export type VesselStatus = 'Active' | 'In Port' | 'Delayed' | 'Maintenance'
export type Priority = 'Low' | 'Normal' | 'High'
export type TicketStatus = 'Open' | 'Resolved'

export interface User {
  id: string; email: string; name: string; role: Role
  phone: string; company: string; avatar: string; address: string
  verified: boolean; created_at: string; last_login: string | null
  notifications_enabled: boolean; two_fa: boolean; plan: string; credits: number
}

export interface LoginResponse {
  token: string; refresh_token: string; expires_in: number
  user: Partial<User>
}

export interface Shipment {
  id: string; route: string; cargo: string; status: ShipStatus
  from_port: string; to_port: string; vessel: string; eta: string
  progress: number; weight_tons: number; container_count: number
  priority: Priority; notes: string; created_at: string; image: string
  cost_usd: number; insured: boolean; customs_cleared: boolean
}

export interface TrackingMilestone { step: string; done: boolean; ts: string }
export interface TrackingResult {
  id: string; vessel: string; status: ShipStatus; from: string; to: string
  progress: number; eta: string; cargo: string; weight_tons: number
  milestones: TrackingMilestone[]; insured: boolean; customs_cleared: boolean
}

export interface Vessel {
  id: string; name: string; type: string; capacity_teu: number
  status: VesselStatus; route: string; flag: string; year_built: number
  crew_count: number; speed_knots: number; fuel_type: string
  next_port: string; image: string; maintenance_due: string; rating: number
}

export interface Order {
  id: string; user_id: string; user_name: string
  from_port: string; to_port: string; cargo: string
  weight_tons: number; container_count: number; priority: Priority
  notes: string; status: string; created_at: string; estimated_cost_usd: number
}

export interface DashboardStats {
  total_shipments: number; in_transit: number; delivered: number; delayed: number
  fleet_size: number; active_vessels: number; total_cargo_tons: number
  pending_orders: number; open_tickets: number; total_revenue_usd: number; credits: number
}

export interface Notification {
  id: string; title: string; message: string
  type: 'info' | 'success' | 'error'; read: boolean; created_at: string
}

export interface Ticket {
  id: string; user_id: string; user_name: string; user_email: string
  subject: string; description: string; priority: Priority
  status: TicketStatus; created_at: string; updated_at: string
}

export interface PricingPlan {
  id: string; name: string; price_usd: number; billing: string
  color: string; popular?: boolean; features: string[]
}

export interface AnalyticsOverview {
  weekly_throughput: { day: string; value: number }[]
  trade_lanes: { lane: string; on_time_pct: number; delay_pct: number; volume: number }[]
  cargo_by_type: { type: string; pct: number }[]
  monthly_revenue: { month: string; value: number }[]
}

export interface AnalyticsPerformance {
  on_time_delivery_rate: number; average_transit_days: number
  fleet_utilization_pct: number; customer_satisfaction: number
  carbon_offset_tons: number; cost_per_ton_usd: number; revenue_growth_pct: number
}

export interface Invoice {
  id: string; order_id: string; amount_usd: number
  due_date: string; status: 'Paid' | 'Unpaid'; created_at: string; paid_at?: string
}

export interface CrewMember {
  name: string; role: string; nationality: string; experience_years: number
}

export interface VesselLog {
  date: string; event: string; position: string
}

export interface PortStat {
  port: string; calls: number; avg_dwell_days: number
}
