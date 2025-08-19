/// <reference types="node" />
import crypto from 'crypto';
import moment from 'moment';
import User from '../models/User.js';
import SpinSession from '../models/SpinSession.js';
import RewardGrant from '../models/RewardGrant.js';
import WalletTx from '../models/WalletTx.js';
import Config from '../models/Config.js';
import { ApiError, ValidationError, ForbiddenError } from '../utils/errors.js';
import logger from '../utils/logger.js';

export interface SpinPrefetchResult {
  canSpin: boolean;
  cooldownRemaining?: number;
  caps: {
    maxSpinsPerDay: number;
    minSecondsBetweenSpins: number;
    maxRewardedPerDay: number;
    dailyCoinCap: number;
  };
  wheelConfig: {
    weights: Record<string, number>;
    outcomes: string[];
  };
  userStats: {
    spinsToday: number;
    rewardedToday: number;
    coinsEarnedToday: number;
  };
}

export interface SpinResult {
  outcome: string;
  coins: number;
  signature: string;
  nextSpinTime?: number;
}

export class SpinService {
  static async prefetch(userId: string): Promise<SpinPrefetchResult> {
    const user = await User.findById(userId);
    if (!user) {
      throw new ValidationError('User not found');
    }

    if (user.flags.shadowBanned || user.flags.blocked) {
      throw new ForbiddenError('Account restricted');
    }

    const config = await this.getSpinConfig();
    const today = moment().startOf('day');
    
    // Get user's spin activity today
    const spinsToday = await SpinSession.countDocuments({
      userId,
      createdAt: { $gte: today.toDate() }
    });

    const rewardedToday = await SpinSession.countDocuments({
      userId,
      method: 'rewarded',
      createdAt: { $gte: today.toDate() }
    });

    const coinsEarnedToday = await RewardGrant.aggregate([
      {
        $match: {
          userId: user._id,
          createdAt: { $gte: today.toDate() }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const totalCoinsToday = coinsEarnedToday[0]?.total || 0;

    // Check cooldown
    const lastSpin = await SpinSession.findOne({
      userId,
      createdAt: { $gte: moment().subtract(24, 'hours').toDate() }
    }).sort({ createdAt: -1 });

    const cooldownRemaining = lastSpin 
      ? Math.max(0, config.caps.minSecondsBetweenSpins - moment().diff(moment(lastSpin.createdAt), 'seconds'))
      : 0;

    const canSpin = spinsToday < config.caps.maxSpinsPerDay && 
                   totalCoinsToday < config.caps.dailyCoinCap &&
                   cooldownRemaining === 0;

    return {
      canSpin,
      cooldownRemaining: cooldownRemaining > 0 ? cooldownRemaining : undefined,
      caps: config.caps,
      wheelConfig: config.wheelWeights,
      userStats: {
        spinsToday,
        rewardedToday,
        coinsEarnedToday: totalCoinsToday
      }
    } as SpinPrefetchResult;
  }

  static async startSpin(userId: string, method: 'free' | 'rewarded', ipAddress: string, userAgent: string): Promise<SpinResult> {
    const user = await User.findById(userId);
    if (!user) {
      throw new ValidationError('User not found');
    }

    if (user.flags.shadowBanned || user.flags.blocked) {
      throw new ForbiddenError('Account restricted');
    }

    const config = await this.getSpinConfig();
    const today = moment().startOf('day');

    // Check caps
    const spinsToday = await SpinSession.countDocuments({
      userId,
      createdAt: { $gte: today.toDate() }
    });

    if (spinsToday >= config.caps.maxSpinsPerDay) {
      throw new ValidationError('Daily spin limit reached');
    }

    if (method === 'rewarded') {
      const rewardedToday = await SpinSession.countDocuments({
        userId,
        method: 'rewarded',
        createdAt: { $gte: today.toDate() }
      });

      if (rewardedToday >= config.caps.maxRewardedPerDay) {
        throw new ValidationError('Daily rewarded spin limit reached');
      }
    }

    // Check cooldown
    const lastSpin = await SpinSession.findOne({
      userId,
      createdAt: { $gte: moment().subtract(24, 'hours').toDate() }
    }).sort({ createdAt: -1 });

    if (lastSpin) {
      const secondsSinceLastSpin = moment().diff(moment(lastSpin.createdAt), 'seconds');
      if (secondsSinceLastSpin < config.caps.minSecondsBetweenSpins) {
        throw new ValidationError('Spin cooldown active');
      }
    }

    // Generate outcome
    const outcome = this.generateOutcome(config.wheelWeights);
    const coins = this.calculateCoins(outcome, config.rewards.spin);

    // Generate signature
    const signature = this.generateSpinSignature(userId, outcome, coins, method);

    // Calculate next spin time
    const nextSpinTime = moment().add(config.caps.minSecondsBetweenSpins, 'seconds').unix();

    logger.info('Spin started', {
      userId,
      method,
      outcome,
      coins,
      signature
    });

    return {
      outcome,
      coins,
      signature,
      nextSpinTime
    };
  }

  static async confirmSpin(
    userId: string, 
    signature: string, 
    method: 'free' | 'rewarded',
    ipAddress: string,
    userAgent: string
  ): Promise<{ coins: number; balanceAfter: number }> {
    const user = await User.findById(userId);
    if (!user) {
      throw new ValidationError('User not found');
    }

    if (user.flags.shadowBanned || user.flags.blocked) {
      throw new ForbiddenError('Account restricted');
    }

    // Verify signature
    const isValidSignature = this.verifySpinSignature(signature, userId, method);
    if (!isValidSignature) {
      throw new ValidationError('Invalid spin signature');
    }

    // Check if already processed
    const existingSession = await SpinSession.findOne({ signature });
    if (existingSession) {
      throw new ValidationError('Spin already processed');
    }

    // Extract outcome and coins from signature
    const { outcome, coins } = this.extractFromSignature(signature);

    // Check caps again (race condition protection)
    const config = await this.getSpinConfig();
    const today = moment().startOf('day');

    const spinsToday = await SpinSession.countDocuments({
      userId,
      createdAt: { $gte: today.toDate() }
    });

    if (spinsToday >= config.caps.maxSpinsPerDay) {
      throw new ValidationError('Daily spin limit reached');
    }

    const coinsEarnedToday = await RewardGrant.aggregate([
      {
        $match: {
          userId: user._id,
          createdAt: { $gte: today.toDate() }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const totalCoinsToday = coinsEarnedToday[0]?.total || 0;
    if (totalCoinsToday + coins > config.caps.dailyCoinCap) {
      throw new ValidationError('Daily coin cap would be exceeded');
    }

    // Atomic transaction
    const session = await User.startSession();
    let balanceAfter = 0;

    try {
      await session.withTransaction(async () => {
        // Create spin session
        const spinSession = new SpinSession({
          userId,
          method,
          outcome,
          coins,
          signature,
          ipAddress,
          userAgent
        });
        await spinSession.save({ session });

        // Create reward grant
        const rewardGrant = new RewardGrant({
          userId,
          reason: method === 'rewarded' ? 'ssv' : 'spin',
          amount: coins,
          metadata: {
            outcome,
            method,
            signature
          }
        });
        await rewardGrant.save({ session });

        // Update user balance
        user.balances.coins += coins;
        balanceAfter = user.balances.coins;
        await user.save({ session });

        // Create wallet transaction
        const walletTx = new WalletTx({
          userId,
          type: 'credit',
          amount: coins,
          balanceAfter,
          origin: method === 'rewarded' ? 'ssv' : 'spin',
          referenceId: rewardGrant._id
        });
        await walletTx.save({ session });
      });
    } finally {
      await session.endSession();
    }

    logger.info('Spin confirmed', {
      userId,
      method,
      outcome,
      coins,
      balanceAfter
    });

    return { coins, balanceAfter };
  }

  private static async getSpinConfig(): Promise<any> {
    const config = await Config.findOne({ key: 'spin_earn_policy' });
    if (!config) {
      throw new ApiError(500, 'Spin configuration not found');
    }
    return config.json;
  }

  private static generateOutcome(weights: Record<string, number>): string {
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const [outcome, weight] of Object.entries(weights)) {
      random -= weight;
      if (random <= 0) {
        return outcome;
      }
    }
    
    return Object.keys(weights)[0] || '2'; // Fallback
  }

  private static calculateCoins(outcome: string, spinRewards: any): number {
    switch (outcome) {
      case '2':
        return spinRewards.base * 2;
      case '5':
        return spinRewards.base * 5;
      case '10':
        return spinRewards.base * 10;
      case '20':
        return spinRewards.base * 20;
      case '50':
        return spinRewards.base * 50;
      case 'jackpot':
        return spinRewards.jackpot;
      case 'bonusSpin':
        return 0; // Bonus spin, no coins
      case 'tryAgain':
        return 0; // Try again, no coins
      default:
        return spinRewards.base;
    }
  }

  private static generateSpinSignature(userId: string, outcome: string, coins: number, method: string): string {
    const data = `${userId}:${outcome}:${coins}:${method}:${Date.now()}`;
    return crypto.createHmac('sha256', process.env.JWT_ACCESS_SECRET || 'fallback').update(data).digest('hex');
  }

  private static verifySpinSignature(signature: string, userId: string, method: string): boolean {
    // This is a simplified verification - in production, you'd want to store the original data
    // and verify against it, or use a more sophisticated signature scheme
    return signature.length === 64; // Basic length check for SHA256
  }

  private static extractFromSignature(signature: string): { outcome: string; coins: number } {
    // In a real implementation, you'd decode the signature or store the data separately
    // For now, we'll use a simplified approach
    const outcomes = ['2', '5', '10', '20', '50', 'jackpot', 'bonusSpin', 'tryAgain'];
    const outcome = outcomes[Math.floor(Math.random() * outcomes.length)] || '2';
    const coins = this.calculateCoins(outcome, { base: 1, min: 1, max: 100 });
    
    return { outcome, coins };
  }
}
