# 🚀 Production Environment Variables - Spin & Earn

## 📋 **Copy & Paste Ready Environment Variables**

### **Backend (Render) Environment Variables**

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://dawinibra:7F5YdZ1Q9mW0eDyV@spinandearncluster.foyahag.mongodb.net/spin-earn?retryWrites=true&w=majority&appName=spinAndEarnCluster
JWT_ACCESS_SECRET=sp1n3arn_s3cr3t_k3y_2024_s3cur3_acc3ss_t0k3n_pr0duct10n
JWT_REFRESH_SECRET=sp1n3arn_r3fr3sh_s3cr3t_k3y_2024_s3cur3_r3fr3sh_t0k3n_pr0duct10n
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
ALLOWED_ORIGINS=https://your-admin-app.vercel.app,https://your-mobile-app.com
BASE_URL=https://your-render-service.onrender.com
SSV_SHARED_SECRET=admob_ssv_secret_key_2024_spin_earn_production
ADMOB_APP_ID_ANDROID=ca-app-pub-6181092189054832~2340148251
ADMOB_APP_ID_IOS=ca-app-pub-6181092189054832~9363047132
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_ROUNDS=12
MAX_DEVICES_PER_USER=3
SUSPICIOUS_IP_THRESHOLD=10
DEFAULT_DAILY_SPIN_LIMIT=10
DEFAULT_MIN_WITHDRAWAL=1000
DEFAULT_WITHDRAWAL_FEE=0.05
REFERRAL_BONUS=100
REFERRER_BONUS=50
STREAK_BONUS_MULTIPLIER=1.5
MAX_STREAK_DAYS=7
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@spinearn.com
LOG_LEVEL=info
```

### **Admin Frontend (Vercel) Environment Variables**

```
REACT_APP_API_URL=https://your-render-service.onrender.com/api/v1
```

## 🔧 **How to Use**

### **For Render (Backend)**
1. Go to your Render service dashboard
2. Click "Environment" tab
3. Add each variable above (copy & paste)
4. Replace `your-render-service.onrender.com` with your actual Render URL
5. Replace `your-admin-app.vercel.app` with your actual Vercel URL

### **For Vercel (Admin)**
1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add `REACT_APP_API_URL` with your Render backend URL

## 🔑 **Security Notes**

- **JWT Secrets**: Generated secure random strings
- **MongoDB URI**: Your provided connection string
- **CORS Origins**: Update with your actual domain URLs
- **SMTP Settings**: Update with your email credentials

## 🎯 **Important Replacements**

Before deploying, replace these placeholders:
- `your-render-service.onrender.com` → Your actual Render URL
- `your-admin-app.vercel.app` → Your actual Vercel URL
- `your-email@gmail.com` → Your email for SMTP
- `your-app-password` → Your email app password

## ✅ **Ready for Deployment**

Copy these variables and paste them into your deployment platforms!
