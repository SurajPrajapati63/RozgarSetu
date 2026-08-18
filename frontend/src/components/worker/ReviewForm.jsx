import { useState } from 'react'
import { RatingStars } from '../common/RatingStars'

export function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')

  return (
    <div className="card space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Write a review</h3>
      <RatingStars rating={rating} interactive onChange={setRating} />
      <textarea value={text} onChange={(event) => setText(event.target.value)} className="input-field min-h-24" placeholder="Share your experience" />
      <button className="btn-primary" onClick={() => onSubmit({ rating, text })}>Submit Review</button>
    </div>
  )
}
