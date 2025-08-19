# Spin & Earn Deployment Checklist

This checklist covers all steps required to deploy and configure the Spin & Earn system.

## 🔧 Pre-Deployment Setup

### 1. Environment Configuration
- [ ] Copy `server/env.sample` to `server/.env`
- [ ] Configure MongoDB Atlas connection string
- [ ] Set JWT secrets (generate strong random strings)
- [ ] Configure CORS origins for your domains
- [ ] Set SSV shared secret for AdMob
- [ ] Configure AdMob IDs for Android and iOS
- [ ] Set rate limiting parameters

### 2. Database Setup
- [ ] Create MongoDB Atlas cluster
- [ ] Set up database user with read/write permissions
- [ ] Configure network access (IP whitelist or 0.0.0.0/0)
- [ ] Run database seed: `npm run seed`
- [ ] Verify `spin_earn_policy` config is created

### 3. Local Testing
- [ ] Install dependencies: `npm install`
- [ ] Start development server: `npm run dev`
- [ ] Test health endpoint: `GET /healthz`
- [ ] Test user registration: `POST /api/v1/auth/register`
- [ ] Test user login: `POST /api/v1/auth/login`
- [ ] Test spin prefetch: `GET /api/v1/spin/prefetch`

## 🚀 Render.com Deployment

### 1. Repository Setup
- [ ] Push code to GitHub repository
- [ ] Ensure repository is public or Render has access
- [ ] Verify `server/` directory structure is correct

### 2. Render Service Configuration
- [ ] Create new Web Service on Render
- [ ] Connect GitHub repository
- [ ] Set root directory to `server`
- [ ] Set build command: `npm ci && npm run build`
- [ ] Set start command: `npm start`
- [ ] Set Node version to 20

### 3. Environment Variables
- [ ] Add all variables from `server/env.sample`
- [ ] Set `NODE_ENV=production`
- [ ] Set `BASE_URL` to your Render service URL
- [ ] Configure `ALLOWED_ORIGINS` with your domains
- [ ] Set production JWT secrets
- [ ] Configure production MongoDB URI

### 4. Health Check
- [ ] Set health check path to `/healthz`
- [ ] Verify service starts successfully
- [ ] Test health endpoint returns 200

## 📱 AdMob Configuration

### 1. AdMob Console Setup
- [ ] Create AdMob account
- [ ] Create app for Android
- [ ] Create app for iOS
- [ ] Generate ad unit IDs for:
  - Rewarded video
  - Interstitial
  - Banner
  - Native

### 2. Server-Side Verification (SSV)
- [ ] Set SSV URL in AdMob console:
  ```
  https://your-render-service.onrender.com/api/v1/ads/ssv
  ```
- [ ] Configure SSV shared secret
- [ ] Test SSV webhook with sample payload
- [ ] Verify rewards are credited correctly

### 3. Mediation Setup
- [ ] Configure Unity Ads mediation
- [ ] Configure AppLovin mediation
- [ ] Configure Meta Audience Network
- [ ] Set up waterfall configuration

## 🔒 Security Configuration

### 1. Authentication
- [ ] Generate strong JWT secrets
- [ ] Configure token expiration times
- [ ] Test token refresh flow
- [ ] Verify device binding works

### 2. Rate Limiting
- [ ] Configure rate limits for API endpoints
- [ ] Set up auth-specific rate limits
- [ ] Test rate limiting behavior
- [ ] Monitor for false positives

### 3. Anti-Fraud
- [ ] Test device fingerprinting
- [ ] Verify emulator detection
- [ ] Test IP velocity checks
- [ ] Configure shadow ban thresholds

## 📊 Monitoring & Analytics

### 1. Logging
- [ ] Verify structured logs are working
- [ ] Set up log aggregation (optional)
- [ ] Configure error tracking
- [ ] Test error handling

### 2. Health Monitoring
- [ ] Set up uptime monitoring
- [ ] Configure alerting for downtime
- [ ] Monitor API response times
- [ ] Track error rates

### 3. Business Metrics
- [ ] Set up DAU tracking
- [ ] Monitor retention rates
- [ ] Track rewarded ad completion
- [ ] Monitor fill rates

## 🧪 Testing Checklist

### 1. API Endpoints
- [ ] Health check: `GET /healthz`
- [ ] User registration: `POST /api/v1/auth/register`
- [ ] User login: `POST /api/v1/auth/login`
- [ ] Token refresh: `POST /api/v1/auth/refresh`
- [ ] Spin prefetch: `GET /api/v1/spin/prefetch`
- [ ] Spin start: `POST /api/v1/spin/start`
- [ ] Spin confirm: `POST /api/v1/spin/confirm`
- [ ] SSV webhook: `POST /api/v1/ads/ssv`

### 2. Business Logic
- [ ] Test daily spin limits
- [ ] Verify cooldown enforcement
- [ ] Test daily coin caps
- [ ] Verify atomic transactions
- [ ] Test idempotency for SSV
- [ ] Verify device binding

### 3. Security Tests
- [ ] Test rate limiting
- [ ] Verify JWT validation
- [ ] Test input validation
- [ ] Verify CORS configuration
- [ ] Test anti-fraud measures

## 📋 Post-Deployment

### 1. Documentation
- [ ] Update API documentation
- [ ] Create deployment runbook
- [ ] Document environment variables
- [ ] Create troubleshooting guide

### 2. Monitoring
- [ ] Set up dashboards
- [ ] Configure alerts
- [ ] Monitor performance
- [ ] Track business metrics

### 3. Maintenance
- [ ] Schedule regular backups
- [ ] Plan for scaling
- [ ] Monitor costs
- [ ] Update dependencies

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection**
   - Verify MongoDB URI format
   - Check network access settings
   - Verify user credentials

2. **JWT Issues**
   - Ensure secrets are properly set
   - Check token expiration times
   - Verify signature algorithms

3. **CORS Errors**
   - Check `ALLOWED_ORIGINS` configuration
   - Verify domain names are correct
   - Test with different origins

4. **Rate Limiting**
   - Adjust rate limit parameters
   - Check for legitimate traffic being blocked
   - Monitor rate limit headers

5. **SSV Issues**
   - Verify webhook URL is accessible
   - Check signature verification
   - Test with sample payloads

### Support Resources
- [API Documentation](./docs/api.md)
- [Server README](./server/README.md)
- [GitHub Issues](https://github.com/your-repo/issues)
- [Render Documentation](https://render.com/docs)

## ✅ Final Verification

Before going live:
- [ ] All endpoints return correct responses
- [ ] Database is properly seeded
- [ ] AdMob SSV is working
- [ ] Rate limiting is configured
- [ ] Monitoring is set up
- [ ] Documentation is complete
- [ ] Team is trained on the system
