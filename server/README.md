# Spin & Earn Backend API

A production-ready Node.js backend for the Spin & Earn mobile application, featuring server-authoritative spin mechanics, anti-fraud measures, and AdMob integration.

## Features

- **Server-Authoritative Spins**: All spin outcomes are computed server-side with cryptographic signatures
- **Anti-Fraud System**: Device fingerprinting, IP velocity checks, emulator detection
- **AdMob Integration**: Server-Side Verification (SSV) for rewarded ads
- **Atomic Transactions**: All coin grants and wallet operations are atomic
- **Rate Limiting**: Comprehensive rate limiting and abuse prevention
- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **MongoDB Atlas**: Cloud-hosted database with connection pooling

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB Atlas
- **Authentication**: JWT (Access + Refresh tokens)
- **Validation**: Express-validator + Zod
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate limiting

## Quick Start

### Prerequisites

- Node.js 20+
- MongoDB Atlas account
- Environment variables configured

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.sample .env
   # Edit .env with your configuration
   ```

4. **Database Setup**
   ```bash
   npm run seed
   ```

5. **Development**
   ```bash
   npm run dev
   ```

6. **Production Build**
   ```bash
   npm run build
   npm start
   ```

## Environment Variables

Copy `env.sample` to `.env` and configure:

```env
# Server Configuration
NODE_ENV=development
PORT=8080
BASE_URL=http://localhost:8080

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT Configuration
JWT_ACCESS_SECRET=your-super-secret-access-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=30d

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8081

# Server-Side Verification
SSV_SHARED_SECRET=your-ssv-shared-secret

# Rate Limiting
RATE_WINDOW_SECONDS=60
RATE_MAX_ACTIONS=120

# AdMob Configuration
ADMOB_ANDROID_APP_ID=ca-app-pub-xxx~xxx
ADMOB_ANDROID_REWARDED_ID=ca-app-pub-xxx/xxx
# ... other AdMob IDs
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/magic-link` - Request magic link
- `POST /api/v1/auth/verify-magic-link` - Verify magic link

### Spin & Rewards

- `GET /api/v1/spin/prefetch` - Get spin status and configuration
- `POST /api/v1/spin/start` - Start a spin (returns outcome + signature)
- `POST /api/v1/spin/confirm` - Confirm spin and credit rewards

### AdMob SSV

- `POST /api/v1/ads/ssv` - AdMob Server-Side Verification webhook

### Health Check

- `GET /healthz` - Health check endpoint

## Database Models

### User
- Email, password hash, roles
- Coin balance, streak tracking
- Device binding, fraud flags
- Referral system

### SpinSession
- Spin attempts with outcomes
- Cryptographic signatures
- IP tracking for anti-fraud

### RewardGrant
- All coin grants (atomic)
- Idempotency keys for SSV
- Audit trail

### WalletTx
- Atomic wallet transactions
- Balance tracking
- Transaction history

### Device
- Device fingerprinting
- Anti-fraud detection
- IP velocity tracking

## Security Features

### Anti-Fraud
- Device fingerprinting and binding
- Emulator and root detection
- IP velocity checks
- Shadow banning system
- Rate limiting per IP and user

### Authentication
- JWT with short-lived access tokens
- Refresh token rotation
- Device-based authentication
- Role-based access control

### Data Protection
- Input validation and sanitization
- SQL injection prevention (MongoDB)
- XSS protection (Helmet)
- CORS configuration
- Rate limiting

## Deployment

### Render.com

1. **Connect Repository**
   - Connect your GitHub repository to Render
   - Set root directory to `server`

2. **Build Configuration**
   ```
   Build Command: npm ci && npm run build
   Start Command: npm start
   Node Version: 20
   ```

3. **Environment Variables**
   - Add all environment variables from `.env`
   - Set `NODE_ENV=production`
   - Configure `BASE_URL` to your Render service URL

4. **Health Check**
   - Health check path: `/healthz`

### AdMob SSV Configuration

After deployment, configure AdMob SSV URL:
```
https://your-render-service.onrender.com/api/v1/ads/ssv
```

## Development

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run seed` - Seed database with initial configuration
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

### Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Express middleware
├── models/          # MongoDB models
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utility functions
└── scripts/         # Database scripts
```

## Monitoring & Logging

- **Structured Logging**: Winston with JSON format
- **Error Tracking**: Centralized error handling
- **Health Monitoring**: `/healthz` endpoint
- **Request Logging**: All API requests logged

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
