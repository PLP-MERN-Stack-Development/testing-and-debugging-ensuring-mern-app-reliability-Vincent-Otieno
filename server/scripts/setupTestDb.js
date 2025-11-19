#!/usr/bin/env node

/**
 * Script to set up test database
 * This can be used to initialize test data if needed
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const setupTestDb = async () => {
  try {
    const testDbUri = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/mern-testing-test';

    console.log('Connecting to test database...');
    await mongoose.connect(testDbUri);

    console.log('Connected to test database successfully');

    // Drop existing data
    console.log('Dropping existing collections...');
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.drop();
      console.log(`Dropped collection: ${collection.collectionName}`);
    }

    console.log('Test database setup completed successfully');

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error setting up test database:', error);
    process.exit(1);
  }
};

setupTestDb();
