import { Search } from 'lucide-react'
import { WORKER_CATEGORIES } from '../../utils/constants'

export function SearchBar({ onSearch }) {
  return (
    <form className="grid gap-3 md:grid-cols-[2fr_1fr_auto]" onSubmit={(event) => {
      event.preventDefault()
      const form = event.currentTarget
      const formData = new FormData(form)
      onSearch?.({ city: formData.get('city') || '', category: formData.get('category') || '' })
    }}>
      <input name="city" placeholder="City or area" className="input-field bg-white text-black" />
      <select name="category" className="input-field bg-white text-black">
        <option value="">All categories</option>
        {WORKER_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
      </select>
      <button type="submit" className="btn-primary inline-flex items-center justify-center gap-2 bg-white text-primary hover:bg-slate-100">
        <Search size={16} /> Search
      </button>
    </form>
  )
}
