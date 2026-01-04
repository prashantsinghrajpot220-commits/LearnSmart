import { useUserStore } from '@/store/userStore';

export interface CoinReward {
  amount: number;
  reason: string;
  type: 'lesson' | 'quiz' | 'streak' | 'daily_goal' | 'achievement' | 'rank_up' | 'bonus';
}

export class CoinRewardService {
  private static instance: CoinRewardService;

  static getInstance(): CoinRewardService {
    if (!CoinRewardService.instance) {
      CoinRewardService.instance = new CoinRewardService();
    }
    return CoinRewardService.instance;
  }

  async awardCoins(reward: CoinReward): Promise<boolean> {
    try {
      const { addSmartCoins } = useUserStore.getState();
      await addSmartCoins(reward.amount, reward.reason);
      return true;
    } catch (error) {
      // Failed to award coins - silently fail
      return false;
    }
  }

  // Lesson completion rewards
  async rewardLessonCompletion(perfectScore: boolean = false): Promise<void> {
    const baseReward = 10;
    const bonusReward = perfectScore ? 5 : 0;
    const totalReward = baseReward + bonusReward;

    await this.awardCoins({
      amount: totalReward,
      reason: `Lesson completion${perfectScore ? ' (Perfect Score Bonus)' : ''}`,
      type: 'lesson',
    });
  }

  // Quiz completion rewards
  async rewardQuizCompletion(score: number, totalQuestions: number): Promise<void> {
    let reward = 10; // Base reward
    
    // Perfect score bonus
    if (score === totalQuestions) {
      reward += 5;
    }

    // Score-based bonuses
    const percentage = (score / totalQuestions) * 100;
    if (percentage >= 90) {
      reward += 3; // Excellent performance
    } else if (percentage >= 80) {
      reward += 2; // Good performance
    }

    await this.awardCoins({
      amount: reward,
      reason: `Quiz completion (${score}/${totalQuestions} correct)`,
      type: 'quiz',
    });
  }

  // Daily streak rewards
  async rewardStreakMilestone(streakDays: number): Promise<void> {
    let reward = 0;
    let reason = '';

    switch (streakDays) {
      case 7:
        reward = 5;
        reason = '7-day streak milestone';
        break;
      case 14:
        reward = 10;
        reason = '14-day streak milestone';
        break;
      case 30:
        reward = 25;
        reason = '30-day streak milestone';
        break;
      case 60:
        reward = 50;
        reason = '60-day streak milestone';
        break;
      case 100:
        reward = 100;
        reason = '100-day streak milestone';
        break;
      default:
        return; // No reward for other milestones
    }

    await this.awardCoins({
      amount: reward,
      reason,
      type: 'streak',
    });
  }

  // Daily goal completion
  async rewardDailyGoalCompletion(): Promise<void> {
    await this.awardCoins({
      amount: 10,
      reason: 'Daily goal completed',
      type: 'daily_goal',
    });
  }

  // Achievement unlocks
  async rewardAchievement(achievementName: string): Promise<void> {
    await this.awardCoins({
      amount: 15,
      reason: `Achievement unlocked: ${achievementName}`,
      type: 'achievement',
    });
  }

  // Rank up celebrations
  async rewardRankUp(rankName: string): Promise<void> {
    let reward = 0;

    switch (rankName) {
      case 'Scholar':
        reward = 25;
        break;
      case 'Sage':
        reward = 50;
        break;
      case 'Master':
        reward = 100;
        break;
      case 'Guru':
        reward = 200;
        break;
      default:
        reward = 10;
    }

    await this.awardCoins({
      amount: reward,
      reason: `Rank up: ${rankName}!`,
      type: 'rank_up',
    });
  }

  // Bonus rewards for special events
  async rewardBonus(reason: string, amount: number = 20): Promise<void> {
    await this.awardCoins({
      amount,
      reason,
      type: 'bonus',
    });
  }

  // Calculate total potential earnings for a session
  calculateSessionEarnings(lessonsCompleted: number, quizzesCompleted: number, perfectScores: number, streakBonus: boolean): number {
    let total = 0;

    // Lesson earnings
    total += lessonsCompleted * 10;
    total += perfectScores * 5; // Perfect lesson bonuses

    // Quiz earnings
    total += quizzesCompleted * 10;
    total += perfectScores * 5; // Perfect quiz bonuses

    // Streak bonus
    if (streakBonus) {
      total += 5;
    }

    return total;
  }

  // Get reward history (for display purposes)
  getRewardHistory(): CoinReward[] {
    // In a real app, you'd store and retrieve reward history
    // For now, return empty array
    return [];
  }

  // Check if user should receive streak bonus
  shouldReceiveStreakBonus(currentStreak: number): boolean {
    return [7, 14, 30].includes(currentStreak);
  }

  // Get streak bonus amount
  getStreakBonusAmount(streakDays: number): number {
    const bonuses: { [key: number]: number } = {
      7: 5,
      14: 10,
      30: 25,
      60: 50,
      100: 100,
    };

    return bonuses[streakDays] || 0;
  }
}

export const coinRewardService = CoinRewardService.getInstance();