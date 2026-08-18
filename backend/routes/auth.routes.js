import express from 'express';
import * as ctrl from '../controllers/auth.controller.js';
import validate from '../middleware/validate.middleware.js';
import { loginLimiter } from '../middleware/rateLimiter.middleware.js';
import { userSignupSchema, userLoginSchema, workerSignupSchema, workerLoginSchema, adminLoginSchema, unifiedLoginSchema } from '../validations/auth.validation.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/user/signup', validate(userSignupSchema), asyncHandler(ctrl.userSignup));
router.post('/login', loginLimiter, validate(unifiedLoginSchema), asyncHandler(ctrl.login));
router.post('/user/login', loginLimiter, validate(userLoginSchema), asyncHandler(ctrl.userLogin));
router.post('/worker/signup', validate(workerSignupSchema), asyncHandler(ctrl.workerSignup));
router.post('/worker/login', loginLimiter, validate(workerLoginSchema), asyncHandler(ctrl.workerLogin));
router.post('/admin/login', loginLimiter, validate(adminLoginSchema), asyncHandler(ctrl.adminLogin));
router.post('/refresh-token', asyncHandler(ctrl.refreshToken));
router.post('/logout', verifyToken, asyncHandler(ctrl.logout));

export default router;
