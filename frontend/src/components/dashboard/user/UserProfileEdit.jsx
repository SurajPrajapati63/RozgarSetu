import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../../../store/authStore'
import { getProfile, updateProfile, uploadUserPhoto } from '../../../api/userApi'
import { Modal } from '../../common/Modal'
import { Camera, User, Lock, MapPin, Phone, Mail } from 'lucide-react'
import toast from 'react-hot-toast'

export function UserProfileEdit() {
  const user = useAuthStore((state) => state.user)
  const updateUser = useAuthStore((state) => state.updateUser)
  const photoInputRef = useRef(null)
  const [photoPreview, setPhotoPreview] = useState(user?.photo || '')
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const [photoViewerOpen, setPhotoViewerOpen] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      address: user?.address || '',
      newPassword: '',
    },
  })

  useEffect(() => {
    const fetchLatestProfile = async () => {
      try {
        const response = await getProfile()
        const latest = response?.data || response
        if (latest) {
          updateUser(latest)
          reset({
            name: latest.name || '',
            email: latest.email || '',
            address: latest.address || '',
            newPassword: '',
          })
          setPhotoPreview(latest.photo || '')
        }
      } catch {
        // Fall back to stored user data
      }
    }
    fetchLatestProfile()
  }, [reset, updateUser])

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        address: user.address || '',
        newPassword: '',
      })
      setPhotoPreview(user.photo || '')
    }
  }, [user, reset])

  const onSubmit = async (values) => {
    setIsSaving(true)
    try {
      const payload = {
        name: values.name,
        email: values.email || null,
        address: values.address,
      }
      if (values.newPassword) {
        if (values.newPassword.length < 8) {
          toast.error('New password must be at least 8 characters')
          setIsSaving(false)
          return
        }
        payload.password = values.newPassword
      }

      const response = await updateProfile(payload)
      const updated = response?.data || response
      updateUser(updated)
      toast.success('Profile saved successfully!')
      reset({
        name: updated.name || '',
        email: updated.email || '',
        address: updated.address || '',
        newPassword: '',
      })
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePhotoSelection = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploadingPhoto(true)
    try {
      const response = await uploadUserPhoto(file)
      const photo = response?.data?.photo || response?.photo
      if (!photo) throw new Error('Photo upload did not return an image URL')

      setPhotoPreview(photo)
      updateUser({ photo })
      toast.success('Profile photo updated!')
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || 'Could not upload profile photo')
    } finally {
      event.target.value = ''
      setIsUploadingPhoto(false)
    }
  }

  return (
    <form className="card space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {/* Profile Photo Header */}
      <div className="flex flex-col items-center gap-3 border-b border-slate-100 pb-6">
        <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoSelection} />
        <div className="relative">
          <button
            type="button"
            className="group relative flex cursor-zoom-in items-center justify-center rounded-full focus:outline-none"
            onClick={() => photoPreview ? setPhotoViewerOpen(true) : photoInputRef.current?.click()}
            aria-label="Profile photo"
          >
            {photoPreview ? (
              <img src={photoPreview} alt={user?.name || 'User photo'} className="h-28 w-28 rounded-full object-cover border-4 border-white shadow-md transition-transform group-hover:scale-105" />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-slate-100 text-2xl font-bold text-slate-500">
                {user?.name?.charAt(0)?.toUpperCase() || <User size={36} />}
              </div>
            )}
          </button>
          <button
            type="button"
            className="absolute bottom-0 right-0 rounded-full bg-blue-600 p-2 text-white shadow-md hover:bg-blue-700 focus:outline-none"
            onClick={() => photoInputRef.current?.click()}
            disabled={isUploadingPhoto}
            title="Upload photo"
          >
            <Camera size={16} />
          </button>
        </div>
        <p className="text-xs text-slate-500">
          {isUploadingPhoto ? 'Uploading photo...' : 'Click avatar to view, camera to change photo'}
        </p>
      </div>

      <Modal open={photoViewerOpen} onClose={() => setPhotoViewerOpen(false)} title="Profile photo">
        {photoPreview && <img src={photoPreview} alt="Profile photo" className="max-h-[70vh] w-full rounded-xl object-contain" />}
      </Modal>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
            <User size={14} /> Full Name
          </label>
          <input
            {...register('name', { required: 'Name is required' })}
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
          {errors.name && <p className="mt-1 text-xs font-medium text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
            <Phone size={14} /> Mobile Number
          </label>
          <input
            value={user?.mobile || ''}
            disabled
            className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
          />
          <p className="mt-1 text-[11px] text-slate-400">Mobile number is fixed to your account.</p>
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
            <Mail size={14} /> Email Address (Optional)
          </label>
          <input
            type="email"
            placeholder="e.g. user@example.com"
            {...register('email')}
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
            <Lock size={14} /> New Password (Optional)
          </label>
          <input
            type="password"
            placeholder="Leave blank to keep unchanged"
            {...register('newPassword')}
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
          <MapPin size={14} /> Full Address
        </label>
        <textarea
          rows={3}
          {...register('address', { required: 'Address is required' })}
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
        {errors.address && <p className="mt-1 text-xs font-medium text-red-600">{errors.address.message}</p>}
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-blue-600 px-6 py-2.5 font-semibold text-white shadow-md transition-all hover:bg-blue-700 disabled:opacity-70"
        >
          {isSaving ? 'Saving Changes...' : 'Save Profile'}
        </button>
      </div>
    </form>
  )
}

