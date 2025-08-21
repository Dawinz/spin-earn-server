# Spin & Earn Admin Dashboard

A React-based admin dashboard for managing the Spin & Earn platform.

## Features

- **Dashboard**: Overview with key metrics and recent activity
- **User Management**: View, search, and manage user accounts
- **Withdrawal Management**: Approve/reject withdrawal requests
- **Configuration**: Edit app settings and policies
- **Analytics**: View detailed performance metrics
- **Authentication**: Secure admin login with JWT

## Tech Stack

- React 18 with TypeScript
- React Router for navigation
- React Query for data fetching
- Tailwind CSS for styling
- Axios for API communication

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Backend server running (see server README)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update environment variables:
```env
REACT_APP_API_URL=http://localhost:8080/api/v1
```

### Development

Start the development server:
```bash
npm start
```

The admin dashboard will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## Usage

### Login

Use the demo credentials or create an admin user in the backend:
- Email: `admin@spinearn.com`
- Password: `admin123`

### Dashboard

View key metrics including:
- Total users and active users
- Total spins and withdrawals
- Revenue and conversion rates
- Recent activity feed

### User Management

- Search users by email
- View user details (balance, streak, status)
- Block/unblock users
- View user flags (shadow banned, etc.)

### Withdrawal Management

- View pending withdrawal requests
- Approve or reject withdrawals
- Add rejection reasons
- Track withdrawal history

### Configuration

- Edit the `spin_earn_policy` configuration
- Update rewards, caps, and security settings
- JSON editor with validation

### Analytics

- Daily performance metrics
- User activity trends
- Revenue tracking
- Conversion rate analysis

## API Integration

The admin dashboard communicates with the backend API endpoints:

- `/api/v1/auth/*` - Authentication
- `/api/v1/admin/users/*` - User management
- `/api/v1/admin/withdrawals/*` - Withdrawal management
- `/api/v1/admin/config/*` - Configuration management
- `/api/v1/admin/analytics/*` - Analytics data

## Security

- JWT-based authentication
- Automatic token refresh
- Role-based access control
- Secure API communication

## Deployment

The admin dashboard can be deployed to any static hosting service:

1. Build the application:
```bash
npm run build
```

2. Deploy the `build` folder to your hosting service

3. Set the `REACT_APP_API_URL` environment variable to your backend URL

## Contributing

1. Follow the existing code style
2. Add TypeScript types for new features
3. Test thoroughly before submitting changes
4. Update documentation as needed
