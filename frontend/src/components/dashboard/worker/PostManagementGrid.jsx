import { useState } from 'react'
import { ConfirmDialog } from '../../common/ConfirmDialog'

const posts = [
  { id: 1, title: 'Bathroom fitting', date: 'Jun 20', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=500&q=80' },
  { id: 2, title: 'Kitchen repair', date: 'Jun 16', image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=500&q=80' },
]

export function PostManagementGrid() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {posts.map((post) => (
        <div key={post.id} className="card">
          <img src={post.image} alt={post.title} className="mb-4 h-40 w-full rounded-xl object-cover" loading="lazy" />
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-900">{post.title}</div>
              <div className="text-sm text-slate-500">{post.date}</div>
            </div>
            <div className="flex gap-2">
              <button className="btn-outline">Edit</button>
              <button className="btn-primary" onClick={() => setSelected(post.id)}>Delete</button>
            </div>
          </div>
        </div>
      ))}
      <ConfirmDialog open={Boolean(selected)} title="Delete post" message="Are you sure you want to remove this post?" onCancel={() => setSelected(null)} onConfirm={() => setSelected(null)} />
    </div>
  )
}
