import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('8080'),
  BASE_URL: z.string().url(),
  MONGODB_URI: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_TTL: z.string().default('15m'),
  JWT_REFRESH_TTL: z.string().default('30d'),
  ALLOWED_ORIGINS: z.string().transform(val => val.split(',').map(s => s.trim())),
  SSV_SHARED_SECRET: z.string().min(16),
  RATE_WINDOW_SECONDS: z.string().transform(Number).default('60'),
  RATE_MAX_ACTIONS: z.string().transform(Number).default('120'),
  ADMOB_ANDROID_APP_ID: z.string(),
  ADMOB_ANDROID_REWARDED_ID: z.string(),
  ADMOB_ANDROID_INTERSTITIAL_ID: z.string(),
  ADMOB_ANDROID_BANNER_ID: z.string(),
  ADMOB_ANDROID_NATIVE_ID: z.string(),
  ADMOB_IOS_APP_ID: z.string(),
  ADMOB_IOS_REWARDED_ID: z.string(),
  ADMOB_IOS_INTERSTITIAL_ID: z.string(),
  ADMOB_IOS_BANNER_ID: z.string(),
  ADMOB_IOS_NATIVE_ID: z.string(),
});

// Set default values for missing environment variables
const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || '8080',
  BASE_URL: process.env.BASE_URL || 'http://localhost:8080',
                MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/spin-earn',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'your-super-secret-access-key-change-in-production-32-chars',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production-32-chars',
  JWT_ACCESS_TTL: process.env.JWT_ACCESS_TTL || '15m',
  JWT_REFRESH_TTL: process.env.JWT_REFRESH_TTL || '30d',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:8081,https://your-admin-domain.com',
  SSV_SHARED_SECRET: process.env.SSV_SHARED_SECRET || 'your-ssv-shared-secret-change-in-production',
  RATE_WINDOW_SECONDS: process.env.RATE_WINDOW_SECONDS || '60',
  RATE_MAX_ACTIONS: process.env.RATE_MAX_ACTIONS || '120',
  ADMOB_ANDROID_APP_ID: process.env.ADMOB_ANDROID_APP_ID || 'ca-app-pub-6181092189054832~2340148251',
  ADMOB_ANDROID_REWARDED_ID: process.env.ADMOB_ANDROID_REWARDED_ID || 'ca-app-pub-6181092189054832/5533281634',
  ADMOB_ANDROID_INTERSTITIAL_ID: process.env.ADMOB_ANDROID_INTERSTITIAL_ID || 'ca-app-pub-6181092189054832/5634156310',
  ADMOB_ANDROID_BANNER_ID: process.env.ADMOB_ANDROID_BANNER_ID || 'ca-app-pub-6181092189054832/2199691226',
  ADMOB_ANDROID_NATIVE_ID: process.env.ADMOB_ANDROID_NATIVE_ID || 'ca-app-pub-6181092189054832/5947364546',
  ADMOB_IOS_APP_ID: process.env.ADMOB_IOS_APP_ID || 'ca-app-pub-6181092189054832~9363047132',
  ADMOB_IOS_REWARDED_ID: process.env.ADMOB_IOS_REWARDED_ID || 'ca-app-pub-6181092189054832/6279263382',
  ADMOB_IOS_INTERSTITIAL_ID: process.env.ADMOB_IOS_INTERSTITIAL_ID || 'ca-app-pub-6181092189054832/1975419817',
  ADMOB_IOS_BANNER_ID: process.env.ADMOB_IOS_BANNER_ID || 'ca-app-pub-6181092189054832/3604713177',
  ADMOB_IOS_NATIVE_ID: process.env.ADMOB_IOS_NATIVE_ID || 'ca-app-pub-6181092189054832/4774610025',
};

const config = configSchema.parse(env);

export default config;

export const adMobConfig = {
  android: {
    appId: config.ADMOB_ANDROID_APP_ID,
    rewardedId: config.ADMOB_ANDROID_REWARDED_ID,
    interstitialId: config.ADMOB_ANDROID_INTERSTITIAL_ID,
    bannerId: config.ADMOB_ANDROID_BANNER_ID,
    nativeId: config.ADMOB_ANDROID_NATIVE_ID,
  },
  ios: {
    appId: config.ADMOB_IOS_APP_ID,
    rewardedId: config.ADMOB_IOS_REWARDED_ID,
    interstitialId: config.ADMOB_IOS_INTERSTITIAL_ID,
    bannerId: config.ADMOB_IOS_BANNER_ID,
    nativeId: config.ADMOB_IOS_NATIVE_ID,
  },
};

export const jwtConfig = {
  accessSecret: config.JWT_ACCESS_SECRET,
  refreshSecret: config.JWT_REFRESH_SECRET,
  accessTtl: config.JWT_ACCESS_TTL,
  refreshTtl: config.JWT_REFRESH_TTL,
};

export const rateLimitConfig = {
  windowMs: config.RATE_WINDOW_SECONDS * 1000,
  max: config.RATE_MAX_ACTIONS,
};
