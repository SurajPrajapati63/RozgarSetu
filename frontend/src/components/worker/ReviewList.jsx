import { RatingStars } from '../common/RatingStars'

export function ReviewList({ reviews }) {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="font-semibold text-slate-900">{review.user}</div>
            <div className="text-sm text-slate-500">{review.date}</div>
          </div>
          <RatingStars rating={review.rating} />
          <p className="mt-2 text-sm text-slate-600">{review.text}</p>
        </div>
      ))}
    </div>
  )
}
