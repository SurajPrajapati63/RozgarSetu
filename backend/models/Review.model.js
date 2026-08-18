import mongoose from 'mongoose';
const { Schema } = mongoose;

const ReviewSchema = new Schema({
  booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  worker: { type: Schema.Types.ObjectId, ref: 'Worker', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, maxlength: 500 }
}, { timestamps: true });

ReviewSchema.index({ worker: 1 });
ReviewSchema.index({ user: 1 });

async function recalculateWorkerRating(workerId) {
  const Worker = mongoose.model('Worker');
  const Review = mongoose.model('Review');
  const reviews = await Review.find({ worker: workerId });
  if (reviews.length === 0) {
    await Worker.findByIdAndUpdate(workerId, { rating: 0, reviewCount: 0 });
  } else {
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avg = Number((total / reviews.length).toFixed(1));
    await Worker.findByIdAndUpdate(workerId, { rating: avg, reviewCount: reviews.length });
  }
}

ReviewSchema.post('save', async function () {
  await recalculateWorkerRating(this.worker);
});

ReviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await recalculateWorkerRating(doc.worker);
  }
});

export default mongoose.model('Review', ReviewSchema);
