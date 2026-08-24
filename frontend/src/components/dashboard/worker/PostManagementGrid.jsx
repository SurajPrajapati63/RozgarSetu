import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getWorkerPosts, deletePost } from '../../../api/postApi'
import { useAuthStore } from '../../../store/authStore'
import { ConfirmDialog } from '../../common/ConfirmDialog'
import { Trash2 } from 'lucide-react'
import { formatDate } from '../../../utils/formatters'
import toast from 'react-hot-toast'

export function PostManagementGrid() {
  const user = useAuthStore((state) => state.user)
  const workerId = user?.id || user?._id
  const queryClient = useQueryClient()
  const [selectedPostId, setSelectedPostId] = useState(null)

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['workerPosts', workerId],
    queryFn: () => getWorkerPosts(workerId),
    enabled: Boolean(workerId),
  })

  const posts = response?.data || []

  const deleteMutation = useMutation({
    mutationFn: (id) => deletePost(id),
    onSuccess: () => {
      toast.success('Portfolio post removed')
      queryClient.invalidateQueries({ queryKey: ['workerPosts'] })
      setSelectedPostId(null)
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to delete post')
      setSelectedPostId(null)
    },
  })

  if (isLoading) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">Loading portfolio posts...</div>
  }

  if (isError || posts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <p className="text-base font-semibold text-slate-800">No portfolio posts uploaded yet</p>
        <p className="mt-1 text-sm text-slate-500">Upload photos or videos of your past work to build trust with clients.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {posts.map((post) => {
        const firstMedia = post.media?.[0]
        return (
          <div key={post._id || post.id} className="card flex flex-col justify-between overflow-hidden">
            <div>
              {firstMedia ? (
                firstMedia.type === 'video' ? (
                  <video src={firstMedia.url} className="mb-4 h-44 w-full rounded-xl object-cover" controls />
                ) : (
                  <img src={firstMedia.url} alt={post.title} className="mb-4 h-44 w-full rounded-xl object-cover" loading="lazy" />
                )
              ) : (
                <div className="mb-4 flex h-44 w-full items-center justify-center rounded-xl bg-slate-100 font-semibold text-slate-400">No Media</div>
              )}
              <h3 className="font-bold text-slate-900 text-lg">{post.title}</h3>
              {post.category && <span className="mt-1 inline-block rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600">{post.category}</span>}
              <p className="mt-2 text-sm text-slate-600 line-clamp-3">{post.description}</p>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-xs font-medium text-slate-400">{formatDate(post.createdAt)}</span>
              <button
                type="button"
                className="btn-outline border-red-200 text-xs text-red-600 hover:border-red-300 hover:bg-red-50 flex items-center gap-1.5"
                onClick={() => setSelectedPostId(post._id || post.id)}
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        )
      })}
      <ConfirmDialog
        open={Boolean(selectedPostId)}
        title="Delete portfolio post"
        message="Are you sure you want to permanently remove this post? This action cannot be undone."
        onCancel={() => setSelectedPostId(null)}
        onConfirm={() => selectedPostId && deleteMutation.mutate(selectedPostId)}
      />
    </div>
  )
}
