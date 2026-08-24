import { useState } from 'react'
import { RatingStars } from '../common/RatingStars'
import toast from 'react-hot-toast'

export function ReviewForm({ onSubmit, isSubmitting = false }) {
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')

  const handleSubmit = () => {
    if (!text.trim()) {
      toast.error('Please write a brief comment describing your experience.')
      return
    }
    onSubmit({ rating, text })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-2 rounded-xl bg-slate-50 p-4 border border-slate-100">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Your Rating</span>
        <RatingStars rating={rating} interactive onChange={setRating} />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">Your Feedback / Review</label>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          className="w-full rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-blue-500 min-h-24"
          placeholder="Share your experience working with this professional..."
        />
      </div>
      <button
        type="button"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-blue-600 py-2.5 font-semibold text-white shadow-md hover:bg-blue-700 disabled:opacity-70"
        onClick={handleSubmit}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </div>
  )
}
