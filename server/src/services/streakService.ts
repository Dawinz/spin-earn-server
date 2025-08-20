import User from '../models/User.js';
import Config from '../models/Config.js';
import RewardGrant from '../models/RewardGrant.js';
import WalletTx from '../models/WalletTx.js';
import logger from '../utils/logger.js';

export class StreakService {
  static async claimStreak(userId: string): Promise<any> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check if already claimed today
      if (user.streak.lastClaimDate && user.streak.lastClaimDate >= today) {
        throw new Error('Daily streak already claimed today');
      }

      // Get streak config
      const config = await Config.findOne({ key: 'spin_earn_policy' });
      const streakRewards = config?.json?.rewards?.streak || [5, 10, 15, 20, 25, 30, 50];

      // Calculate streak
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (user.streak.lastClaimDate && user.streak.lastClaimDate >= yesterday) {
        // Consecutive day
        user.streak.current += 1;
      } else {
        // Reset streak
        user.streak.current = 1;
      }

      // Update longest streak
      if (user.streak.current > user.streak.longest) {
        user.streak.longest = user.streak.current;
      }

      // Calculate reward (capped at streak array length)
      const streakIndex = Math.min(user.streak.current - 1, streakRewards.length - 1);
      const coinsRewarded = streakRewards[streakIndex];

      // Update user
      user.streak.lastClaimDate = today;
      user.balances.coins += coinsRewarded;
      await user.save();

      // Create reward grant
      const rewardGrant = new RewardGrant({
        userId: user._id,
        reason: 'streak',
        amount: coinsRewarded,
        metadata: {
          streakDay: user.streak.current,
          streakReward: coinsRewarded
        }
      });
      await rewardGrant.save();

      // Create wallet transaction
      const walletTx = new WalletTx({
        userId: user._id,
        type: 'credit',
        amount: coinsRewarded,
        balanceAfter: user.balances.coins,
        origin: 'streak',
        referenceId: rewardGrant._id
      });
      await walletTx.save();

      logger.info('Streak claimed', { 
        userId, 
        streakDay: user.streak.current, 
        coinsRewarded 
      });

      return {
        streak: user.streak,
        coinsRewarded,
        balanceAfter: user.balances.coins
      };
    } catch (error) {
      logger.error('Error claiming streak', { userId, error });
      throw error;
    }
  }
}
