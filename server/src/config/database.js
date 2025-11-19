const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * Connect to MongoDB database
 */
const connectDB = async () => {
  try {
    const options = {
      // useNewUrlParser and useUnifiedTopology are no longer needed in Mongoose 6+
      // but keeping them for backwards compatibility won't hurt
    };

    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-testing',
      options
    );

    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed due to app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
