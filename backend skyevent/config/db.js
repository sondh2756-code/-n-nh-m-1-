const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/ai-sky-portal';
  try {
    await mongoose.connect(uri, {
      // options kept default for mongoose v7+
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
