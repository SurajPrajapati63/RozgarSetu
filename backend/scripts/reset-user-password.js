import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.model.js';

dotenv.config();

const [mobile, password] = process.argv.slice(2);

if (!/^\d{10}$/.test(mobile || '') || !password) {
  console.error('Usage: npm run reset:user-password -- <10-digit-mobile> <new-password>');
  process.exit(1);
}

try {
  await connectDB();

  const user = await User.findOne({ mobile }).select('+password +refreshToken');
  if (!user) {
    console.error('No user exists with that mobile number.');
    process.exitCode = 1;
  } else {
    user.password = await bcrypt.hash(password, 12);
    user.refreshToken = null;
    await user.save();
    console.log(`Password reset successfully for mobile=${mobile}.`);
  }
} catch (error) {
  console.error(`Password reset failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
