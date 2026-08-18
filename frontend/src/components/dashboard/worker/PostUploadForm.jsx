import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { postSchema } from '../../../utils/validators'

export function PostUploadForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(postSchema) })

  return (
    <form className="space-y-4" onSubmit={handleSubmit((values) => console.log(values))}>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Title</label>
        <input {...register('title')} className="input-field" />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
        <textarea {...register('description')} className="input-field min-h-24" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Category tag</label>
        <input {...register('category')} className="input-field" />
      </div>
      <button type="submit" className="btn-primary">Upload</button>
    </form>
  )
}
