import { useState } from 'react'

const posts = [
  { id: 1, title: 'Bathroom repair', worker: 'Aman Verma', status: 'Flagged', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=500&q=80' },
]

export function PostModerationGrid() {
  const [filter, setFilter] = useState('All')
  const filtered = filter === 'All' ? posts : posts.filter((post) => post.status === filter)

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {['All', 'Flagged', 'Approved', 'Removed'].map((value) => (
          <button key={value} className={`rounded-full px-3 py-2 text-sm font-medium ${filter === value ? 'bg-secondary text-white' : 'bg-slate-100 text-slate-700'}`} onClick={() => setFilter(value)}>{value}</button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((post) => (
          <div key={post.id} className="card">
            <img src={post.image} alt={post.title} className="mb-4 h-40 w-full rounded-xl object-cover" loading="lazy" />
            <div className="mb-2 font-semibold text-slate-900">{post.title}</div>
            <div className="mb-4 text-sm text-slate-600">{post.worker}</div>
            <div className="flex gap-2">
              <button className="btn-primary">Approve</button>
              <button className="btn-outline">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
