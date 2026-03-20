const BASE = '/api'

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('oc_token')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init.headers as Record<string, string> ?? {}),
  }
  const res = await fetch(`${BASE}${path}`, { ...init, headers })
  const data = await res.json().catch(() => ({})) as Record<string, string>
  if (!res.ok) throw new Error(data['detail'] ?? data['error'] ?? 'Request failed')
  return data as T
}

export default apiFetch
