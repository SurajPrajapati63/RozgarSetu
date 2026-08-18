import { useEffect, useState } from 'react'
import { WORKER_CATEGORIES } from '../../utils/constants'

export function FilterSidebar({ filters, onChange }) {
  const [localFilters, setLocalFilters] = useState(filters)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const apply = () => onChange(localFilters)
  const reset = () => {
    const defaults = { category: '', city: '', rating: '', available: false }
    setLocalFilters(defaults)
    onChange(defaults)
  }

  return (
    <aside className="card space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
        <p className="text-sm text-slate-600">Refine services by category, area or rating.</p>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Category</label>
        <select value={localFilters.category} onChange={(event) => setLocalFilters({ ...localFilters, category: event.target.value })} className="input-field text-black">
          <option value="">All</option>
          {WORKER_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">City</label>
        <input value={localFilters.city} onChange={(event) => setLocalFilters({ ...localFilters, city: event.target.value })} className="input-field text-black" placeholder="Lucknow" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Minimum rating</label>
        <select value={localFilters.rating} onChange={(event) => setLocalFilters({ ...localFilters, rating: event.target.value })} className="input-field text-black">
          <option value="">Any</option>
          <option value="3">3★+</option>
          <option value="4">4★+</option>
          <option value="4.5">4.5★+</option>
        </select>
      </div>
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input type="checkbox" checked={localFilters.available} onChange={(event) => setLocalFilters({ ...localFilters, available: event.target.checked })} />
        Available now
      </label>
      <div className="flex gap-3">
        <button type="button" className="btn-primary flex-1" onClick={apply}>Apply Filters</button>
        <button type="button" className="btn-outline flex-1" onClick={reset}>Reset</button>
      </div>
    </aside>
  )
}
