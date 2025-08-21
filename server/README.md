# Spin & Earn Server

Simple Node.js + TypeScript backend for the Spin & Earn application.

## Quick Start

```bash
npm install
npm run build
npm start
```

## Development

```bash
npm run dev
```

## Environment Variables

```
NODE_ENV=production
PORT=8080
ALLOWED_ORIGINS=http://localhost:3000
```

## Health Check

- `GET /healthz` - Health check endpoint
- `GET /api/v1/status` - API status

## Deployment

This server is configured for Render.com deployment.

- **Build Command**: `npm ci && npm run build`
- **Start Command**: `npm start`
- **Node Version**: `20`
- **Health Check Path**: `/healthz`
