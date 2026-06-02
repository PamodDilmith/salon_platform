require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('Connected to DB');
  const users = await User.find({ role: 'admin' }).select('+password');
  console.log('Admins found:', users.map(u => ({ email: u.email, role: u.role })));
  
  const user = await User.findOne({ email: 'admin@salon.com' }).select('+password');
  if (user) {
    const isMatch = await user.matchPassword('admin123');
    console.log('admin@salon.com exists. Password match for admin123:', isMatch);
  } else {
    console.log('admin@salon.com NOT FOUND');
  }
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
