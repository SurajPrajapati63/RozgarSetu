import express from 'express';
import asyncHandler from '../middleware/asyncHandler.js';
import * as ctrl from '../controllers/upload.controller.js';
import { uploadSingle, uploadMultiple, uploadVideo } from '../middleware/upload.middleware.js';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/image', verifyToken, (req,res,next)=> uploadSingle(req,res,err=>{ if(err) return next(err); next(); }), asyncHandler(ctrl.uploadImage));
router.post('/images', verifyToken, (req,res,next)=> uploadMultiple(req,res,err=>{ if(err) return next(err); next(); }), asyncHandler(ctrl.uploadImages));
router.post('/video', verifyToken, (req,res,next)=> uploadVideo(req,res,err=>{ if(err) return next(err); next(); }), asyncHandler(ctrl.uploadVideo));
router.delete('/', verifyToken, requireRole(['admin']), asyncHandler(ctrl.deleteFile));

export default router;
