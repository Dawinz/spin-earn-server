import User from '../models/User.js';
import Referral from '../models/Referral.js';
import Config from '../models/Config.js';
import RewardGrant from '../models/RewardGrant.js';
import WalletTx from '../models/WalletTx.js';
import logger from '../utils/logger.js';

export class ReferralsService {
  static async applyReferral(userId: string, referralCode: string): Promise<any> {
    try {
      // Find user by referral code
      const referrer = await User.findOne({ referralCode });
      if (!referrer) {
        throw new Error('Invalid referral code');
      }

      // Check if user is trying to refer themselves
      if ((referrer._id as any).toString() === userId) {
        throw new Error('Cannot refer yourself');
      }

      // Check if user already has a referrer
      const currentUser = await User.findById(userId);
      if (!currentUser) {
        throw new Error('User not found');
      }

      if (currentUser.referredBy) {
        throw new Error('User already has a referrer');
      }

      // Get referral config
      const config = await Config.findOne({ key: 'spin_earn_policy' });
      const referralConfig = config?.json?.rewards?.referral || {
        inviter: 50,
        invitee: 25,
        qualifyAfterCoins: 100
      };

      // Update user with referrer
      currentUser.referredBy = (referrer._id as any).toString();
      await currentUser.save();

      // Create referral record
      const referral = new Referral({
        inviterId: (referrer._id as any).toString(),
        inviteeId: (currentUser._id as any).toString(),
        status: 'registered'
      });
      await referral.save();

      // Give initial bonus to both users
      const inviterBonus = referralConfig.inviter;
      const inviteeBonus = referralConfig.invitee;

      // Update referrer balance
      referrer.balances.coins += inviterBonus;
      await referrer.save();

      // Update invitee balance
      currentUser.balances.coins += inviteeBonus;
      await currentUser.save();

      // Create reward grants and wallet transactions for both users
      await this.createReferralRewards((referrer._id as any).toString(), inviterBonus, 'referral_inviter', (referral._id as any).toString());
      await this.createReferralRewards((currentUser._id as any).toString(), inviteeBonus, 'referral_invitee', (referral._id as any).toString());

      logger.info('Referral applied', { 
        inviterId: (referrer._id as any).toString(), 
        inviteeId: (currentUser._id as any).toString(),
        inviterBonus,
        inviteeBonus
      });

      return {
        referrer: {
          id: (referrer._id as any).toString(),
          email: referrer.email
        },
        inviterBonus,
        inviteeBonus,
        newBalance: currentUser.balances.coins
      };
    } catch (error) {
      logger.error('Error applying referral', { userId, referralCode, error });
      throw error;
    }
  }

  private static async createReferralRewards(userId: string, amount: number, reason: string, referralId: string): Promise<void> {
    // Create reward grant
    const rewardGrant = new RewardGrant({
      userId,
      reason,
      amount,
      metadata: { referralId }
    });
    await rewardGrant.save();

    // Get updated user balance
    const user = await User.findById(userId);
    if (!user) return;

    // Create wallet transaction
    const walletTx = new WalletTx({
      userId,
      type: 'credit',
      amount,
      balanceAfter: user.balances.coins,
      origin: 'referral',
      referenceId: rewardGrant._id
    });
    await walletTx.save();
  }
}
