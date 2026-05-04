import mongoose from 'mongoose';
import User from './models/User.js';
import connectDB from './config/db.js';

const createAdmin = async () => {
  await connectDB();
  const existing = await User.findOne({ email: 'admin@fendri.com' });
  if (existing) {
    console.log('Admin user already exists');
    await mongoose.connection.close();
    return;
  }
  await User.create({
    name: 'Admin Fendri',
    email: 'admin@fendri.com',
    password: 'Admin2025!',
    role: 'admin',
  });
  console.log('✅ Admin user created: admin@fendri.com / Admin2025!');
  await mongoose.connection.close();
};

createAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
