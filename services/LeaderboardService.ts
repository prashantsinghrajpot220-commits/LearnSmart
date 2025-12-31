import { useUserStore, LeaderboardEntry } from '@/store/userStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface WeeklyLeaderboard {
  weekStart: string;
  entries: LeaderboardEntry[];
  gradeGroup: 'under12' | '12plus';
}

export interface LeaderboardStats {
  totalParticipants: number;
  userRank: number;
  topRankChange: number;
  averageXP: number;
}

export class LeaderboardService {
  private static instance: LeaderboardService;
  private readonly STORAGE_KEY = '@learnsmart_leaderboards';
  private readonly WEEKLY_RESET_KEY = '@learnsmart_last_reset';

  static getInstance(): LeaderboardService {
    if (!LeaderboardService.instance) {
      LeaderboardService.instance = new LeaderboardService();
    }
    return LeaderboardService.instance;
  }

  // Get the start of the current week (Sunday 12 AM)
  getCurrentWeekStart(): string {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysToSubtract = dayOfWeek; // 0 = Sunday, 1 = Monday, etc.
    
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - daysToSubtract);
    weekStart.setHours(0, 0, 0, 0);
    
    return weekStart.toISOString();
  }

  // Check if weekly reset is needed
  async checkWeeklyReset(): Promise<boolean> {
    try {
      const lastReset = await AsyncStorage.getItem(this.WEEKLY_RESET_KEY);
      const currentWeekStart = this.getCurrentWeekStart();

      if (!lastReset || lastReset !== currentWeekStart) {
        await this.resetWeeklyData();
        await AsyncStorage.setItem(this.WEEKLY_RESET_KEY, currentWeekStart);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to check weekly reset:', error);
      return false;
    }
  }

  // Reset all weekly data
  async resetWeeklyData(): Promise<void> {
    try {
      const { resetWeeklyData } = useUserStore.getState();
      resetWeeklyData();
      console.log('Weekly data reset completed');
    } catch (error) {
      console.error('Failed to reset weekly data:', error);
    }
  }

  // Update user's weekly XP
  async updateWeeklyXP(userId: string, xpAmount: number): Promise<void> {
    try {
      const { updateWeeklyXP, gamificationData, userId: currentUserId } = useUserStore.getState();
      
      if (userId === currentUserId) {
        updateWeeklyXP(xpAmount);
      }
      
      // In a real app, you'd also update the server-side leaderboard here
      console.log(`Updated weekly XP for user ${userId}: +${xpAmount}`);
    } catch (error) {
      console.error('Failed to update weekly XP:', error);
    }
  }

  // Generate mock leaderboard data for demo
  generateMockLeaderboard(gradeGroup: 'under12' | '12plus', userCount: number = 50): WeeklyLeaderboard {
    const entries: LeaderboardEntry[] = [];
    const { userId, userName, selectedAvatar, gamificationData } = useUserStore.getState();

    // Add current user
    entries.push({
      userId,
      userName: userName || 'You',
      avatar: selectedAvatar,
      weeklyXP: gamificationData.weeklyXP,
      streak: gamificationData.currentStreak,
      rank: 0, // Will be calculated
    });

    // Generate mock users
    const mockNames = [
      'Alex Chen', 'Sarah Johnson', 'Mike Rodriguez', 'Emma Wilson', 'David Kim',
      'Lisa Park', 'James Brown', 'Maria Garcia', 'John Smith', 'Anna Davis',
      'Ryan Miller', 'Sophie Turner', 'Kevin Lee', 'Rachel Green', 'Daniel White',
      'Olivia Black', 'Ethan Clark', 'Grace Hall', 'Noah Adams', 'Zoe Scott'
    ];

    for (let i = 0; i < userCount - 1; i++) {
      const name = mockNames[i % mockNames.length] + (i >= mockNames.length ? ` ${Math.floor(i / mockNames.length) + 1}` : '');
      const avatars = ['Robot', 'Owl', 'BookCharacter', 'BrainCharacter', 'StarCharacter', 'Dragon', 'Wizard'];
      const avatar = avatars[i % avatars.length];
      
      entries.push({
        userId: `mock_user_${i}`,
        userName: name,
        avatar,
        weeklyXP: Math.floor(Math.random() * 500) + 50, // 50-550 XP
        streak: Math.floor(Math.random() * 30) + 1, // 1-30 day streak
        rank: 0, // Will be calculated
      });
    }

    // Sort by weekly XP descending and assign ranks
    entries.sort((a, b) => b.weeklyXP - a.weeklyXP);
    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return {
      weekStart: this.getCurrentWeekStart(),
      entries,
      gradeGroup,
    };
  }

  // Get leaderboard for user's grade group
  async getLeaderboard(): Promise<WeeklyLeaderboard> {
    await this.checkWeeklyReset();
    
    const { ageGroup } = useUserStore.getState();
    const gradeGroup = ageGroup === 'under12' ? 'under12' : '12plus';

    // For demo, generate mock data
    return this.generateMockLeaderboard(gradeGroup);
  }

  // Get user's rank in leaderboard
  getUserRank(leaderboard: WeeklyLeaderboard): number {
    const { userId } = useUserStore.getState();
    const userEntry = leaderboard.entries.find(entry => entry.userId === userId);
    return userEntry?.rank || 0;
  }

  // Get top 10 entries
  getTopEntries(leaderboard: WeeklyLeaderboard, count: number = 10): LeaderboardEntry[] {
    return leaderboard.entries.slice(0, count);
  }

  // Get leaderboard statistics
  getLeaderboardStats(leaderboard: WeeklyLeaderboard): LeaderboardStats {
    const userRank = this.getUserRank(leaderboard);
    const totalParticipants = leaderboard.entries.length;
    const averageXP = leaderboard.entries.reduce((sum, entry) => sum + entry.weeklyXP, 0) / totalParticipants;

    // Mock rank change for demo
    const topRankChange = Math.floor(Math.random() * 6) - 3; // -3 to +2

    return {
      totalParticipants,
      userRank,
      topRankChange,
      averageXP: Math.round(averageXP),
    };
  }

  // Check if user is in top 10
  isInTopTen(leaderboard: WeeklyLeaderboard): boolean {
    return this.getUserRank(leaderboard) <= 10;
  }

  // Get user's position relative to top 10
  getUserPositionStatus(leaderboard: WeeklyLeaderboard): string {
    const userRank = this.getUserRank(leaderboard);
    
    if (userRank === 0) return 'Not ranked';
    if (userRank <= 3) return 'Top 3! 🌟';
    if (userRank <= 10) return 'Top 10! 🏆';
    if (userRank <= 25) return 'Top 25! 🔥';
    return 'Keep climbing! 📈';
  }

  // Get XP needed to reach next rank
  getXPToNextRank(leaderboard: WeeklyLeaderboard): number {
    const userRank = this.getUserRank(leaderboard);
    if (userRank === 0) return 0;
    
    const userEntry = leaderboard.entries[userRank - 1];
    const nextEntry = leaderboard.entries[userRank]; // Next person
    
    if (!nextEntry) return 0; // Already at top
    
    return Math.max(0, nextEntry.weeklyXP - userEntry.weeklyXP + 1);
  }

  // Save leaderboard data locally
  async saveLeaderboard(leaderboard: WeeklyLeaderboard): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(leaderboard));
      const { setWeeklyLeaderboard } = useUserStore.getState();
      setWeeklyLeaderboard(leaderboard.entries);
    } catch (error) {
      console.error('Failed to save leaderboard:', error);
    }
  }

  // Load leaderboard data from local storage
  async loadLeaderboard(): Promise<WeeklyLeaderboard | null> {
    try {
      const stored = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    }
    return null;
  }

  // Get previous week's leaderboard (mock data for demo)
  getPreviousWeekLeaderboard(): WeeklyLeaderboard {
    const { ageGroup } = useUserStore.getState();
    const gradeGroup = ageGroup === 'under12' ? 'under12' : '12plus';
    
    // Generate mock data for previous week with slightly different scores
    const previousWeek = this.generateMockLeaderboard(gradeGroup);
    previousWeek.entries.forEach(entry => {
      entry.weeklyXP = Math.max(0, entry.weeklyXP + Math.floor(Math.random() * 100) - 50);
    });
    previousWeek.entries.sort((a, b) => b.weeklyXP - a.weeklyXP);
    previousWeek.entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return previousWeek;
  }

  // Calculate streak-based bonuses for leaderboard
  getStreakBonusMultiplier(streak: number): number {
    if (streak >= 30) return 1.5; // 50% bonus for 30+ day streaks
    if (streak >= 14) return 1.3; // 30% bonus for 14+ day streaks
    if (streak >= 7) return 1.2; // 20% bonus for 7+ day streaks
    return 1.0; // No bonus
  }

  // Format time until next reset
  getTimeUntilNextReset(): string {
    const now = new Date();
    const nextSunday = new Date(now);
    nextSunday.setDate(now.getDate() + (7 - now.getDay()));
    nextSunday.setHours(0, 0, 0, 0);

    const diff = nextSunday.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  }
}

export const leaderboardService = LeaderboardService.getInstance();