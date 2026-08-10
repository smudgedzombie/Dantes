'use client'

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react'
import { THB_VAT_RATE } from '@/lib/pricing'

export type CartItem = {
  name: string
  category: string
  price: number
  image?: string
  qty: number
}

type State = { items: CartItem[] }

type Action =
  | { type: 'add'; item: Omit<CartItem, 'qty'>; qty?: number }
  | { type: 'remove'; name: string }
  | { type: 'setQty'; name: string; qty: number }
  | { type: 'clear' }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add': {
      const existing = state.items.find((i) => i.name === action.item.name)
      const addQty = action.qty ?? 1
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.name === action.item.name ? { ...i, qty: i.qty + addQty } : i,
          ),
        }
      }
      return { items: [...state.items, { ...action.item, qty: addQty }] }
    }
    case 'remove':
      return { items: state.items.filter((i) => i.name !== action.name) }
    case 'setQty': {
      if (action.qty <= 0) {
        return { items: state.items.filter((i) => i.name !== action.name) }
      }
      return {
        items: state.items.map((i) =>
          i.name === action.name ? { ...i, qty: action.qty } : i,
        ),
      }
    }
    case 'clear':
      return { items: [] }
    default:
      return state
  }
}

type CartContextValue = {
  items: CartItem[]
  count: number
  subtotal: number
  vat: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  add: (item: Omit<CartItem, 'qty'>, qty?: number) => void
  remove: (name: string) => void
  setQty: (name: string, qty: number) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] })
  const [isOpen, setIsOpen] = useState(false)

  const value = useMemo<CartContextValue>(() => {
    const count = state.items.reduce((n, i) => n + i.qty, 0)
    const subtotal = state.items.reduce((n, i) => n + i.price * i.qty, 0)
    const vat = subtotal * THB_VAT_RATE
    return {
      items: state.items,
      count,
      subtotal,
      vat,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      add: (item, qty) => {
        dispatch({ type: 'add', item, qty })
        setIsOpen(true)
      },
      remove: (name) => dispatch({ type: 'remove', name }),
      setQty: (name, qty) => dispatch({ type: 'setQty', name, qty }),
      clear: () => dispatch({ type: 'clear' }),
    }
  }, [state.items, isOpen])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
