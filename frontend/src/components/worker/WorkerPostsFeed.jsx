import { useState } from 'react'
import { Modal } from '../common/Modal'

export function WorkerPostsFeed({ posts }) {
  const [activePost, setActivePost] = useState(null)

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <button key={post.id} onClick={() => setActivePost(post)} className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm">
            <img src={post.image} alt={post.title} className="h-40 w-full object-cover" loading="lazy" />
            <div className="p-4">
              <div className="font-semibold text-slate-900">{post.title}</div>
              <div className="mt-1 text-sm text-slate-600">{post.date}</div>
            </div>
          </button>
        ))}
      </div>
      <Modal open={Boolean(activePost)} onClose={() => setActivePost(null)} title={activePost?.title || 'Work Portfolio'}>
        {activePost && (
          <div className="space-y-3">
            <img src={activePost.image} alt={activePost.title} className="h-72 w-full rounded-xl object-cover" loading="lazy" />
            <p className="text-sm text-slate-600">{activePost.description}</p>
          </div>
        )}
      </Modal>
    </div>
  )
}
