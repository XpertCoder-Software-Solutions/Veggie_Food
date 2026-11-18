import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { ITEMS } from './data.js'

const CartCtx = createContext(null)
const KEY = 'vf-cart'

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '{}') || {}
    return Object.fromEntries(Object.entries(raw).filter(([k, v]) => ITEMS[k] && v > 0))
  } catch {
    return {}
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(load)
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(cart)) } catch { /* storage unavailable */ }
  }, [cart])

  const add = useCallback((id) => {
    setCart((c) => {
      if (!c[id]) setToast({ key: Date.now(), text: `اتضاف ${ITEMS[id].full} للسلة` })
      return { ...c, [id]: (c[id] || 0) + 1 }
    })
  }, [])
  const dec = useCallback((id) => {
    setCart((c) => {
      const n = { ...c }
      n[id] = (n[id] || 0) - 1
      if (n[id] <= 0) delete n[id]
      return n
    })
  }, [])
  const clear = useCallback(() => setCart({}), [])

  const value = useMemo(() => {
    const ids = Object.keys(cart)
    const count = ids.reduce((s, k) => s + cart[k], 0)
    const total = ids.reduce((s, k) => s + cart[k] * ITEMS[k].price, 0)
    return { cart, ids, count, total, add, dec, clear, open, setOpen, toast, setToast }
  }, [cart, add, dec, clear, open, toast])

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>
}

export const useCart = () => useContext(CartCtx)
