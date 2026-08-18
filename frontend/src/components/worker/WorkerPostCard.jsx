export function WorkerPostCard({ post }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <img src={post.image} alt={post.title} className="h-40 w-full object-cover" loading="lazy" />
      <div className="p-4">
        <div className="font-semibold text-slate-900">{post.title}</div>
        <div className="mt-1 text-sm text-slate-600">{post.date}</div>
      </div>
    </div>
  )
}
