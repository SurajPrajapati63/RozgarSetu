import logger from '../utils/logger.js';

function errorHandler(err, req, res, next) {
  logger.error(err.stack || err.message || err);
  if (err.name === 'CastError') return res.status(400).json({ success: false, message: 'Invalid ID' });
  if (err.name === 'ValidationError') return res.status(400).json({ success: false, message: err.message });
  if (err.code === 11000) return res.status(409).json({ success: false, message: 'Already exists', errors: err.keyValue });
  if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') return res.status(401).json({ success: false, message: 'Invalid token' });
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ success: false, message: 'File too large' });
  const status = err.statusCode || 500;
  const resp = { success: false, message: err.message || 'Internal server error' };
  if (process.env.NODE_ENV !== 'production') resp.stack = err.stack;
  res.status(status).json(resp);
}

export default errorHandler;
