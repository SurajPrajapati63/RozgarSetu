import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { postSchema } from '../../../utils/validators'
import { createPost } from '../../../api/postApi'
import { useQueryClient } from '@tanstack/react-query'
import { WORKER_CATEGORIES } from '../../../utils/constants'
import { ImagePlus, Upload, X } from 'lucide-react'
import toast from 'react-hot-toast'

export function PostUploadForm({ onSuccess }) {
  const queryClient = useQueryClient()
  const [selectedFiles, setSelectedFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [isUploading, setIsUploading] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(postSchema),
  })

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    const combinedFiles = [...selectedFiles, ...files].slice(0, 5)
    setSelectedFiles(combinedFiles)

    const newPreviews = combinedFiles.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image',
      name: file.name,
    }))
    setPreviews(newPreviews)
  }

  const removeFile = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(updatedFiles)

    const updatedPreviews = previews.filter((_, i) => i !== index)
    setPreviews(updatedPreviews)
  }

  const onSubmit = async (values) => {
    if (selectedFiles.length === 0) {
      toast.error('Please attach at least one image or video for your portfolio post')
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('title', values.title)
      formData.append('description', values.description || '')
      formData.append('category', values.category)
      selectedFiles.forEach((file) => formData.append('media', file))

      await createPost(formData)
      toast.success('Portfolio post published successfully!')
      queryClient.invalidateQueries({ queryKey: ['workerPosts'] })
      reset()
      setSelectedFiles([])
      setPreviews([])
      onSuccess?.()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to upload post')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">Project Title</label>
        <input {...register('title')} placeholder="e.g. Full Kitchen Cabinet Installation" className="input-field" />
        {errors.title && <p className="mt-1 text-xs font-medium text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">Category Tag</label>
        <select {...register('category')} className="input-field">
          <option value="">Select Category</option>
          {WORKER_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && <p className="mt-1 text-xs font-medium text-red-600">{errors.category.message}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">Description</label>
        <textarea {...register('description')} placeholder="Tell clients about the materials used, work done, or time taken..." className="input-field min-h-24" />
        {errors.description && <p className="mt-1 text-xs font-medium text-red-600">{errors.description.message}</p>}
      </div>

      {/* Media Upload Area */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">Upload Photos / Videos (Max 5)</label>
        <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center">
          <input type="file" accept="image/*,video/*" multiple onChange={handleFileChange} className="hidden" id="post-media-input" />
          <label htmlFor="post-media-input" className="cursor-pointer inline-flex flex-col items-center gap-1.5 text-slate-600 hover:text-blue-600">
            <ImagePlus size={28} className="text-blue-500" />
            <span className="text-sm font-medium">Click to select media files</span>
            <span className="text-xs text-slate-400">JPG, PNG, WEBP, MP4 supported</span>
          </label>
        </div>

        {/* Media Previews */}
        {previews.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {previews.map((item, index) => (
              <div key={index} className="relative h-20 w-20 overflow-hidden rounded-lg border border-slate-200 bg-black">
                {item.type === 'video' ? (
                  <video src={item.url} className="h-full w-full object-cover" />
                ) : (
                  <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute right-1 top-1 rounded-full bg-slate-900/80 p-1 text-white hover:bg-red-600"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-2">
        <button type="submit" disabled={isUploading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-70">
          <Upload size={16} />
          {isUploading ? 'Publishing...' : 'Publish Post'}
        </button>
      </div>
    </form>
  )
}
