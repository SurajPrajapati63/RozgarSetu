import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Admin from './models/Admin.model.js';
import Worker from './models/Worker.model.js';
import User from './models/User.model.js';
import Booking from './models/Booking.model.js';
import Review from './models/Review.model.js';
import Post from './models/Post.model.js';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

const clear = process.argv.includes('--clear');

const SAMPLE_PHOTOS = [
  'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80'
];

const PORTFOLIO_PHOTOS = [
  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?auto=format&fit=crop&w=800&q=80'
];

const CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Lucknow'];

const CATEGORIES = [
  'Plumber', 'Electrician', 'Carpenter', 'Painter', 'AC Repair',
  'Cleaning', 'Driver', 'Cook', 'Security Guard', 'Others'
];

const run = async () => {
  console.log('🌱 Starting WorkerLink Database Seeder...');
  await connectDB();

  if (clear) {
    console.log('🧹 Clearing existing collections...');
    await Promise.all([
      Admin.deleteMany(),
      Worker.deleteMany(),
      User.deleteMany(),
      Booking.deleteMany(),
      Review.deleteMany(),
      Post.deleteMany()
    ]);
    console.log('✅ Collections cleared successfully.');
  }

  // 1. Seed Admin
  const adminPass = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123456';
  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@workerlink.in';
  let admin = await Admin.findOne({ email: adminEmail });
  if (!admin) {
    const hashedPass = await bcrypt.hash(adminPass, 12);
    admin = await Admin.create({
      name: 'Super Admin',
      email: adminEmail,
      password: hashedPass
    });
    console.log(`✅ Default Admin created: ${adminEmail} / ${adminPass}`);
  }

  // 2. Seed Users
  console.log('👤 Seeding 5 Users...');
  const userPassword = await bcrypt.hash('User@123456', 12);
  const createdUsers = [];

  for (let i = 0; i < 5; i++) {
    const mobile = `98765${10000 + i}`;
    let user = await User.findOne({ mobile });
    if (!user) {
      user = await User.create({
        name: faker.person.fullName(),
        mobile,
        email: faker.internet.email().toLowerCase(),
        address: `${faker.location.streetAddress()}, ${faker.helpers.arrayElement(CITIES)}`,
        password: userPassword,
        photo: SAMPLE_PHOTOS[i % SAMPLE_PHOTOS.length]
      });
    }
    createdUsers.push(user);
  }
  console.log(`✅ ${createdUsers.length} Users ready.`);

  // 3. Seed Workers
  console.log('👷 Seeding 20 Workers...');
  const workerPassword = await bcrypt.hash('Worker@123456', 12);
  const createdWorkers = [];
  const currentYear = new Date().getFullYear();

  for (let i = 0; i < 20; i++) {
    const mobile = `91234${10000 + i}`;
    const workerID = `WRK-${currentYear}-${String(i + 1).padStart(4, '0')}`;
    let worker = await Worker.findOne({ workerID });
    
    if (!worker) {
      const category = CATEGORIES[i % CATEGORIES.length];
      const status = i < 3 ? 'pending' : (i === 19 ? 'suspended' : 'active');

      worker = await Worker.create({
        name: faker.person.fullName(),
        mobile,
        email: faker.internet.email().toLowerCase(),
        address: `${faker.location.streetAddress()}, ${faker.helpers.arrayElement(CITIES)}`,
        password: workerPassword,
        workerID,
        status,
        photo: SAMPLE_PHOTOS[(i + 2) % SAMPLE_PHOTOS.length],
        bio: `Experienced ${category} with over ${faker.number.int({ min: 2, max: 15 })} years of professional experience in high quality domestic and commercial work.`,
        category,
        skills: [category, `${category} Maintenance`, 'Emergency Repairs'],
        city: CITIES[i % CITIES.length],
        state: 'State',
        pricePerDay: faker.number.int({ min: 400, max: 1500 }),
        experience: faker.number.int({ min: 2, max: 15 }),
        availability: {
          days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          isAvailableNow: true
        },
        profileViews: faker.number.int({ min: 10, max: 250 })
      });
    }
    createdWorkers.push(worker);
  }
  console.log(`✅ ${createdWorkers.length} Workers ready.`);

  const activeWorkers = createdWorkers.filter(w => w.status === 'active');

  // 4. Seed Posts (3 per active worker)
  console.log('📸 Seeding 60 Portfolio Posts...');
  const createdPosts = [];
  for (const worker of activeWorkers) {
    for (let j = 0; j < 3; j++) {
      const imgUrl = PORTFOLIO_PHOTOS[(j + worker.experience) % PORTFOLIO_PHOTOS.length];
      const post = await Post.create({
        worker: worker._id,
        title: `${worker.category} Work - Project #${j + 1}`,
        description: `Completed high quality ${worker.category.toLowerCase()} assignment for a residential client in ${worker.city}.`,
        category: worker.category,
        media: [{ url: imgUrl, publicId: `seed_post_${worker._id}_${j}`, type: 'image' }],
        status: 'active'
      });
      createdPosts.push(post);
    }
  }
  console.log(`✅ ${createdPosts.length} Portfolio Posts created.`);

  // 5. Seed Bookings (30 bookings)
  console.log('📅 Seeding 30 Bookings...');
  const createdBookings = [];
  const statuses = ['pending', 'accepted', 'completed', 'cancelled'];

  for (let i = 0; i < 30; i++) {
    const user = createdUsers[i % createdUsers.length];
    const worker = activeWorkers[i % activeWorkers.length];
    const bkgID = `BKG-${currentYear}-${String(i + 1).padStart(4, '0')}`;

    const status = i < 15 ? 'completed' : statuses[i % statuses.length];
    const serviceDate = new Date(Date.now() - faker.number.int({ min: 1, max: 30 }) * 86400000);

    const booking = await Booking.create({
      bookingID: bkgID,
      user: user._id,
      worker: worker._id,
      serviceDate,
      serviceDescription: `Need urgent ${worker.category} service for maintenance and repairs.`,
      contactNumber: user.mobile,
      status,
      amount: worker.pricePerDay,
      hasReview: false
    });
    createdBookings.push(booking);
  }
  console.log(`✅ ${createdBookings.length} Bookings created.`);

  // 6. Seed Reviews (for completed bookings)
  console.log('⭐ Seeding Reviews and recalculating worker ratings...');
  const completedBookings = createdBookings.filter(b => b.status === 'completed');

  for (const booking of completedBookings) {
    const rating = faker.number.int({ min: 4, max: 5 });
    const review = await Review.create({
      booking: booking._id,
      user: booking.user,
      worker: booking.worker,
      rating,
      comment: faker.helpers.arrayElement([
        'Fantastic service! Arrived on time and did a thorough professional job.',
        'Extremely satisfied with the work. Highly recommend to everyone.',
        'Very polite, hardworking, and finished everything before schedule.',
        'Great expertise and reasonable pricing. Will definitely hire again!'
      ])
    });

    booking.hasReview = true;
    await booking.save();
  }
  console.log(`✅ Reviews seeded and rating summaries updated.`);

  console.log('🎉 Seeding successfully completed!');
  process.exit(0);
};

run().catch(err => {
  console.error('❌ Seeding Error:', err);
  process.exit(1);
});
