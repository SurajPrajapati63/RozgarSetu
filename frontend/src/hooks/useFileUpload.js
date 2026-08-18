import { useState } from 'react'
import toast from 'react-hot-toast'

export function useFileUpload() {
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)

  const upload = async (file) => {
    setLoading(true)
    setProgress(10)
    try {
      await new Promise((resolve) => setTimeout(resolve, 700))
      setProgress(100)
      toast.success('Upload complete')
      return { url: URL.createObjectURL(file) }
    } finally {
      setLoading(false)
    }
  }

  return { upload, progress, loading }
}
