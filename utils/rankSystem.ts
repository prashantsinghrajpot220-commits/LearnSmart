import { useXPStore, RANKS } from '@/store/xpStore';

export interface RankProgress {
  currentRank: any;
  nextRank: any | null;
  xpToNext: number;
  progress: number;
  rankUp: boolean;
  milestoneReached: string[];
}

export interface RankMilestone {
  rankName: string;
  level: number;
  icon: string;
  color: string;
  message: string;
  unlockConditions: string[];
  benefits: string[];
}

export class RankSystem {
  private static instance: RankSystem;

  static getInstance(): RankSystem {
    if (!RankSystem.instance) {
      RankSystem.instance = new RankSystem();
    }
    return RankSystem.instance;
  }

  // Get current rank with enhanced data
  getCurrentRankData(): RankMilestone {
    const rank = useXPStore.getState().getRank();
    return this.getRankData(rank.name);
  }

  // Get rank data by name
  getRankData(rankName: string): RankMilestone {
    const rank = RANKS.find(r => r.name === rankName);
    if (!rank) {
      return this.getDefaultRankData();
    }

    const milestoneData: RankMilestone = {
      rankName: rank.name,
      level: rank.level,
      icon: rank.icon,
      color: rank.color,
      message: rank.message,
      unlockConditions: this.getUnlockConditions(rank.name),
      benefits: this.getRankBenefits(rank.name),
    };

    return milestoneData;
  }

  // Get unlock conditions for a rank
  private getUnlockConditions(rankName: string): string[] {
    const conditions: { [key: string]: string[] } = {
      'Novice': ['Create an account'],
      'Scholar': ['Reach 500 XP'],
      'Sage': ['Reach 1,500 XP'],
      'Master': ['Reach 3,000 XP'],
      'Guru': ['Reach 5,000 XP'],
    };

    return conditions[rankName] || [];
  }

  // Get benefits for reaching a rank
  private getRankBenefits(rankName: string): string[] {
    const benefits: { [key: string]: string[] } = {
      'Novice': ['Basic avatar selection', 'Access to all lessons'],
      'Scholar': ['Unlock Scholar avatar', 'Weekly leaderboard access', '10 bonus coins'],
      'Sage': ['Unlock Sage avatar', 'Advanced challenges', 'Priority support', '25 bonus coins'],
      'Master': ['Unlock Master avatar', 'Exclusive content', 'Mentor badge', '50 bonus coins'],
      'Guru': ['Unlock Guru avatar', 'VIP features', 'Content creator access', '100 bonus coins'],
    };

    return benefits[rankName] || [];
  }

  // Get rank progression without hooks (for non-component usage)
  getRankProgression(): RankProgress {
    const store = useXPStore.getState();
    const rank = store.getRank();
    const progress = store.getProgressToNextRank();
    const currentXP = store.currentXP;
    const xpToNext = store.getXPToNextRank();
    const currentRankIndex = RANKS.findIndex(r => r.name === rank.name);
    const nextRank = currentRankIndex < RANKS.length - 1 ? RANKS[currentRankIndex + 1] : null;

    return {
      currentRank: this.getRankData(rank.name),
      nextRank: nextRank ? this.getRankData(nextRank.name) : null,
      xpToNext,
      progress,
      rankUp: progress >= 1 && nextRank !== null,
      milestoneReached: this.getMilestoneReached(currentXP),
    };
  }

  // Get milestones reached based on XP
  private getMilestoneReached(currentXP: number): string[] {
    const milestones: string[] = [];
    
    if (currentXP >= 500) milestones.push('Scholar');
    if (currentXP >= 1500) milestones.push('Sage');
    if (currentXP >= 3000) milestones.push('Master');
    if (currentXP >= 5000) milestones.push('Guru');

    return milestones;
  }

  // Check if user can rank up
  canRankUp(): boolean {
    const progression = this.getRankProgression();
    return progression.rankUp;
  }

  // Get XP needed for next rank
  getXPForNextRank(): number {
    const progression = this.getRankProgression();
    return progression.xpToNext;
  }

  // Get progress percentage to next rank
  getProgressPercentage(): number {
    const progression = this.getRankProgression();
    return Math.round(progression.progress * 100);
  }

  // Get estimated time to next rank (based on average daily XP)
  getEstimatedDaysToNextRank(averageDailyXP: number = 50): number {
    const xpNeeded = this.getXPForNextRank();
    if (averageDailyXP <= 0) return 0;
    return Math.ceil(xpNeeded / averageDailyXP);
  }

  // Get rank celebration message
  getRankUpMessage(newRankName: string): string {
    const messages: { [key: string]: string } = {
      'Scholar': '🎓 Welcome to Scholar rank! You\'re becoming a true learner!',
      'Sage': '🧙‍♂️ Congratulations! You\'ve achieved Sage status with wisdom!',
      'Master': '🎉 Incredible! You\'ve reached Master level - excellence achieved!',
      'Guru': '🌟 AMAZING! You\'re now a Guru - ultimate wisdom attained!',
    };

    return messages[newRankName] || '🎊 Congratulations on your achievement!';
  }

  // Get rank-based avatar unlocks
  getRankAvatarUnlocks(): { [key: string]: string[] } {
    return {
      'Novice': ['Robot'],
      'Scholar': ['Owl', 'BookCharacter'],
      'Sage': ['Dragon', 'Wizard', 'BrainCharacter'],
      'Master': ['GoldenOwl', 'Phoenix'],
      'Guru': ['Astronaut', 'Alien'],
    };
  }

  // Get avatars unlocked by current rank
  getUnlockedAvatarsForCurrentRank(): string[] {
    const currentRank = useXPStore.getState().getRank().name;
    const avatarUnlocks = this.getRankAvatarUnlocks();
    return avatarUnlocks[currentRank] || [];
  }

  // Check if user has reached all milestones
  hasReachedAllMilestones(): boolean {
    const currentXP = useXPStore.getState().getXP();
    return currentXP >= 5000; // Guru rank
  }

  // Get next milestone
  getNextMilestone(): { rank: string; xp: number; message: string } | null {
    const currentXP = useXPStore.getState().getXP();
    
    const milestones = [
      { rank: 'Scholar', xp: 500, message: 'Reach 500 XP to become a Scholar' },
      { rank: 'Sage', xp: 1500, message: 'Reach 1,500 XP to achieve Sage status' },
      { rank: 'Master', xp: 3000, message: 'Reach 3,000 XP to become a Master' },
      { rank: 'Guru', xp: 5000, message: 'Reach 5,000 XP to become a Guru' },
    ];

    for (const milestone of milestones) {
      if (currentXP < milestone.xp) {
        return milestone;
      }
    }

    return null; // All milestones reached
  }

  // Get rank history (for display)
  getRankHistory(): Array<{ rank: string; date: string; xp: number }> {
    // In a real app, you'd track when each rank was achieved
    // For now, return empty array
    return [];
  }

  // Default rank data for fallback
  private getDefaultRankData(): RankMilestone {
    return {
      rankName: 'Unknown',
      level: 0,
      icon: '❓',
      color: '#999999',
      message: 'Unknown rank',
      unlockConditions: [],
      benefits: [],
    };
  }

  // Get all ranks with their thresholds
  getAllRanks(): Array<{ name: string; level: number; minXP: number; maxXP: number; icon: string; color: string }> {
    return RANKS.map(rank => ({
      name: rank.name,
      level: rank.level,
      minXP: rank.minXP,
      maxXP: rank.maxXP === Infinity ? 999999 : rank.maxXP,
      icon: rank.icon,
      color: rank.color,
    }));
  }

  // Calculate XP bonus for rank
  getRankXPMultiplier(rankName: string): number {
    const multipliers: { [key: string]: number } = {
      'Novice': 1.0,
      'Scholar': 1.1, // 10% bonus
      'Sage': 1.2,    // 20% bonus
      'Master': 1.3,  // 30% bonus
      'Guru': 1.5,    // 50% bonus
    };

    return multipliers[rankName] || 1.0;
  }

  // Apply XP bonus based on rank
  applyRankBonus(baseXP: number): number {
    const currentRank = useXPStore.getState().getRank().name;
    const multiplier = this.getRankXPMultiplier(currentRank);
    return Math.round(baseXP * multiplier);
  }
}

export const rankSystem = RankSystem.getInstance();