# Spin & Earn System

A complete end-to-end "Spin & Earn" mobile application system with server-authoritative gameplay, anti-fraud measures, and AdMob monetization.

## 🎯 Overview

Spin & Earn is a lightweight, high-retention mobile app where users spin a wheel to earn coins. The system features robust anti-fraud protection, AdMob mediation, and admin controls for managing the platform.

## 🏗️ Architecture

This is a monorepo with three main components:

```
/spin-and-earn/
├── /server     # Node.js + TypeScript API (Express)
├── /admin      # React Admin UI (Coming Soon)
├── /app        # Flutter Mobile App (Coming Soon)
└── /docs       # Documentation & API Specs
```

## 🚀 Quick Start

### Backend Setup

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp env.sample .env
   # Edit .env with your MongoDB and other settings
   ```

4. **Seed the database**
   ```bash
   npm run seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:8080`

## 📋 Features

### Core Gameplay
- ✅ Server-authoritative spin wheel with weighted outcomes
- ✅ Daily free spins with cooldowns and caps
- ✅ Bonus spins and 2× rewards via rewarded ads
- ✅ Daily login streak with escalating rewards
- ✅ Limited-time boosters

### Monetization
- ✅ AdMob integration (rewarded, interstitial, banner, native)
- ✅ Mediation partners: Unity, AppLovin, Meta Audience Network
- ✅ Server-Side Verification (SSV) for rewarded ads

### Wallet & Payouts
- ✅ Server-side coin ledger with atomic transactions
- ✅ Withdrawal requests with thresholds and fees
- ✅ Admin approval flow
- ✅ Exportable payout lists

### Authentication
- ✅ Email + password registration
- ✅ Passwordless magic link option
- ✅ Device binding (first device becomes primary)
- ✅ JWT with access + refresh tokens

### Anti-Fraud (Day 1)
- ✅ Device fingerprinting and binding
- ✅ Emulator and root detection
- ✅ IP velocity checks
- ✅ Server-side verification for all rewards
- ✅ Spin/day and rewarded/day caps
- ✅ Referral abuse prevention
- ✅ Shadow-ban system

### Admin & Analytics
- ✅ Admin UI for user management
- ✅ Withdrawal approval system
- ✅ Remote configuration editor
- ✅ Basic analytics and KPIs

## 🔧 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/magic-link` - Request magic link

### Spin & Rewards
- `GET /api/v1/spin/prefetch` - Get spin status and config
- `POST /api/v1/spin/start` - Start spin (returns outcome + signature)
- `POST /api/v1/spin/confirm` - Confirm spin and credit rewards

### AdMob SSV
- `POST /api/v1/ads/ssv` - Server-Side Verification webhook

### Health Check
- `GET /healthz` - Health check endpoint

## 🗄️ Database Schema

### Core Models
- **User**: Email, password, roles, balances, streak, device binding
- **Device**: Fingerprint, model, OS, emulator/root detection
- **SpinSession**: Spin attempts with outcomes and signatures
- **RewardGrant**: Atomic coin grants with idempotency
- **WalletTx**: Transaction history with balance tracking
- **WithdrawalRequest**: Payout requests with admin approval
- **Referral**: Referral relationships with abuse prevention
- **Config**: Remote configuration management

## 🔒 Security Features

### Anti-Fraud
- Device fingerprinting and binding
- Emulator and root detection
- IP velocity monitoring
- Rate limiting per user and IP
- Shadow banning for suspicious activity

### Authentication
- JWT with short-lived access tokens
- Refresh token rotation
- Device-based authentication
- Role-based access control

### Data Protection
- Input validation and sanitization
- XSS protection (Helmet)
- CORS configuration
- Rate limiting

## 🚀 Deployment

### Backend to Render.com

1. **Connect Repository**
   - Connect GitHub repo to Render
   - Set root directory to `server`

2. **Build Configuration**
   ```
   Build Command: npm ci && npm run build
   Start Command: npm start
   Node Version: 20
   ```

3. **Environment Variables**
   - Add all variables from `server/env.sample`
   - Set `NODE_ENV=production`
   - Configure `BASE_URL` to your Render URL

4. **Health Check**
   - Path: `/healthz`

### AdMob SSV Configuration

After deployment, set AdMob SSV URL to:
```
https://your-render-service.onrender.com/api/v1/ads/ssv
```

## 📊 Configuration

The system uses remote configuration stored in MongoDB. Initial configuration includes:

- **Spin Rewards**: Base rewards, jackpot amounts, streak bonuses
- **Daily Caps**: Max spins, min cooldown, daily coin limit
- **Wheel Weights**: Probability distribution for outcomes
- **Withdrawal Settings**: Minimum amounts, fees, cooldowns
- **Security Settings**: Emulator policies, penalties, velocity limits

## 🔄 Development Workflow

1. **Backend Development**
   ```bash
   cd server
   npm run dev
   ```

2. **Database Changes**
   ```bash
   npm run seed  # Update configuration
   ```

3. **Testing**
   ```bash
   npm test
   ```

## 📈 Monitoring

- **Health Checks**: `/healthz` endpoint
- **Structured Logging**: Winston with JSON format
- **Error Tracking**: Centralized error handling
- **Request Logging**: All API requests logged

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
1. Check the documentation in `/docs`
2. Review the API specifications
3. Check the server logs for errors
4. Open an issue on GitHub

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Backend API with core features
- ✅ Database models and migrations
- ✅ Anti-fraud system
- ✅ AdMob integration

### Phase 2 (Next)
- 🔄 Admin UI (React)
- 🔄 Flutter mobile app
- 🔄 Advanced analytics
- 🔄 Push notifications

### Phase 3 (Future)
- 📋 Advanced anti-fraud
- 📋 Multi-language support
- 📋 Social features
- �� Tournament system
# spin-and-earn
