import dotenv from 'dotenv';
dotenv.config();

console.log("MONGO_URI =", process.env.MONGO_URI); // 👈 Add this line

import http from 'http';
import app from './app.js';
import connectDB from './config/db.js';
import logger from './utils/logger.js';

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    const server = http.createServer(app);
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start', err);
    process.exit(1);
  }
};

start();