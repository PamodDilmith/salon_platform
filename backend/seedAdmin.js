require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const adminExists = await User.findOne({ email: 'admin@salon.com' });
  if (!adminExists) {
    const admin = new User({
      name: 'System Admin',
      email: 'admin@salon.com',
      password: 'admin123',
      role: 'admin',
      phoneNumber: '0771234567'
    });
    await admin.save();
    console.log('Admin user created successfully: admin@salon.com / admin123');
  } else {
    console.log('Admin already exists.');
  }
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
