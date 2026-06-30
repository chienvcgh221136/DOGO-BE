require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const hash = bcrypt.hashSync('Admin@123', 10);
  const db = mongoose.connection.db;
  const adminData = {
    username: "admin",
    fullName: "Quản trị viên",
    email: "admin@dogoquochieu.com",
    passwordHash: hash,
    role: "super_admin",
    isActive: true,
    lastLoginAt: null
  };
  await db.collection('admins').updateOne({ username: 'admin' }, { $set: adminData }, { upsert: true });
  console.log('Admin user inserted successfully with password Admin@123');
  process.exit(0);
}).catch(console.error);
