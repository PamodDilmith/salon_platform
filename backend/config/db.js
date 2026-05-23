const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Warning: ${error.message}`);
    console.log('Backend server running in fallback mode. Database-dependent endpoints will return errors, but server remains active.');
  }
};

module.exports = connectDB;
