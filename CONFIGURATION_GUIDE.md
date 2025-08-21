# 🎛️ Spin & Earn Configuration Guide

## 📋 **Overview**

The Spin & Earn admin interface now includes comprehensive configuration management. You can modify all game settings, rewards, security measures, and app behavior directly from the admin dashboard.

## 🔧 **Configuration Sections**

### 1. **Rewards Configuration** (Public)
Control how users earn coins and rewards.

| Setting | Description | Default | Range |
|---------|-------------|---------|-------|
| Base Spin Reward | Base coins per spin | 1 | 1-100 |
| Minimum Spin Reward | Minimum coins per spin | 1 | 1-50 |
| Maximum Spin Reward | Maximum coins per spin | 100 | 10-1000 |
| Jackpot Reward | Jackpot coins amount | 100 | 100-10000 |
| Referrer Bonus | Coins for referring someone | 50 | 10-500 |
| Invitee Bonus | Coins for being referred | 25 | 10-500 |
| Qualify After Coins | Coins needed for referrals | 100 | 50-1000 |

### 2. **Streak Bonuses** (Public)
Configure daily streak rewards and multipliers.

| Setting | Description | Default | Range |
|---------|-------------|---------|-------|
| Streak Bonus Multiplier | Multiplier for streak bonuses | 1.5 | 1-5 |
| Maximum Streak Days | Max days for streak bonus | 7 | 7-365 |
| Day 1 Bonus | Bonus for 1 day streak | 10 | 0-100 |
| Day 3 Bonus | Bonus for 3 day streak | 25 | 0-200 |
| Day 7 Bonus | Bonus for 7 day streak | 100 | 0-500 |
| Day 30 Bonus | Bonus for 30 day streak | 500 | 0-2000 |

### 3. **Daily Limits & Caps** (Public)
Set daily limits and restrictions.

| Setting | Description | Default | Range |
|---------|-------------|---------|-------|
| Max Spins Per Day | Maximum spins allowed per day | 50 | 5-200 |
| Min Seconds Between Spins | Minimum time between spins | 30 | 5-300 |
| Max Rewarded Spins Per Day | Maximum rewarded spins per day | 20 | 5-100 |
| Daily Coin Cap | Maximum coins earned per day | 500 | 100-5000 |

### 4. **Spin Wheel Weights** (Private)
Configure probability weights for spin wheel outcomes.

| Setting | Description | Default | Range |
|---------|-------------|---------|-------|
| 2 Coins Weight | Probability weight for 2 coins | 30 | 1-100 |
| 5 Coins Weight | Probability weight for 5 coins | 25 | 1-100 |
| 10 Coins Weight | Probability weight for 10 coins | 20 | 1-100 |
| 20 Coins Weight | Probability weight for 20 coins | 15 | 1-100 |
| 50 Coins Weight | Probability weight for 50 coins | 7 | 1-100 |
| Jackpot Weight | Probability weight for jackpot | 1 | 1-10 |
| Bonus Spin Weight | Probability weight for bonus spin | 1 | 1-10 |
| Try Again Weight | Probability weight for try again | 1 | 1-10 |

### 5. **Withdrawal Settings** (Public)
Configure withdrawal limits and fees.

| Setting | Description | Default | Range |
|---------|-------------|---------|-------|
| Minimum Withdrawal | Minimum coins for withdrawal | 1000 | 100-10000 |
| Withdrawal Fee (%) | Percentage fee for withdrawals | 5% | 0-20% |
| Cooldown Hours | Hours between withdrawals | 24 | 0-168 |
| Max Withdrawals Per Day | Maximum withdrawal requests per day | 3 | 1-10 |
| Auto-Approve Limit | Auto-approve withdrawals under this amount | 100 | 0-1000 |

### 6. **Security Settings** (Private)
Configure anti-fraud and security measures.

| Setting | Description | Default | Range |
|---------|-------------|---------|-------|
| Allow Emulators | Allow users on emulators | Disabled | Boolean |
| Rooted Device Penalty | Reward multiplier for rooted devices | 0.5 | 0-1 |
| IP Velocity Window (sec) | Time window for IP velocity checks | 3600 | 300-86400 |
| Max Actions Per Window | Maximum actions per time window | 100 | 10-1000 |
| Max Devices Per User | Maximum devices per user account | 3 | 1-10 |
| Suspicious IP Threshold | Actions per IP before flagging | 10 | 5-100 |

### 7. **Email Settings** (Private)
Configure email notifications and magic links.

| Setting | Description | Default |
|---------|-------------|---------|
| Enable Email Features | Enable email notifications and magic links | Disabled |
| SMTP Host | SMTP server hostname | smtp.gmail.com |
| SMTP Port | SMTP server port | 587 |
| SMTP Username | SMTP authentication username | - |
| SMTP Password | SMTP authentication password | - |
| From Email | Sender email address | noreply@spinearn.com |
| From Name | Sender display name | Spin & Earn |

### 8. **App Settings** (Public)
Configure app-wide settings and features.

| Setting | Description | Default |
|---------|-------------|---------|
| Maintenance Mode | Enable maintenance mode | Disabled |
| Maintenance Message | Message shown during maintenance | "We are currently performing maintenance..." |
| App Version | Current app version | 1.0.0 |
| Minimum App Version | Minimum required app version | 1.0.0 |
| Force Update | Force users to update app | Disabled |
| Update Message | Message shown for forced updates | "Please update to the latest version..." |

## 🎯 **How to Use**

### **Accessing Configuration**
1. Log into the admin dashboard
2. Navigate to the "Configuration" page
3. You'll see all configuration sections organized by category

### **Making Changes**
1. **Individual Section**: Click "Save Changes" on any section to save just that section
2. **All Sections**: Click "Save All Changes" to save all modified sections at once
3. **Reset**: Click "Reset to Defaults" to restore all configurations to default values

### **Public vs Private**
- **Public**: These settings are visible to users and affect game behavior
- **Private**: These settings are for internal use and security

## ⚠️ **Important Notes**

### **Security Considerations**
- **Wheel Weights**: Changing these affects the game's profitability
- **Security Settings**: Be careful with anti-fraud settings
- **Email Settings**: Keep SMTP credentials secure

### **Performance Impact**
- **Rate Limits**: Higher limits may increase server load
- **Daily Caps**: Lower caps may reduce user engagement
- **Withdrawal Limits**: Balance between user experience and fraud prevention

### **User Experience**
- **Rewards**: Higher rewards increase user satisfaction but reduce profitability
- **Streaks**: Encourage daily engagement
- **Maintenance Mode**: Use for updates and maintenance

## 🔄 **Best Practices**

### **Testing Changes**
1. Make changes in a test environment first
2. Monitor user behavior after changes
3. Adjust gradually rather than making large changes

### **Monitoring**
- Track user engagement metrics
- Monitor withdrawal patterns
- Watch for unusual activity patterns

### **Backup**
- Export configurations before major changes
- Keep a record of successful configurations
- Document the reasoning behind changes

## 🚀 **Quick Start Recommendations**

### **For New Apps**
1. Start with conservative reward settings
2. Enable basic security measures
3. Set reasonable daily limits
4. Monitor and adjust based on user behavior

### **For Growing Apps**
1. Gradually increase rewards as user base grows
2. Implement more sophisticated security measures
3. Optimize wheel weights based on user data
4. Enable email features for better user engagement

---

**Last Updated**: August 21, 2024
**Status**: ✅ Complete and Ready for Use
