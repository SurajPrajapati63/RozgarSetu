import { useState } from 'react'
import { Navbar } from '../../components/common/Navbar'
import { Modal } from '../../components/common/Modal'
import { PostUploadForm } from '../../components/dashboard/worker/PostUploadForm'
import { PostManagementGrid } from '../../components/dashboard/worker/PostManagementGrid'

export default function WorkerPosts() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Worker posts</h1>
            <p className="text-sm text-slate-600">Create portfolio updates for your public profile.</p>
          </div>
          <button className="btn-primary" onClick={() => setOpen(true)}>+ Upload New Post</button>
        </div>
        <PostManagementGrid />
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Upload post">
        <PostUploadForm onSuccess={() => setOpen(false)} />
      </Modal>
    </div>
  )
}
