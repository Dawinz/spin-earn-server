import dotenv from 'dotenv';

dotenv.config();

const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '8080', 10),
  
  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/spin-earn',
  
  // JWT
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'your-access-secret-key',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  
  // CORS
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  
  // AdMob SSV
  SSV_SHARED_SECRET: process.env.SSV_SHARED_SECRET || 'your-ssv-shared-secret',
  ADMOB_APP_ID_ANDROID: process.env.ADMOB_APP_ID_ANDROID || 'ca-app-pub-3940256099942544~3347511713',
  ADMOB_APP_ID_IOS: process.env.ADMOB_APP_ID_IOS || 'ca-app-pub-3940256099942544~1458002511',
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  
  // Security
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  
  // Game Settings
  DEFAULT_DAILY_SPIN_LIMIT: parseInt(process.env.DEFAULT_DAILY_SPIN_LIMIT || '10', 10),
  DEFAULT_MIN_WITHDRAWAL: parseInt(process.env.DEFAULT_MIN_WITHDRAWAL || '1000', 10),
  DEFAULT_WITHDRAWAL_FEE: parseFloat(process.env.DEFAULT_WITHDRAWAL_FEE || '0.05'), // 5%
  
  // Email (for magic links)
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@spin-earn.com',
  
  // Base URL
  BASE_URL: process.env.BASE_URL || 'http://localhost:8080',
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  
  // Anti-fraud
  MAX_DEVICES_PER_USER: parseInt(process.env.MAX_DEVICES_PER_USER || '3', 10),
  SUSPICIOUS_IP_THRESHOLD: parseInt(process.env.SUSPICIOUS_IP_THRESHOLD || '10', 10),
  
  // Referrals
  REFERRAL_BONUS: parseInt(process.env.REFERRAL_BONUS || '100', 10),
  REFERRER_BONUS: parseInt(process.env.REFERRER_BONUS || '50', 10),
  
  // Streaks
  STREAK_BONUS_MULTIPLIER: parseFloat(process.env.STREAK_BONUS_MULTIPLIER || '1.5'),
  MAX_STREAK_DAYS: parseInt(process.env.MAX_STREAK_DAYS || '7', 10)
};

export default config;
