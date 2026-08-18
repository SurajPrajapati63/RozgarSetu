import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Worker from '../models/Worker.model.js';

dotenv.config();

const [workerID, password] = process.argv.slice(2);

if (!/^WRK-\d{4}-\d{4}$/.test(workerID || '') || !password) {
  console.error('Usage: npm run reset:worker-password -- <worker-id> <new-password>');
  process.exit(1);
}

try {
  await connectDB();

  const worker = await Worker.findOne({ workerID }).select('+password +refreshToken');
  if (!worker) {
    console.error('No worker exists with that worker ID.');
    process.exitCode = 1;
  } else {
    worker.password = await bcrypt.hash(password, 12);
    worker.refreshToken = null;
    await worker.save();
    console.log(`Password reset successfully for worker=${workerID}.`);
  }
} catch (error) {
  console.error(`Password reset failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
