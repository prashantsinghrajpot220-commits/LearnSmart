import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { coinRewardService } from '@/services/CoinRewardService';

export interface Rank {
  name: string;
  level: number;
  icon: string;
  minXP: number;
  maxXP: number;
  color: string;
  message: string;
}

export const RANKS: Rank[] = [
  {
    name: 'Novice',
    level: 1,
    icon: '🌱',
    minXP: 0,
    maxXP: 500,
    color: '#9CAF88',
    message: 'Welcome, Novice! Your learning journey begins now.',
  },
  {
    name: 'Scholar',
    level: 2,
    icon: '📚',
    minXP: 500,
    maxXP: 1500,
    color: '#5D8AA8',
    message: 'Welcome to Scholar rank! Your dedication is showing.',
  },
  {
    name: 'Sage',
    level: 3,
    icon: '🧙',
    minXP: 1500,
    maxXP: 3000,
    color: '#9B7EBD',
    message: 'You\'ve achieved Sage status! Wisdom is yours.',
  },
  {
    name: 'Master',
    level: 4,
    icon: '🎓',
    minXP: 3000,
    maxXP: 5000,
    color: '#FF6B35',
    message: 'You\'ve reached Master level! Excellence achieved.',
  },
  {
    name: 'Guru',
    level: 5,
    icon: '🧠',
    minXP: 5000,
    maxXP: Infinity,
    color: '#FFD700',
    message: 'You\'re a Guru! Ultimate wisdom attained.',
  },
];

const STORAGE_KEY = '@learnsmart_xp';

interface XPState {
  currentXP: number;
  totalLessonsRead: number;
  totalQuizzesCompleted: number;
  lastXPUpdate: string | null;
  
  // Actions
  addXP: (amount: number) => Promise<{ rankUp: boolean; newRank?: Rank; milestone?: string }>;
  getXP: () => number;
  getRank: () => Rank;
  getXPToNextRank: () => number;
  getProgressToNextRank: () => number;
  incrementLessonsRead: () => void;
  incrementQuizzesCompleted: () => void;
  loadXP: () => Promise<void>;
  resetXP: () => Promise<void>;
}

export const useXPStore = create<XPState>((set, get) => ({
  currentXP: 0,
  totalLessonsRead: 0,
  totalQuizzesCompleted: 0,
  lastXPUpdate: null,

  addXP: async (amount: number) => {
    const { currentXP, getRank } = get();
    const oldRank = getRank();
    const newXP = currentXP + amount;
    const newRank = getRank();
    
    // Determine if we crossed a rank threshold
    let rankUp = false;
    let milestone: string | undefined;
    
    if (newXP >= newRank.minXP && oldRank.name !== newRank.name) {
      rankUp = true;
      milestone = newRank.message;
      
      // Award SmartCoins for rank up
      coinRewardService.rewardRankUp(newRank.name);
    }

    set({
      currentXP: newXP,
      lastXPUpdate: new Date().toISOString(),
    });

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
        currentXP: newXP,
        totalLessonsRead: get().totalLessonsRead,
        totalQuizzesCompleted: get().totalQuizzesCompleted,
        lastXPUpdate: new Date().toISOString(),
      }));
    } catch (error) {
                  // Debug statement removed
    }

    return { rankUp, newRank, milestone };
  },

  getXP: () => {
    return get().currentXP;
  },

  getRank: () => {
    const xp = get().currentXP;
    for (const rank of RANKS) {
      if (xp >= rank.minXP && xp <= rank.maxXP) {
        return rank;
      }
    }
    return RANKS[0]; // Default to Novice
  },

  getXPToNextRank: () => {
    const currentRank = get().getRank();
    const rankIndex = RANKS.findIndex((r) => r.name === currentRank.name);
    
    if (rankIndex >= RANKS.length - 1) {
      return Infinity; // Already at max rank
    }
    
    const nextRank = RANKS[rankIndex + 1];
    return nextRank.minXP - get().currentXP;
  },

  getProgressToNextRank: () => {
    const currentRank = get().getRank();
    const rankIndex = RANKS.findIndex((r) => r.name === currentRank.name);
    
    if (rankIndex >= RANKS.length - 1) {
      return 1; // Max rank, 100% progress
    }
    
    const nextRank = RANKS[rankIndex + 1];
    const xpInCurrentRank = get().currentXP - currentRank.minXP;
    const xpNeededForNextRank = nextRank.minXP - currentRank.minXP;
    
    return Math.min(xpInCurrentRank / xpNeededForNextRank, 1);
  },

  incrementLessonsRead: () => {
    set((state) => ({ totalLessonsRead: state.totalLessonsRead + 1 }));
  },

  incrementQuizzesCompleted: () => {
    set((state) => ({ totalQuizzesCompleted: state.totalQuizzesCompleted + 1 }));
  },

  loadXP: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        set({
          currentXP: parsed.currentXP || 0,
          totalLessonsRead: parsed.totalLessonsRead || 0,
          totalQuizzesCompleted: parsed.totalQuizzesCompleted || 0,
          lastXPUpdate: parsed.lastXPUpdate || null,
        });
      }
    } catch (error) {
                  // Debug statement removed
    }
  },

  resetXP: async () => {
    set({
      currentXP: 0,
      totalLessonsRead: 0,
      totalQuizzesCompleted: 0,
      lastXPUpdate: null,
    });
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
                  // Debug statement removed
    }
  },
}));

// Hook for getting rank with color
export const useCurrentRank = () => {
  const getRank = useXPStore((state) => state.getRank);
  const getProgress = useXPStore((state) => state.getProgressToNextRank);
  const currentXP = useXPStore((state) => state.currentXP);
  const getXPToNext = useXPStore((state) => state.getXPToNextRank);
  
  return {
    rank: getRank(),
    progress: getProgress(),
    currentXP,
    xpToNext: getXPToNext(),
  };
};
