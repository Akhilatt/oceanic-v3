import { useState, useCallback } from 'react'
export interface Toast { id: number; msg: string; type: 'success' | 'error' | 'info' }
export function useToast() {
  const [toast, setToast] = useState<Toast | null>(null)
  const show = useCallback((msg: string, type: Toast['type'] = 'success') => setToast({ id: Date.now(), msg, type }), [])
  const clear = useCallback(() => setToast(null), [])
  return { toast, show, clear }
}
