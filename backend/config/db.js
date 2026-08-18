import mongoose from 'mongoose';
import dns from 'node:dns';
import logger from '../utils/logger.js';

const configureDnsForSrvUri = (uri) => {
  if (!uri.startsWith('mongodb+srv://')) return;

  const dnsServers = (process.env.DNS_SERVERS || '8.8.8.8,1.1.1.1')
    .split(',')
    .map((server) => server.trim())
    .filter(Boolean);

  if (dnsServers.length > 0) {
    dns.setServers(dnsServers);
  }
};

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI not set');
  configureDnsForSrvUri(uri);
  let attempts = 0;
  const maxAttempts = 5;
  let lastError;
  while (attempts < maxAttempts) {
    try {
      await mongoose.connect(uri, { maxPoolSize: 10 });
      logger.info('MongoDB connected');
      return;
    } catch (err) {
      attempts += 1;
      lastError = err;
      logger.error(`MongoDB connection failed (attempt ${attempts}): ${err.message}`);
      await new Promise((r) => setTimeout(r, 2000 * attempts));
    }
  }
  throw new Error(`Failed to connect to MongoDB: ${lastError?.message || 'unknown error'}`);
};

export default connectDB;
