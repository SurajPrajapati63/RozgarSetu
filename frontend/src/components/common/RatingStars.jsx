import { Star } from 'lucide-react'

export function RatingStars({ rating = 0, count, interactive = false, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index < Math.round(rating)
        return (
          <button key={index} type="button" className={interactive ? 'p-0.5' : 'pointer-events-none'} onClick={() => interactive && onChange?.(index + 1)} aria-label={`Rate ${index + 1} stars`}>
            <Star size={16} className={filled ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} />
          </button>
        )
      })}
      {count !== undefined && <span className="ml-2 text-sm text-slate-600">{count} reviews</span>}
    </div>
  )
}
