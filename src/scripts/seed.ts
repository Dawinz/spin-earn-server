import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Config from '../models/Config.js';
import WithdrawalRequest from '../models/WithdrawalRequest.js';
import config from '../config/index.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await User.deleteMany({});
    await Config.deleteMany({});
    await WithdrawalRequest.deleteMany({});
    console.log('Cleared existing data');
    
    // Create admin user
    const adminUser = new User({
      email: 'admin@spinearn.com',
      password: 'admin123',
      isAdmin: true,
      isEmailVerified: true,
      referralCode: 'ADMIN001',
      currentBalance: 0,
      totalEarnings: 0,
      totalWithdrawn: 0,
      dailySpinCount: 0,
      streakDays: 0
    });
    
    await adminUser.save();
    console.log('Created admin user:', adminUser.email);
    
    // Create test user
    const testUser = new User({
      email: 'test@example.com',
      password: 'test123',
      isAdmin: false,
      isEmailVerified: true,
      referralCode: 'TEST001',
      currentBalance: 1000,
      totalEarnings: 1000,
      totalWithdrawn: 0,
      dailySpinCount: 0,
      streakDays: 3
    });
    
    await testUser.save();
    console.log('Created test user:', testUser.email);
    
    // Create test withdrawal requests
    const withdrawal1 = new WithdrawalRequest({
      userId: testUser._id,
      amount: 500,
      fee: 25,
      netAmount: 475,
      method: 'paypal',
      accountInfo: 'test@example.com',
      status: 'pending'
    });
    
    await withdrawal1.save();
    console.log('Created test withdrawal request 1');
    
    const withdrawal2 = new WithdrawalRequest({
      userId: testUser._id,
      amount: 300,
      fee: 15,
      netAmount: 285,
      method: 'bank',
      accountInfo: 'Bank: Chase, Account: ****1234',
      status: 'approved'
    });
    
    await withdrawal2.save();
    console.log('Created test withdrawal request 2');
    
    const withdrawal3 = new WithdrawalRequest({
      userId: testUser._id,
      amount: 200,
      fee: 10,
      netAmount: 190,
      method: 'crypto',
      accountInfo: 'BTC: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      status: 'rejected'
    });
    
    await withdrawal3.save();
    console.log('Created test withdrawal request 3');
    
    // Create configuration entries
    const configEntries = [
      {
        key: 'rewards',
        value: {
          spin: { base: 1, min: 1, max: 100 },
          jackpot: 100,
          referral: { inviter: 50, invitee: 25, qualifyAfterCoins: 100 }
        },
        description: 'Game reward configuration',
        isPublic: true
      },
      {
        key: 'streaks',
        value: {
          bonusMultiplier: 1.5,
          maxStreakDays: 7,
          day1Bonus: 10,
          day3Bonus: 25,
          day7Bonus: 100,
          day30Bonus: 500
        },
        description: 'Daily streak rewards and multipliers',
        isPublic: true
      },
      {
        key: 'caps',
        value: {
          maxSpinsPerDay: 50,
          minSecondsBetweenSpins: 30,
          maxRewardedPerDay: 20,
          dailyCoinCap: 500
        },
        description: 'Daily limits and caps',
        isPublic: true
      },
      {
        key: 'wheelWeights',
        value: {
          "2": 30, "5": 25, "10": 20, "20": 15,
          "50": 7, "jackpot": 1, "bonusSpin": 1, "tryAgain": 1
        },
        description: 'Spin wheel probability weights',
        isPublic: false
      },
      {
        key: 'withdrawals',
        value: {
          min: 1000,
          fee: 0.05,
          cooldownHours: 24,
          maxPerDay: 3,
          autoApproveLimit: 100
        },
        description: 'Withdrawal settings',
        isPublic: true
      },
      {
        key: 'security',
        value: {
          allowEmulators: false,
          rootedPenalty: 0.5,
          ipVelocityWindowSec: 3600,
          maxActionsPerWindow: 100,
          maxDevicesPerUser: 3,
          suspiciousIpThreshold: 10
        },
        description: 'Security and anti-fraud settings',
        isPublic: false
      },
      {
        key: 'email',
        value: {
          enabled: false,
          smtpHost: 'smtp.gmail.com',
          smtpPort: 587,
          smtpUser: '',
          smtpPass: '',
          fromEmail: 'noreply@spinearn.com',
          fromName: 'Spin & Earn'
        },
        description: 'Email notification settings',
        isPublic: false
      },
      {
        key: 'app',
        value: {
          maintenanceMode: false,
          maintenanceMessage: 'We are currently performing maintenance. Please try again later.',
          appVersion: '1.0.0',
          minAppVersion: '1.0.0',
          forceUpdate: false,
          updateMessage: 'Please update to the latest version to continue using the app.'
        },
        description: 'App-wide settings and features',
        isPublic: true
      }
    ];
    
    for (const configEntry of configEntries) {
      const configDoc = new Config(configEntry);
      await configDoc.save();
    }
    
    console.log('Created configuration entries');
    
    console.log('Database seeded successfully!');
    console.log('\nTest Accounts:');
    console.log('Admin: admin@spinearn.com / admin123');
    console.log('User: test@example.com / test123');
    console.log('\nTest Withdrawals:');
    console.log('- Pending: 500 coins via PayPal');
    console.log('- Approved: 300 coins via Bank');
    console.log('- Rejected: 200 coins via Crypto');
    
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Export the function for use in other modules
export { seedDatabase };

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}
