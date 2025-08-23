# Spin & Earn Backend API

Node.js + TypeScript backend API for the Spin & Earn application.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🔧 Environment Variables

Create a `.env` file:

```
NODE_ENV=development
PORT=8080
MONGODB_URI=mongodb://localhost:27017/spin-earn
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

## 🎯 Features

- User Authentication & Authorization
- Spin & Rewards System
- Anti-Fraud Protection
- AdMob Integration
- Admin API Endpoints
- Real-time Analytics

## 🚀 Deployment

This repository is configured for Render deployment. Simply connect your GitHub repository to Render and it will automatically deploy.

## 📊 Database Seeding

```bash
npm run seed
```

## 🔒 Security

- JWT Authentication
- Rate Limiting
- Input Validation
- CORS Protection
- Helmet Security Headers
