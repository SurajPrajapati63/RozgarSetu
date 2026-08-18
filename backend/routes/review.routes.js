import express from 'express';
import asyncHandler from '../middleware/asyncHandler.js';
import * as ctrl from '../controllers/review.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import { reviewSchema } from '../validations/review.validation.js';

const router = express.Router();

router.post('/', verifyToken, validate(reviewSchema), asyncHandler(ctrl.submitReview));
router.get('/worker/:workerId', asyncHandler(ctrl.getWorkerReviews));
router.get('/worker/:workerId/summary', asyncHandler(ctrl.getWorkerRatingSummary));

export default router;
