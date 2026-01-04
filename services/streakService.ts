import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@learnsmart_streak';

interface StreakData {
  lastOpenDate: string | null;
  currentStreak: number;
  longestStreak: number;
}

class StreakService {
  private data: StreakData = {
    lastOpenDate: null,
    currentStreak: 0,
    longestStreak: 0,
  };

  async initialize(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.data = JSON.parse(stored);
      }
    } catch (error) {
                  // Error handled silently
    }
  }

  async checkAndUpdateStreak(): Promise<{
    streak: number;
    streakChanged: boolean;
    streakReset: boolean;
    isNewDay: boolean;
  }> {
    const today = this.getTodayDate();
    const lastOpen = this.data.lastOpenDate;

    // First time opening
    if (!lastOpen) {
      this.data.currentStreak = 1;
      this.data.lastOpenDate = today;
      await this.save();
      return { streak: 1, streakChanged: true, streakReset: false, isNewDay: true };
    }

    // Already opened today
    if (lastOpen === today) {
      return { streak: this.data.currentStreak, streakChanged: false, streakReset: false, isNewDay: false };
    }

    const yesterday = this.getYesterdayDate();
    const lastOpenDate = new Date(lastOpen);
    const todayDate = new Date(today);
    const daysDiff = Math.floor(
      (todayDate.getTime() - lastOpenDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Streak continues (opened yesterday)
    if (daysDiff === 1) {
      this.data.currentStreak += 1;
      this.data.lastOpenDate = today;
      
      if (this.data.currentStreak > this.data.longestStreak) {
        this.data.longestStreak = this.data.currentStreak;
      }
      
      await this.save();
      return { streak: this.data.currentStreak, streakChanged: true, streakReset: false, isNewDay: true };
    }

    // Streak broken (missed more than 1 day)
    // Reset to 1 for new streak
    this.data.currentStreak = 1;
    this.data.lastOpenDate = today;
    await this.save();
    return { streak: 1, streakChanged: true, streakReset: true, isNewDay: true };
  }

  async getStreak(): Promise<number> {
    return this.data.currentStreak;
  }

  async getLongestStreak(): Promise<number> {
    return this.data.longestStreak;
  }

  async resetStreak(): Promise<void> {
    this.data.currentStreak = 0;
    this.data.lastOpenDate = null;
    await this.save();
  }

  private async save(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (error) {
                  // Error handled silently
    }
  }

  private getTodayDate(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  private getYesterdayDate(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
  }
}

export const streakService = new StreakService();

// React hook-friendly version
export const useStreakService = () => {
  return {
    checkAndUpdateStreak: () => streakService.checkAndUpdateStreak(),
    getStreak: () => streakService.getStreak(),
    getLongestStreak: () => streakService.getLongestStreak(),
    resetStreak: () => streakService.resetStreak(),
    initialize: () => streakService.initialize(),
  };
};
