import { useState } from 'react'
import { uploadSingleImage } from '../api/uploadApi'
import toast from 'react-hot-toast'

export function useFileUpload() {
  const [loading, setLoading] = useState(false)

  const upload = async (file) => {
    setLoading(true)
    try {
      const response = await uploadSingleImage(file)
      toast.success('Upload complete')
      return response?.data || response
    } catch (error) {
      toast.error(error?.response?.data?.message || 'File upload failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { upload, loading }
}
