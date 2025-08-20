/// <reference types="node" />
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import WithdrawalRequest from '../models/WithdrawalRequest.js';
import SpinSession from '../models/SpinSession.js';
import WalletTx from '../models/WalletTx.js';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is required');
  process.exit(1);
}

if (!process.env.BASE_URL) process.env.BASE_URL = 'http://localhost:8080';

async function seed() {
  try {
    console.log('🌱 Starting database seed...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await User.deleteMany({});
    // await WithdrawalRequest.deleteMany({});
    // await SpinSession.deleteMany({});
    // await WalletTx.deleteMany({});
    // console.log('🧹 Cleared existing data');

    // Create admin user if it doesn't exist
    const adminExists = await User.findOne({ email: 'admin@spinearn.com' });
    if (!adminExists) {
      const adminPasswordHash = await bcrypt.hash('admin123', 12);
      const adminUser = new User({
        email: 'admin@spinearn.com',
        passwordHash: adminPasswordHash,
        roles: ['admin'],
        referralCode: 'ADMIN001',
        balances: { coins: 0, gems: 0 },
        streak: { current: 0, longest: 0 },
        flags: { shadowBanned: false, blocked: false }
      });
      await adminUser.save();
      console.log('👑 Created admin user');
    } else {
      console.log('👑 Admin user already exists');
    }

    // Create test users
    const testUsers = [
      {
        email: 'john@example.com',
        password: 'user123',
        coins: 2500,
        streak: 7,
        referralCode: 'JOHN001'
      },
      {
        email: 'sarah@example.com',
        password: 'user123',
        coins: 1800,
        streak: 3,
        referralCode: 'SARAH001'
      },
      {
        email: 'mike@example.com',
        password: 'user123',
        coins: 4200,
        streak: 12,
        referralCode: 'MIKE001'
      },
      {
        email: 'lisa@example.com',
        password: 'user123',
        coins: 450,
        streak: 1,
        referralCode: 'LISA001'
      },
      {
        email: 'alex@example.com',
        password: 'user123',
        coins: 3200,
        streak: 15,
        referralCode: 'ALEX001'
      },
      {
        email: 'emma@example.com',
        password: 'user123',
        coins: 780,
        streak: 5,
        referralCode: 'EMMA001'
      }
    ];

    for (const userData of testUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const passwordHash = await bcrypt.hash(userData.password, 12);
        const user = new User({
          email: userData.email,
          passwordHash,
          roles: ['user'],
          referralCode: userData.referralCode,
          balances: { coins: userData.coins, gems: 0 },
          streak: { current: userData.streak, longest: userData.streak },
          flags: { shadowBanned: false, blocked: false }
        });
        await user.save();
        console.log(`👤 Created user: ${userData.email}`);
      } else {
        console.log(`👤 User already exists: ${userData.email}`);
      }
    }

    // Create test withdrawal requests
    const users = await User.find({ roles: 'user' }).limit(5);
    
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const existingWithdrawal = await WithdrawalRequest.findOne({ userId: user._id });
      
      if (!existingWithdrawal) {
        const withdrawal = new WithdrawalRequest({
          userId: user._id,
          amount: Math.floor(Math.random() * 2000) + 500, // Random amount between 500-2500
          method: ['PayPal', 'Bank Transfer', 'PayPal'][Math.floor(Math.random() * 3)],
          accountInfo: `${user.email.split('@')[0]}@paypal.com`,
          status: ['pending', 'pending', 'pending', 'approved', 'rejected'][Math.floor(Math.random() * 5)],
          notes: Math.random() > 0.7 ? 'Test withdrawal request' : undefined
        });
        await withdrawal.save();
        console.log(`💰 Created withdrawal request for: ${user.email}`);
      }
    }

    // Create some test spin sessions
    for (const user of users) {
      const spinCount = Math.floor(Math.random() * 20) + 5; // 5-25 spins per user
      
      for (let i = 0; i < spinCount; i++) {
        const spin = new SpinSession({
          userId: user._id,
          method: Math.random() > 0.7 ? 'rewarded' : 'free',
          outcome: ['2', '5', '10', '20', '50', 'jackpot', 'bonusSpin', 'tryAgain'][Math.floor(Math.random() * 8)],
          coins: Math.floor(Math.random() * 50) + 1,
          signature: `spin_${user._id}_${Date.now()}_${i}`,
          ipAddress: '127.0.0.1',
          userAgent: 'Test User Agent'
        });
        await spin.save();
      }
      console.log(`🎰 Created ${spinCount} spin sessions for: ${user.email}`);
    }

    // Create some wallet transactions
    for (const user of users) {
      const txCount = Math.floor(Math.random() * 10) + 3; // 3-13 transactions per user
      let currentBalance = user.balances.coins;
      
      for (let i = 0; i < txCount; i++) {
        const amount = Math.floor(Math.random() * 100) + 10;
        const type = Math.random() > 0.5 ? 'credit' : 'debit';
        
        if (type === 'credit') {
          currentBalance += amount;
        } else {
          currentBalance = Math.max(0, currentBalance - amount);
        }
        
        const tx = new WalletTx({
          userId: user._id,
          type,
          amount,
          balanceAfter: currentBalance,
          origin: ['spin', 'streak', 'referral', 'admin'][Math.floor(Math.random() * 4)]
        });
        await tx.save();
      }
      console.log(`💳 Created ${txCount} wallet transactions for: ${user.email}`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Created ${users.length} test users with spins and withdrawals`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the seed function
seed();
