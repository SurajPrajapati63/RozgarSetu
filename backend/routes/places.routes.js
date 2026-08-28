import express from 'express';
import { autocomplete, placeDetails } from '../controllers/places.controller.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

router.get('/autocomplete', asyncHandler(autocomplete));
router.get('/details', asyncHandler(placeDetails));

export default router;
