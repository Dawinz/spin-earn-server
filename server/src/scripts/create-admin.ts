/// <reference types="node" />
import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import logger from '../utils/logger.js';

// Load environment variables
dotenv.config();

// Set default environment variables if not present
if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';
if (!process.env.MONGODB_URI) process.env.MONGODB_URI = 'mongodb://localhost:27017/spin-earn';

async function createAdminUser() {
  try {
    logger.info('Creating admin user...');
    
    // Connect to database
    await connectDB();
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@spinearn.com' });
    
    if (existingAdmin) {
      logger.info('Admin user already exists');
      process.exit(0);
    }
    
    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash('admin123', saltRounds);
    
    // Create admin user
    const adminUser = new User({
      email: 'admin@spinearn.com',
      passwordHash,
      roles: ['admin'],
      referralCode: 'ADMIN001',
      balances: {
        coins: 0
      },
      streak: {
        current: 0,
        longest: 0
      },
      flags: {
        shadowBanned: false,
        blocked: false
      }
    });
    
    await adminUser.save();
    
    logger.info('Admin user created successfully');
    logger.info('Email: admin@spinearn.com');
    logger.info('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    logger.error('Error creating admin user:', error);
    process.exit(1);
  }
}

// Run the function
createAdminUser();
