import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import * as crypto from 'crypto';
import User from '../models/User.js';
import RewardGrant from '../models/RewardGrant.js';
import WalletTx from '../models/WalletTx.js';
import { ValidationError, UnauthorizedError } from '../utils/errors.js';
import logger from '../utils/logger.js';
import config from '../config/index.js';

export class AdsController {
  static async ssvWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const firstError = errors.array()[0];
        throw new ValidationError(firstError?.msg || 'Validation failed');
      }

      const {
        user_id,
        ad_unit_id,
        reward_amount,
        reward_type,
        timestamp,
        signature
      } = req.body;

      // Verify signature (Google's SSV signature verification)
      const isValidSignature = this.verifySSVSignature(req.body, signature);
      if (!isValidSignature) {
        throw new UnauthorizedError('Invalid SSV signature');
      }

      // Verify ad unit ID against allowlist
      const validAdUnitIds = [
        config.ADMOB_ANDROID_REWARDED_ID,
        config.ADMOB_IOS_REWARDED_ID
      ];

      if (!validAdUnitIds.includes(ad_unit_id)) {
        logger.warn('Invalid ad unit ID in SSV webhook', { 
          adUnitId: ad_unit_id, 
          validIds: validAdUnitIds 
        });
        throw new ValidationError('Invalid ad unit ID');
      }

      // Check for idempotency
      const idempotencyKey = `${user_id}:${ad_unit_id}:${timestamp}`;
      const existingGrant = await RewardGrant.findOne({ idempotencyKey });
      if (existingGrant) {
        logger.info('SSV duplicate request ignored', { idempotencyKey });
        res.json({ success: true, message: 'Already processed' });
        return;
      }

      // Find user
      const user = await User.findById(user_id);
      if (!user) {
        throw new ValidationError('User not found');
      }

      if (user.flags.blocked || user.flags.shadowBanned) {
        throw new ValidationError('User account restricted');
      }

      // Check daily caps
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const rewardedToday = await RewardGrant.countDocuments({
        userId: user._id,
        reason: 'ssv',
        createdAt: { $gte: today }
      });

      // Get config for daily cap
      const spinConfig = await this.getSpinConfig();
      if (rewardedToday >= spinConfig.caps.maxRewardedPerDay) {
        throw new ValidationError('Daily rewarded ad limit reached');
      }

      // Calculate reward amount (default to 5 coins per rewarded video)
      const coinsToGrant = reward_amount || 5;

      // Atomic transaction
      const session = await User.startSession();
      let balanceAfter = 0;

      try {
        await session.withTransaction(async () => {
          // Create reward grant
          const rewardGrant = new RewardGrant({
            userId: user._id,
            reason: 'ssv',
            amount: coinsToGrant,
            idempotencyKey,
            metadata: {
              adUnitId: ad_unit_id,
              rewardType: reward_type,
              timestamp,
              signature
            }
          });
          await rewardGrant.save({ session });

          // Update user balance
          user.balances.coins += coinsToGrant;
          balanceAfter = user.balances.coins;
          await user.save({ session });

          // Create wallet transaction
          const walletTx = new WalletTx({
            userId: user._id,
            type: 'credit',
            amount: coinsToGrant,
            balanceAfter,
            origin: 'ssv',
            referenceId: rewardGrant._id
          });
          await walletTx.save({ session });
        });
      } finally {
        await session.endSession();
      }

      logger.info('SSV reward granted', {
        userId: user._id,
        adUnitId: ad_unit_id,
        coins: coinsToGrant,
        balanceAfter
      });

      res.json({
        success: true,
        message: 'Reward granted successfully',
        data: {
          coins: coinsToGrant,
          balanceAfter
        }
      });
    } catch (error) {
      next(error);
    }
  }

  private static verifySSVSignature(payload: any, signature: string): boolean {
    // In a real implementation, you would verify Google's signature
    // For now, we'll use a simplified verification with shared secret
    const data = JSON.stringify(payload);
    const expectedSignature = crypto
      .createHmac('sha256', config.SSV_SHARED_SECRET)
      .update(data)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }

  private static async getSpinConfig(): Promise<any> {
    // This would typically come from the Config model
    // For now, return a default configuration
    return {
      caps: {
        maxRewardedPerDay: 20
      }
    };
  }
}

// Validation middleware
export const ssvValidation = [
  body('user_id').notEmpty().withMessage('User ID is required'),
  body('ad_unit_id').notEmpty().withMessage('Ad unit ID is required'),
  body('reward_amount').optional().isNumeric().withMessage('Reward amount must be numeric'),
  body('reward_type').optional().isString().withMessage('Reward type must be string'),
  body('timestamp').notEmpty().withMessage('Timestamp is required'),
  body('signature').notEmpty().withMessage('Signature is required')
];
