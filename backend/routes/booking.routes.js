import express from 'express';
import asyncHandler from '../middleware/asyncHandler.js';
import * as ctrl from '../controllers/booking.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import { createBookingSchema, statusUpdateSchema } from '../validations/booking.validation.js';

const router = express.Router();

router.post('/', verifyToken, requireRole(['user']), validate(createBookingSchema), asyncHandler(ctrl.createBooking));
router.get('/my', verifyToken, requireRole(['user']), asyncHandler(ctrl.getMyBookings));
router.get('/worker', verifyToken, requireRole(['worker']), asyncHandler(ctrl.getWorkerBookings));
router.get('/all', verifyToken, requireRole(['admin']), asyncHandler(ctrl.getAllBookings));
router.get('/:id', verifyToken, asyncHandler(ctrl.getBookingById));
router.patch('/:id/status', verifyToken, requireRole(['worker']), validate(statusUpdateSchema), asyncHandler(ctrl.updateBookingStatus));
router.patch('/:id/cancel', verifyToken, requireRole(['user']), asyncHandler(ctrl.cancelBooking));

export default router;
