import { WORKER_CATEGORIES } from '../../utils/constants'
import { MenuBar } from './MenuBar'

export function CategoryFilter({ selected, onSelect, filters, onFiltersChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {WORKER_CATEGORIES.map((category) => {
        const active = selected === category
        return (
          <div key={category} className="flex items-center gap-2">
            <button type="button" onClick={() => onSelect(category)} className={`rounded-full px-3 py-2 text-sm font-medium ${active ? 'bg-secondary text-white' : 'bg-slate-100 text-slate-700'}`}>
              {category}
            </button>
            {category === 'Others' && <MenuBar filters={filters} onFiltersChange={onFiltersChange} />}
          </div>
        )
      })}
    </div>
  )
}
