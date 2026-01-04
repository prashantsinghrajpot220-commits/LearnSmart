import { useUserStore } from '@/store/userStore';
import { notificationService } from './NotificationService';

export class GamificationService {
  private static instance: GamificationService;

  static getInstance(): GamificationService {
    if (!GamificationService.instance) {
      GamificationService.instance = new GamificationService();
    }
    return GamificationService.instance;
  }

  // SmartCoin Rewards
  async awardSmartCoins(amount: number, reason: string, type: 'earned' | 'spent' = 'earned') {
    const { addSmartCoins, addCoinTransaction, notificationPreferences } = useUserStore.getState();

    if (type === 'earned') {
      await addSmartCoins(amount, reason);
      await addCoinTransaction({ amount, reason, type: 'earned' });

      // Check for milestone after earning coins
      await this.checkCoinMilestones(amount);
    } else {
      await addCoinTransaction({ amount: -amount, reason, type: 'spent' });
    }
  }

  // Award coins for helpful answer
  async awardForHelpfulAnswer() {
    const { notificationPreferences } = useUserStore.getState();

    if (notificationPreferences.helpfulMarks) {
      notificationService.notifyHelpfulMark({
        coins: 5,
      });
    }

    await this.awardSmartCoins(5, 'Helpful answer marked');
  }

  // Award coins for badge unlock
  async awardForBadgeUnlock(badgeName: string, badgeId: string) {
    const coinAmount = this.getBadgeCoinAmount(badgeId);

    if (coinAmount > 0) {
      await this.awardSmartCoins(coinAmount, `Badge unlocked: ${badgeName}`);
    }
  }

  private getBadgeCoinAmount(badgeId: string): number {
    switch (badgeId) {
      case 'helper':
        return 10;
      case 'expert':
        return 25;
      case 'community_star':
        return 50;
      default:
        return 5;
    }
  }

  // Award coins for posting answer (optional bonus)
  async awardForAnswerPosted() {
    await this.updateAnswerStreak();
    await this.awardSmartCoins(1, 'Answer posted');
  }

  // Award coins for milestone
  async awardForMilestone(milestone: string, coins: number) {
    const { notificationPreferences } = useUserStore.getState();

    if (notificationPreferences.milestones) {
      notificationService.notifyMilestone({
        milestone,
        coins,
      });
    }

    await this.awardSmartCoins(coins, `Milestone: ${milestone}`);
  }

  // Update answer streak
  async updateAnswerStreak() {
    const { updateAnswerStreak, answerStreakCount } = useUserStore.getState();

    await updateAnswerStreak();

    const newStreak = useUserStore.getState().answerStreakCount;

    // Check for streak milestones
    if (newStreak === 7 && answerStreakCount < 7) {
      await this.awardForMilestone('7-day answer streak', 20);
    } else if (newStreak === 30 && answerStreakCount < 30) {
      await this.awardForMilestone('30-day answer streak', 100);
    }
  }

  // Check for coin milestones
  private async checkCoinMilestones(amountEarned: number) {
    const { gamificationData } = useUserStore.getState();
    const currentCoins = gamificationData.smartCoins;

    const milestones = [
      { threshold: 100, coins: 10, name: '100 coins reached' },
      { threshold: 500, coins: 25, name: '500 coins reached' },
      { threshold: 1000, coins: 50, name: '1000 coins reached' },
    ];

    for (const milestone of milestones) {
      const wasBelow = currentCoins - amountEarned < milestone.threshold;
      const isNowAt = currentCoins >= milestone.threshold;

      if (wasBelow && isNowAt) {
        await this.awardForMilestone(milestone.name, milestone.coins);
      }
    }
  }

  // Check for answer count milestones
  async checkAnswerCountMilestones() {
    const { userAnswers, notificationPreferences } = useUserStore.getState();
    const answerCount = userAnswers.length;

    const milestones = [
      { threshold: 10, coins: 15, name: '10 questions answered' },
      { threshold: 50, coins: 50, name: '50 questions answered' },
      { threshold: 100, coins: 100, name: '100 questions answered' },
    ];

    for (const milestone of milestones) {
      const wasBelow = answerCount - 1 < milestone.threshold;
      const isNowAt = answerCount >= milestone.threshold;

      if (wasBelow && isNowAt && notificationPreferences.milestones) {
        await this.awardForMilestone(milestone.name, milestone.coins);
      }
    }
  }

  // Check for helpful count milestones
  async checkHelpfulCountMilestones(helpfulCount: number) {
    const { notificationPreferences } = useUserStore.getState();

    const milestones = [
      { threshold: 10, coins: 15, name: '10 helpful marks' },
      { threshold: 50, coins: 50, name: '50 helpful marks' },
      { threshold: 100, coins: 100, name: '100 helpful marks' },
    ];

    for (const milestone of milestones) {
      const wasBelow = helpfulCount - 1 < milestone.threshold;
      const isNowAt = helpfulCount >= milestone.threshold;

      if (wasBelow && isNowAt && notificationPreferences.milestones) {
        await this.awardForMilestone(milestone.name, milestone.coins);
      }
    }
  }

  // Check for leaderboard position updates
  async checkLeaderboardPosition(newRank: number, previousRank: number) {
    const { notificationPreferences } = useUserStore.getState();

    if (!notificationPreferences.leaderboardUpdates) {
      return;
    }

    // Check if user entered top 10
    if (previousRank > 10 && newRank <= 10) {
      notificationService.notifyLeaderboard({
        rank: newRank,
        message: "You're in the top 10 most helpful students!",
      });
    }

    // Check if user moved up significantly
    if (previousRank - newRank >= 5 && newRank <= 50) {
      notificationService.notifyLeaderboard({
        rank: newRank,
        message: `You moved up ${previousRank - newRank} positions on the leaderboard!`,
      });
    }
  }

  // Debounce notifications to prevent spam
  private lastNotificationTime = new Map<string, number>();
  private readonly DEBOUNCE_MS = 60000; // 1 minute

  shouldSendNotification(type: string, key: string): boolean {
    const notificationKey = `${type}_${key}`;
    const lastTime = this.lastNotificationTime.get(notificationKey);
    const now = Date.now();

    if (lastTime && now - lastTime < this.DEBOUNCE_MS) {
      return false;
    }

    this.lastNotificationTime.set(notificationKey, now);
    return true;
  }
}

export const gamificationService = GamificationService.getInstance();
