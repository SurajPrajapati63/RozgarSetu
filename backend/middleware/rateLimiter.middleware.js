import rateLimit from 'express-rate-limit';

export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { success: false, message: 'Too many OTP requests from this IP, please try again after 15 minutes' }
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.LOGIN_RATE_LIMIT_MAX || '10', 10),
  message: { success: false, message: 'Too many login attempts, please try again after 15 minutes' }
});

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  // Dashboard and listing reads are safe to repeat and should not prevent a
  // worker from seeing their booking requests.
  skip: (req) => req.method === 'GET' || req.method === 'HEAD',
  message: { success: false, message: 'Too many requests, please slow down' }
});

export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { success: false, message: 'Admin rate limit exceeded' }
});

export default { otpLimiter, loginLimiter, generalLimiter, adminLimiter };
