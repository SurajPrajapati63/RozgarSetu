import { CheckCircle2, Clock3, AlertCircle, BadgeCheck } from 'lucide-react'

export function Badge({ status, variant = 'default' }) {
  const styles = {
    default: 'bg-slate-100 text-slate-700',
    verified: 'bg-green-100 text-green-700',
    pending: 'bg-amber-100 text-amber-700',
    active: 'bg-primary/10 text-primary',
    danger: 'bg-red-100 text-red-700',
  }

  const icons = {
    verified: <BadgeCheck size={12} />,
    pending: <Clock3 size={12} />,
    active: <CheckCircle2 size={12} />,
    danger: <AlertCircle size={12} />,
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[variant] || styles.default}`}>
      {icons[variant]}
      {status}
    </span>
  )
}
