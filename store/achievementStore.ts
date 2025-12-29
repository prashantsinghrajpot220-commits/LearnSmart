export type AchievementCategory = 'streak' | 'quiz' | 'learning' | 'xp';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate: string | null;
  category: AchievementCategory;
  condition?: (state: AchievementState) => boolean;
}

export interface AchievementState {
  currentStreak: number;
  totalQuizzesCompleted: number;
  totalLessonsRead: number;
  currentXP: number;
  rank: string;
}

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  // Streak Achievements
  {
    id: 'day1',
    name: 'Day 1',
    description: 'Open the app for the first time',
    icon: '🎯',
    unlocked: false,
    unlockedDate: null,
    category: 'streak',
  },
  {
    id: 'streak7',
    name: 'On Fire',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    unlocked: false,
    unlockedDate: null,
    category: 'streak',
  },
  {
    id: 'streak14',
    name: 'Unstoppable',
    description: 'Maintain a 14-day streak',
    icon: '💥',
    unlocked: false,
    unlockedDate: null,
 category: 'streak',
  },
  {
    id: 'streak30',
    name: 'Legendary',
    description: 'Maintain a 30-day streak',
    icon: '👑',
    unlocked: false,
    unlockedDate: null,
    category: 'streak',
  },
  // Quiz Achievements
  {
    id: 'first_quiz',
    name: 'First Steps',
    description: 'Complete your first quiz',
    icon: '📝',
    unlocked: false,
    unlockedDate: null,
    category: 'quiz',
  },
  {
    id: 'quiz_5',
    name: 'Quiz Master',
    description: 'Complete 5 quizzes',
    icon: '🏆',
    unlocked: false,
    unlockedDate: null,
    category: 'quiz',
  },
  {
    id: 'quiz_10',
    name: 'Quiz King',
    description: 'Complete 10 quizzes',
    icon: '👑',
    unlocked: false,
    unlockedDate: null,
    category: 'quiz',
  },
  {
    id: 'quiz_25',
    name: 'Quiz Legend',
    description: 'Complete 25 quizzes',
    icon: '🌟',
    unlocked: false,
    unlockedDate: null,
    category: 'quiz',
  },
  // Learning Achievements
  {
    id: 'first_lesson',
    name: 'First Lesson',
    description: 'Read your first lesson',
    icon: '📖',
    unlocked: false,
    unlockedDate: null,
    category: 'learning',
  },
  {
    id: 'lessons_10',
    name: 'Bookworm',
    description: 'Read 10 lessons',
    icon: '📚',
    unlocked: false,
    unlockedDate: null,
    category: 'learning',
  },
  {
    id: 'lessons_25',
    name: 'Scholar',
    description: 'Read 25 lessons',
    icon: '🎓',
    unlocked: false,
    unlockedDate: null,
    category: 'learning',
  },
  {
    id: 'lessons_50',
    name: 'Erudite',
    description: 'Read 50 lessons',
    icon: '📜',
    unlocked: false,
    unlockedDate: null,
    category: 'learning',
  },
  // XP Achievements
  {
    id: 'xp_200',
    name: 'Rising Star',
    description: 'Reach 200 XP (Seeker rank)',
    icon: '⭐',
    unlocked: false,
    unlockedDate: null,
    category: 'xp',
  },
  {
    id: 'xp_500',
    name: 'Knowledge Seeker',
    description: 'Reach 500 XP (Scholar rank)',
    icon: '💎',
    unlocked: false,
    unlockedDate: null,
    category: 'xp',
  },
  {
    id: 'xp_1000',
    name: 'Wisdom Keeper',
    description: 'Reach 1000 XP (Sage rank)',
    icon: '🧙',
    unlocked: false,
    unlockedDate: null,
    category: 'xp',
  },
];

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@learnsmart_achievements';

interface AchievementStore {
  achievements: Achievement[];
  newlyUnlockedId: string | null;
  
  // Actions
  loadAchievements: () => Promise<void>;
  checkAndUnlock: (state: AchievementState) => string[];
  unlockAchievement: (id: string) => void;
  getUnlockedCount: () => number;
  getAchievementsByCategory: (category: AchievementCategory) => Achievement[];
  resetAchievements: () => Promise<void>;
}

export const useAchievementStore = create<AchievementStore>((set, get) => ({
  achievements: INITIAL_ACHIEVEMENTS,
  newlyUnlockedId: null,

  loadAchievements: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        // Merge with initial to preserve any new achievements
        const merged = get().achievements.map((initial) => {
          const saved = parsed.find((p: Achievement) => p.id === initial.id);
          return saved || initial;
        });
        set({ achievements: merged });
      }
    } catch (error) {
      console.error('Failed to load achievements:', error);
    }
  },

  checkAndUnlock: (state: AchievementState) => {
    const { achievements, unlockAchievement } = get();
    const newlyUnlocked: string[] = [];

    achievements.forEach((achievement) => {
      if (achievement.unlocked) return;

      let shouldUnlock = false;

      switch (achievement.id) {
        case 'day1':
          shouldUnlock = true; // Always unlock on first app open
          break;
        case 'streak7':
          shouldUnlock = state.currentStreak >= 7;
          break;
        case 'streak14':
          shouldUnlock = state.currentStreak >= 14;
          break;
        case 'streak30':
          shouldUnlock = state.currentStreak >= 30;
          break;
        case 'first_quiz':
          shouldUnlock = state.totalQuizzesCompleted >= 1;
          break;
        case 'quiz_5':
          shouldUnlock = state.totalQuizzesCompleted >= 5;
          break;
        case 'quiz_10':
          shouldUnlock = state.totalQuizzesCompleted >= 10;
          break;
        case 'quiz_25':
          shouldUnlock = state.totalQuizzesCompleted >= 25;
          break;
        case 'first_lesson':
          shouldUnlock = state.totalLessonsRead >= 1;
          break;
        case 'lessons_10':
          shouldUnlock = state.totalLessonsRead >= 10;
          break;
        case 'lessons_25':
          shouldUnlock = state.totalLessonsRead >= 25;
          break;
        case 'lessons_50':
          shouldUnlock = state.totalLessonsRead >= 50;
          break;
        case 'xp_200':
          shouldUnlock = state.currentXP >= 200;
          break;
        case 'xp_500':
          shouldUnlock = state.currentXP >= 500;
          break;
        case 'xp_1000':
          shouldUnlock = state.currentXP >= 1000;
          break;
      }

      if (shouldUnlock) {
        unlockAchievement(achievement.id);
        newlyUnlocked.push(achievement.id);
      }
    });

    return newlyUnlocked;
  },

  unlockAchievement: async (id: string) => {
    const { achievements } = get();
    const now = new Date().toISOString();
    
    const updated = achievements.map((a) =>
      a.id === id
        ? { ...a, unlocked: true, unlockedDate: now }
        : a
    );

    set({
      achievements: updated,
      newlyUnlockedId: id,
    });

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save achievement:', error);
    }
  },

  getUnlockedCount: () => {
    return get().achievements.filter((a) => a.unlocked).length;
  },

  getAchievementsByCategory: (category: AchievementCategory) => {
    return get().achievements.filter((a) => a.category === category);
  },

  resetAchievements: async () => {
    set({ achievements: INITIAL_ACHIEVEMENTS, newlyUnlockedId: null });
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to reset achievements:', error);
    }
  },
}));

// Selector hooks
export const useAchievements = () => {
  return useAchievementStore((state) => state.achievements);
};

export const useUnlockedAchievements = () => {
  return useAchievementStore((state) =>
    state.achievements.filter((a) => a.unlocked)
  );
};

export const useLockedAchievements = () => {
  return useAchievementStore((state) =>
    state.achievements.filter((a) => !a.unlocked)
  );
};
