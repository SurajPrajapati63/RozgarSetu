import Review from '../models/Review.model.js';
import Booking from '../models/Booking.model.js';
import Worker from '../models/Worker.model.js';
import ApiResponse from '../utils/apiResponse.js';
import mongoose from 'mongoose';
import asyncHandler from '../middleware/asyncHandler.js';

export const submitReview = asyncHandler(async (req, res) => {
  const { bookingId, rating, comment } = req.body;

  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    return ApiResponse.error(res, 'Invalid booking ID', 400);
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) return ApiResponse.error(res, 'Booking not found', 404);

  const userIdStr = String(booking.user._id || booking.user);
  if (userIdStr !== req.user.id) {
    return ApiResponse.error(res, 'Only the user who booked can review', 403);
  }

  if (booking.status !== 'completed') {
    return ApiResponse.error(res, 'Can only review completed bookings', 400);
  }

  if (booking.hasReview) {
    return ApiResponse.error(res, 'You have already reviewed this booking', 400);
  }

  const review = await Review.create({
    booking: booking._id,
    user: booking.user,
    worker: booking.worker,
    rating: Number(rating),
    comment
  });

  booking.hasReview = true;
  await booking.save();

  const populated = await Review.findById(review._id).populate('user', 'name photo');
  return ApiResponse.success(res, populated, 'Review submitted successfully', 201);
});

export const getWorkerReviews = asyncHandler(async (req, res) => {
  const { workerId } = req.params;
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);
  const skip = (page - 1) * limit;

  if (!mongoose.Types.ObjectId.isValid(workerId)) {
    return ApiResponse.error(res, 'Invalid worker ID', 400);
  }

  const [reviews, total] = await Promise.all([
    Review.find({ worker: workerId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name photo'),
    Review.countDocuments({ worker: workerId })
  ]);

  return ApiResponse.paginated(res, reviews, total, page, limit);
});

export const getWorkerRatingSummary = asyncHandler(async (req, res) => {
  const { workerId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(workerId)) {
    return ApiResponse.error(res, 'Invalid worker ID', 400);
  }

  const workerObjId = new mongoose.Types.ObjectId(workerId);
  const agg = await Review.aggregate([
    { $match: { worker: workerObjId } },
    { $group: { _id: '$rating', count: { $sum: 1 } } }
  ]);

  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let totalReviews = 0;
  let totalRatingSum = 0;

  agg.forEach(item => {
    if (item._id >= 1 && item._id <= 5) {
      breakdown[item._id] = item.count;
      totalReviews += item.count;
      totalRatingSum += item._id * item.count;
    }
  });

  const averageRating = totalReviews > 0 ? Number((totalRatingSum / totalReviews).toFixed(1)) : 0;

  return ApiResponse.success(res, {
    averageRating,
    totalReviews,
    breakdown
  });
});

export default { submitReview, getWorkerReviews, getWorkerRatingSummary };
