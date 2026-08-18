import Booking from '../models/Booking.model.js';
import Worker from '../models/Worker.model.js';
import ApiResponse from '../utils/apiResponse.js';
import { generateBookingID } from '../utils/generateWorkerID.js';
import mongoose from 'mongoose';
import asyncHandler from '../middleware/asyncHandler.js';

const preventBookingResponseCaching = (res) => {
  res.set('Cache-Control', 'no-store, private, max-age=0');
  res.set('Pragma', 'no-cache');
};

export const createBooking = asyncHandler(async (req, res) => {
  const { workerId, serviceDate, serviceDescription, contactNumber, amount } = req.body;
  if (!mongoose.Types.ObjectId.isValid(workerId)) {
    return ApiResponse.error(res, 'Invalid worker ID', 400);
  }
  
  const worker = await Worker.findById(workerId);
  if (!worker || !['active', 'pending'].includes(worker.status)) {
    return ApiResponse.error(res, 'Worker is currently not available for booking', 400);
  }

  const bookingID = await generateBookingID();
  const booking = await Booking.create({
    bookingID,
    user: req.user.id,
    worker: workerId,
    serviceDate,
    serviceDescription,
    contactNumber,
    amount: amount || worker.pricePerDay
  });

  const populated = await Booking.findById(booking._id)
    .populate('worker', 'name workerID category photo pricePerDay mobile city address')
    .populate('user', 'name mobile photo address');

  return ApiResponse.success(res, populated, 'Booking request created successfully', 201);
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = { user: req.user.id };
  if (status && status !== 'all') filter.status = status;

  const bookings = await Booking.find(filter)
    .sort({ createdAt: -1 })
    .populate('worker', 'name workerID category photo pricePerDay mobile city address rating reviewCount');

  preventBookingResponseCaching(res);
  return ApiResponse.success(res, bookings);
});

export const getWorkerBookings = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = { worker: req.user.id };
  if (status && status !== 'all') filter.status = status;

  const bookings = await Booking.find(filter)
    .sort({ createdAt: -1 })
    .populate('user', 'name mobile photo address email');

  preventBookingResponseCaching(res);
  return ApiResponse.success(res, bookings);
});

export const getBookingById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return ApiResponse.error(res, 'Invalid booking ID', 400);
  }

  const booking = await Booking.findById(id)
    .populate('user', 'name mobile email photo address')
    .populate('worker', 'name workerID category photo pricePerDay mobile city address rating');

  if (!booking) return ApiResponse.error(res, 'Booking not found', 404);

  // Allow access to user, worker, or admin
  const userIdStr = String(booking.user?._id || booking.user);
  const workerIdStr = String(booking.worker?._id || booking.worker);
  
  if (userIdStr !== req.user.id && workerIdStr !== req.user.id && req.user.role !== 'admin') {
    return ApiResponse.error(res, 'Unauthorized to view this booking', 403);
  }

  return ApiResponse.success(res, booking);
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { status, cancelReason } = req.body;

  const booking = await Booking.findById(id);
  if (!booking) return ApiResponse.error(res, 'Booking not found', 404);

  if (String(booking.worker) !== req.user.id) {
    return ApiResponse.error(res, 'Only the assigned worker can update booking status', 403);
  }

  const allowedStatuses = ['accepted', 'rejected', 'completed'];
  if (!allowedStatuses.includes(status)) {
    return ApiResponse.error(res, 'Invalid status update', 400);
  }

  booking.status = status;
  if (status === 'rejected') {
    booking.cancelReason = cancelReason || 'Rejected by worker';
    booking.cancelledBy = 'worker';
  }

  await booking.save();

  const updated = await Booking.findById(id)
    .populate('user', 'name mobile photo address')
    .populate('worker', 'name workerID category photo');

  return ApiResponse.success(res, updated, `Booking marked as ${status}`);
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { cancelReason } = req.body;

  const booking = await Booking.findById(id);
  if (!booking) return ApiResponse.error(res, 'Booking not found', 404);

  const userIdStr = String(booking.user._id || booking.user);
  if (userIdStr !== req.user.id && req.user.role !== 'admin') {
    return ApiResponse.error(res, 'Unauthorized to cancel this booking', 403);
  }

  if (!['pending', 'accepted'].includes(booking.status)) {
    return ApiResponse.error(res, `Cannot cancel a booking with status '${booking.status}'`, 400);
  }

  booking.status = 'cancelled';
  booking.cancelReason = cancelReason || 'Cancelled by user';
  booking.cancelledBy = req.user.role === 'admin' ? 'admin' : 'user';

  await booking.save();
  return ApiResponse.success(res, booking, 'Booking cancelled successfully');
});

export const getAllBookings = asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  const filter = {};
  if (status && status !== 'all') filter.status = status;
  if (search) {
    filter.bookingID = new RegExp(search, 'i');
  }

  const bookings = await Booking.find(filter)
    .sort({ createdAt: -1 })
    .populate('user', 'name mobile email photo')
    .populate('worker', 'name workerID category photo mobile');

  return ApiResponse.success(res, bookings);
});

export default { createBooking, getMyBookings, getWorkerBookings, getBookingById, updateBookingStatus, cancelBooking, getAllBookings };
