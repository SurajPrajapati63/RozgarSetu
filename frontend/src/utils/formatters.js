import { format } from 'date-fns'

export function formatDate(value, pattern = 'dd MMM yyyy') {
  if (!value) return '—'
  return format(new Date(value), pattern)
}

export function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`
}

export function formatWorkerID(value) {
  return value ? value.toUpperCase() : 'WRK-2024-0001'
}

export function formatRating(value) {
  return Number(value || 0).toFixed(1)
}

export function truncateText(text, length = 70) {
  if (!text) return ''
  return text.length > length ? `${text.slice(0, length)}...` : text
}
