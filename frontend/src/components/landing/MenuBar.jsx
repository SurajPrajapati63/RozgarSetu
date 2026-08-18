import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { FilterSidebar } from './FilterSidebar'

export function MenuBar({ filters, onFiltersChange }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
        aria-expanded={open}
      >
        <SlidersHorizontal size={15} />
        Filter
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-[min(20rem,calc(100vw-2rem))]">
          <FilterSidebar filters={filters} onChange={(nextFilters) => {
            onFiltersChange(nextFilters)
            setOpen(false)
          }} />
        </div>
      )}
    </div>
  )
}

export default MenuBar
