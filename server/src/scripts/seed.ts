import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import Config from '../models/Config.js';
import logger from '../utils/logger.js';

// Load environment variables
dotenv.config();

// Set default environment variables if not present
if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';
if (!process.env.PORT) process.env.PORT = '8080';
if (!process.env.BASE_URL) process.env.BASE_URL = 'http://localhost:8080';
if (!process.env.MONGODB_URI) process.env.MONGODB_URI = 'mongodb+srv://dawinibra:CSU6i05mC6HgPwdf@spinandearn.nftuswu.mongodb.net/?retryWrites=true&w=majority&appName=spinandearn';
if (!process.env.JWT_ACCESS_SECRET) process.env.JWT_ACCESS_SECRET = 'your-super-secret-access-key-change-in-production-32-chars';
if (!process.env.JWT_REFRESH_SECRET) process.env.JWT_REFRESH_SECRET = 'your-super-secret-refresh-key-change-in-production-32-chars';
if (!process.env.JWT_ACCESS_TTL) process.env.JWT_ACCESS_TTL = '15m';
if (!process.env.JWT_REFRESH_TTL) process.env.JWT_REFRESH_TTL = '30d';
if (!process.env.ALLOWED_ORIGINS) process.env.ALLOWED_ORIGINS = 'http://localhost:3000,http://localhost:8081,https://your-admin-domain.com';
if (!process.env.SSV_SHARED_SECRET) process.env.SSV_SHARED_SECRET = 'your-ssv-shared-secret-change-in-production';
if (!process.env.RATE_WINDOW_SECONDS) process.env.RATE_WINDOW_SECONDS = '60';
if (!process.env.RATE_MAX_ACTIONS) process.env.RATE_MAX_ACTIONS = '120';
if (!process.env.ADMOB_ANDROID_APP_ID) process.env.ADMOB_ANDROID_APP_ID = 'ca-app-pub-6181092189054832~2340148251';
if (!process.env.ADMOB_ANDROID_REWARDED_ID) process.env.ADMOB_ANDROID_REWARDED_ID = 'ca-app-pub-6181092189054832/5533281634';
if (!process.env.ADMOB_ANDROID_INTERSTITIAL_ID) process.env.ADMOB_ANDROID_INTERSTITIAL_ID = 'ca-app-pub-6181092189054832/5634156310';
if (!process.env.ADMOB_ANDROID_BANNER_ID) process.env.ADMOB_ANDROID_BANNER_ID = 'ca-app-pub-6181092189054832/2199691226';
if (!process.env.ADMOB_ANDROID_NATIVE_ID) process.env.ADMOB_ANDROID_NATIVE_ID = 'ca-app-pub-6181092189054832/5947364546';
if (!process.env.ADMOB_IOS_APP_ID) process.env.ADMOB_IOS_APP_ID = 'ca-app-pub-6181092189054832~9363047132';
if (!process.env.ADMOB_IOS_REWARDED_ID) process.env.ADMOB_IOS_REWARDED_ID = 'ca-app-pub-6181092189054832/6279263382';
if (!process.env.ADMOB_IOS_INTERSTITIAL_ID) process.env.ADMOB_IOS_INTERSTITIAL_ID = 'ca-app-pub-6181092189054832/1975419817';
if (!process.env.ADMOB_IOS_BANNER_ID) process.env.ADMOB_IOS_BANNER_ID = 'ca-app-pub-6181092189054832/3604713177';
if (!process.env.ADMOB_IOS_NATIVE_ID) process.env.ADMOB_IOS_NATIVE_ID = 'ca-app-pub-6181092189054832/4774610025';

const spinEarnPolicy = {
  rewards: {
    spin: {
      base: 1,
      min: 1,
      max: 100
    },
    jackpot: 100,
    streak: [
      5,   // Day 1
      10,  // Day 2
      15,  // Day 3
      20,  // Day 4
      25,  // Day 5
      30,  // Day 6
      50   // Day 7
    ],
    referral: {
      inviter: 50,
      invitee: 25,
      qualifyAfterCoins: 100
    }
  },
  caps: {
    maxSpinsPerDay: 50,
    minSecondsBetweenSpins: 30,
    maxRewardedPerDay: 20,
    dailyCoinCap: 500
  },
  wheelWeights: {
    "2": 30,        // 30% chance
    "5": 25,        // 25% chance
    "10": 20,       // 20% chance
    "20": 15,       // 15% chance
    "50": 7,        // 7% chance
    "jackpot": 1,   // 1% chance
    "bonusSpin": 1, // 1% chance
    "tryAgain": 1   // 1% chance
  },
  withdrawals: {
    min: 1000,
    fee: 0.05, // 5% fee
    cooldownHours: 24
  },
  security: {
    allowEmulators: false,
    rootedPenalty: 0.5, // 50% penalty for rooted devices
    ipVelocityWindowSec: 3600, // 1 hour
    maxActionsPerWindow: 100
  }
};

async function seedDatabase() {
  try {
    logger.info('Starting database seeding...');
    
    // Connect to database
    await connectDB();
    
    // Check if config already exists
    const existingConfig = await Config.findOne({ key: 'spin_earn_policy' });
    
    if (existingConfig) {
      logger.info('spin_earn_policy config already exists, updating...');
      existingConfig.json = spinEarnPolicy;
      await existingConfig.save();
      logger.info('spin_earn_policy config updated successfully');
    } else {
      logger.info('Creating spin_earn_policy config...');
      const config = new Config({
        key: 'spin_earn_policy',
        json: spinEarnPolicy
      });
      await config.save();
      logger.info('spin_earn_policy config created successfully');
    }
    
    logger.info('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
