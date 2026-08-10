// Thailand-based pricing. Prices are in Thai Baht (THB).
// The source catalog has no price field, so we derive a stable, sensible
// price per product from its category base plus a deterministic offset
// (so the same product always shows the same price).

export const THB_VAT_RATE = 0.07 // Thailand standard VAT

const CATEGORY_BASE_THB: Record<string, number> = {
  lighters: 120,
  grinders: 350,
  ashtrays: 250,
  'rolling-trays': 300,
  'rolling-papers': 60,
  'pre-rolled-cones': 90,
  sheesha: 850,
  'storage-jars': 200,
}

const DEFAULT_BASE = 150

function hash(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

export function priceForProduct(categoryId: string, name: string): number {
  const base = CATEGORY_BASE_THB[categoryId] ?? DEFAULT_BASE
  // Deterministic offset: 0, 10, 20 ... up to ~60% of base, rounded to 10s.
  const steps = Math.max(1, Math.round((base * 0.6) / 10))
  const offset = (hash(name) % steps) * 10
  return base + offset
}

const bahtFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'THB',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export function formatBaht(amount: number): string {
  return bahtFormatter.format(Math.round(amount))
}

export type ShippingOption = {
  id: string
  label: string
  detail: string
  price: number
}

export const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: 'bkk-sameday',
    label: 'Bangkok Same-Day',
    detail: 'Within Bangkok metro, ordered before 2pm',
    price: 150,
  },
  {
    id: 'standard',
    label: 'Standard (Thailand Post)',
    detail: '3–5 business days, nationwide',
    price: 60,
  },
  {
    id: 'express',
    label: 'Express Courier',
    detail: '1–2 business days, nationwide',
    price: 120,
  },
  {
    id: 'intl',
    label: 'International',
    detail: '7–14 business days, worldwide',
    price: 650,
  },
]

// Free standard shipping over this Baht subtotal.
export const FREE_SHIPPING_THRESHOLD = 1500
