const mongoose = require('mongoose');

const connectDB = async (uri) => {
  if (!uri) throw new Error('MONGO_URI is not defined');
  await mongoose.connect(uri);
  console.log('MongoDB connected');
};

module.exports = connectDB;
