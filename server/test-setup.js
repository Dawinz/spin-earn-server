// Test setup script to set environment variables
process.env.NODE_ENV = 'development';
process.env.PORT = '8080';
process.env.BASE_URL = 'http://localhost:8080';
process.env.MONGODB_URI = 'mongodb+srv://dawinibra:CSU6i05mC6HgPwdf@spinandearn.nftuswu.mongodb.net/?retryWrites=true&w=majority&appName=spinandearn';
process.env.JWT_ACCESS_SECRET = 'your-super-secret-access-key-change-in-production-32-chars';
process.env.JWT_REFRESH_SECRET = 'your-super-secret-refresh-key-change-in-production-32-chars';
process.env.JWT_ACCESS_TTL = '15m';
process.env.JWT_REFRESH_TTL = '30d';
process.env.ALLOWED_ORIGINS = 'http://localhost:3000,http://localhost:8081,https://your-admin-domain.com';
process.env.SSV_SHARED_SECRET = 'your-ssv-shared-secret-change-in-production';
process.env.RATE_WINDOW_SECONDS = '60';
process.env.RATE_MAX_ACTIONS = '120';
process.env.ADMOB_ANDROID_APP_ID = 'ca-app-pub-6181092189054832~2340148251';
process.env.ADMOB_ANDROID_REWARDED_ID = 'ca-app-pub-6181092189054832/5533281634';
process.env.ADMOB_ANDROID_INTERSTITIAL_ID = 'ca-app-pub-6181092189054832/5634156310';
process.env.ADMOB_ANDROID_BANNER_ID = 'ca-app-pub-6181092189054832/2199691226';
process.env.ADMOB_ANDROID_NATIVE_ID = 'ca-app-pub-6181092189054832/5947364546';
process.env.ADMOB_IOS_APP_ID = 'ca-app-pub-6181092189054832~9363047132';
process.env.ADMOB_IOS_REWARDED_ID = 'ca-app-pub-6181092189054832/6279263382';
process.env.ADMOB_IOS_INTERSTITIAL_ID = 'ca-app-pub-6181092189054832/1975419817';
process.env.ADMOB_IOS_BANNER_ID = 'ca-app-pub-6181092189054832/3604713177';
process.env.ADMOB_IOS_NATIVE_ID = 'ca-app-pub-6181092189054832/4774610025';

console.log('Environment variables set successfully');
console.log('MongoDB URI:', process.env.MONGODB_URI);
console.log('Base URL:', process.env.BASE_URL);
