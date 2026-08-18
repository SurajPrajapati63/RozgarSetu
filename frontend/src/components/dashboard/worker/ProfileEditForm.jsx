import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema } from '../../../utils/validators'
import { WORKER_CATEGORIES } from '../../../utils/constants'
import { removeProfilePhoto, updateAvailability, updateProfile, uploadProfilePhoto } from '../../../api/workerApi'
import { useAuthStore } from '../../../store/authStore'
import { Modal } from '../../common/Modal'
import toast from 'react-hot-toast'

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function ProfileEditForm({ onSaved }) {
  const user = useAuthStore((state) => state.user)
  const updateUser = useAuthStore((state) => state.updateUser)
  const photoInputRef = useRef(null)
  const [photoPreview, setPhotoPreview] = useState(user?.photo || '')
  const [isSaving, setIsSaving] = useState(false)
  const [photoViewerOpen, setPhotoViewerOpen] = useState(false)
  const [isPhotoEditing, setIsPhotoEditing] = useState(false)
  const [isRemovingPhoto, setIsRemovingPhoto] = useState(false)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const [availableDays, setAvailableDays] = useState(user?.availability?.days || ['Mon', 'Tue', 'Wed'])

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      price: user?.pricePerDay || user?.price || 500,
      experience: user?.experience || 0,
      city: user?.city || '',
      state: user?.state || '',
      bio: user?.bio || '',
      category: user?.category || 'Others',
    },
  })

  useEffect(() => {
    reset({
      name: user?.name || '',
      price: user?.pricePerDay || user?.price || 500,
      experience: user?.experience || 0,
      city: user?.city || '',
      state: user?.state || '',
      bio: user?.bio || '',
      category: user?.category || 'Others',
    })
    setPhotoPreview(user?.photo || '')
    setAvailableDays(user?.availability?.days || ['Mon', 'Tue', 'Wed'])
  }, [user, reset])

  const onSubmit = async (values) => {
    setIsSaving(true)
    try {
      const updatedWorker = await updateProfile({
        name: values.name,
        bio: values.bio,
        city: values.city,
        state: values.state,
        category: values.category,
        pricePerDay: Number(values.price),
        experience: Number(values.experience),
      })

      const availabilityResponse = await updateAvailability({
        days: availableDays,
        isAvailableNow: user?.availability?.isAvailableNow ?? true,
      })

      updateUser({
        ...(updatedWorker?.data || updatedWorker),
        availability: availabilityResponse?.data || availabilityResponse,
        profileCompleted: true,
      })
      toast.success('Profile saved successfully')
      onSaved?.()
      setSelectedPhoto(null)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not save profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleRemovePhoto = async () => {
    setIsRemovingPhoto(true)
    try {
      await removeProfilePhoto()
      updateUser({ ...user, photo: null, photoPublicId: null })
      setPhotoPreview('')
      setIsPhotoEditing(false)
      toast.success('Profile photo removed')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not remove profile photo')
    } finally {
      setIsRemovingPhoto(false)
    }
  }

  const handlePhotoSelection = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploadingPhoto(true)
    try {
      const response = await uploadProfilePhoto(file)
      const photo = response?.data?.photo || response?.photo
      const photoPublicId = response?.data?.photoPublicId || response?.photoPublicId
      if (!photo) throw new Error('The photo upload did not return an image')

      setPhotoPreview(photo)
      updateUser({ ...user, photo, photoPublicId })
      toast.success('Profile photo updated')
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || 'Could not upload profile photo')
    } finally {
      event.target.value = ''
      setIsUploadingPhoto(false)
    }
  }

  return (
    <form className="card space-y-4" onSubmit={handleSubmit(onSubmit)}>
      

      <div className="flex flex-col items-center gap-3">
        <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoSelection} />
        <div className="relative">
          <button
            type="button"
            className="group relative flex cursor-zoom-in items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
            onClick={() => photoPreview ? setPhotoViewerOpen(true) : photoInputRef.current?.click()}
            aria-label={photoPreview ? 'View profile photo' : 'Add profile photo'}
          >
            {photoPreview ? (
              <img src={photoPreview} alt="Profile preview" className="h-28 w-28 rounded-full object-cover border-4 border-white shadow-md transition-transform duration-200 group-hover:scale-105" />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-white text-sm font-medium text-slate-500">
                No photo
              </div>
            )}
          </button>
          <button
            type="button"
            className="absolute bottom-0 right-0 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
            onClick={() => {
              setIsPhotoEditing(true)
              photoInputRef.current?.click()
            }}
            disabled={isUploadingPhoto}
          >
            {isUploadingPhoto ? 'Uploading...' : 'Edit photo'}
          </button>
        </div>
        {isPhotoEditing && (
          <div className="flex flex-wrap justify-center gap-2">
            {user?.photo && (
              <button type="button" className="btn-outline border-red-200 text-sm text-red-600 hover:border-red-300 hover:bg-red-50" onClick={handleRemovePhoto} disabled={isRemovingPhoto}>
                {isRemovingPhoto ? 'Removing...' : 'Remove photo'}
              </button>
            )}
          </div>
        )}
      </div>

      <Modal open={photoViewerOpen} onClose={() => setPhotoViewerOpen(false)} title="Profile photo">
        {photoPreview && <img src={photoPreview} alt="Profile preview" className="max-h-[70vh] w-full rounded-xl object-contain" />}
      </Modal>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
          <input {...register('name')} className="input-field" />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Category</label>
          <select {...register('category')} className="input-field">
            {WORKER_CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Price per day</label>
          <input type="number" {...register('price')} className="input-field" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Experience (years)</label>
          <input type="number" min="0" {...register('experience')} className="input-field" />
          {errors.experience && <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">City</label>
          <input {...register('city')} className="input-field" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">State</label>
          <input {...register('state')} className="input-field" />
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Bio</label>
        <textarea {...register('bio')} className="input-field min-h-24" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Weekly availability</label>
        <div className="flex flex-wrap gap-2">
          {WEEK_DAYS.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => setAvailableDays((days) => days.includes(day) ? days.filter((item) => item !== day) : [...days, day])}
              className={`rounded-full px-3 py-2 text-sm font-medium ${availableDays.includes(day) ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
      <button type="submit" className="btn-primary" disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save'}
      </button>
    </form>
  )
}
