import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import app from './app.js';
import connectDB from './config/db.js';
import logger from './utils/logger.js';

const DEFAULT_PORT = Number(process.env.PORT || 5000);

const startServer = (port, maxAttempts = 10) => new Promise((resolve, reject) => {
  const server = http.createServer(app);
  const tryListen = (candidatePort, attempt = 1) => {
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE' && attempt < maxAttempts) {
        const nextPort = candidatePort + 1;
        console.warn(`Port ${candidatePort} is busy. Retrying on ${nextPort}...`);
        tryListen(nextPort, attempt + 1);
        return;
      }
      reject(err);
    });

    server.listen(candidatePort, '0.0.0.0', () => {
      server.removeAllListeners('error');
      resolve({ server, port: candidatePort });
    });
  };

  tryListen(port, 1);
});

const start = async () => {
  try {
    await connectDB();
    const { port } = await startServer(DEFAULT_PORT);
    logger.info(`Server running on port ${port}`);
    console.log(`Server running on port ${port}`);
  } catch (err) {
    logger.error('Failed to start', err);
    process.exit(1);
  }
};

start();
