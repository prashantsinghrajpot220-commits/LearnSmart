import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AgeGroup = 'under12' | '12plus';

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  avatar: string;
  weeklyXP: number;
  streak: number;
  rank: number;
}

export interface GamificationData {
  smartCoins: number;
  totalEarnedCoins: number;
  weeklyXP: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  unlockedAvatars: string[];
  purchasedAvatars: string[];
  rankMilestones: string[];
  weeklyRank: number;
  lastWeekRank: number;
}

interface UserState {
  userId: string;
  ageGroup: AgeGroup | null;
  userName: string;
  signupDate: string | null;
  profileComplete: boolean;

  selectedClass: string;
  selectedStream: string;
  selectedAvatar: string;
  themePreference: 'light' | 'dark' | 'system';
  isOnboarded: boolean;

  // Gamification data
  gamificationData: GamificationData;
  weeklyLeaderboard: LeaderboardEntry[];

  // Actions
  setAgeGroup: (age: AgeGroup) => Promise<void>;
  getAgeGroup: () => AgeGroup | null;
  isUnder12: () => boolean;
  is12Plus: () => boolean;

  setUserName: (name: string) => void;
  setSelectedClass: (className: string) => void;
  setSelectedStream: (stream: string) => void;
  setSelectedAvatar: (avatar: string) => void;
  setThemePreference: (theme: 'light' | 'dark' | 'system') => void;
  completeOnboarding: () => void;
  logout: () => void;
  loadUserData: () => Promise<void>;

  // Gamification actions
  addSmartCoins: (amount: number, reason: string) => Promise<void>;
  spendSmartCoins: (amount: number, item: string) => Promise<boolean>;
  updateWeeklyXP: (amount: number) => void;
  unlockAvatar: (avatarId: string) => void;
  purchaseAvatar: (avatarId: string, cost: number) => Promise<boolean>;
  addRankMilestone: (rankName: string) => void;
  updateWeeklyRank: (rank: number) => void;
  setWeeklyLeaderboard: (entries: LeaderboardEntry[]) => void;
  resetWeeklyData: () => void;
}

const STORAGE_KEYS = {
  USER_NAME: '@learnsmart_user_name',
  SELECTED_CLASS: '@learnsmart_selected_class',
  SELECTED_STREAM: '@learnsmart_selected_stream',
  SELECTED_AVATAR: '@learnsmart_selected_avatar',
  THEME_PREFERENCE: '@learnsmart_theme_preference',
  IS_ONBOARDED: '@learnsmart_is_onboarded',
  AGE_GROUP: '@learnsmart/user_age_group',
  USER_ID: '@learnsmart/user_id',
  SIGNUP_DATE: '@learnsmart/signup_date',
  PROFILE_COMPLETE: '@learnsmart/profile_complete',
  GAMIFICATION_DATA: '@learnsmart/gamification_data',
  WEEKLY_LEADERBOARD: '@learnsmart/weekly_leaderboard',
};

const generateUserId = () => {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

export const useUserStore = create<UserState>((set, get) => ({
  userId: '',
  ageGroup: null,
  userName: '',
  signupDate: null,
  profileComplete: false,

  selectedClass: '',
  selectedStream: '',
  selectedAvatar: 'Robot',
  themePreference: 'system',
  isOnboarded: false,

  // Initialize gamification data
  gamificationData: {
    smartCoins: 0,
    totalEarnedCoins: 0,
    weeklyXP: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    unlockedAvatars: ['Robot'], // Default avatar is unlocked
    purchasedAvatars: ['Robot'], // Default avatar is purchased
    rankMilestones: [],
    weeklyRank: 0,
    lastWeekRank: 0,
  },
  weeklyLeaderboard: [],

  setAgeGroup: async (age: AgeGroup) => {
    const currentSignupDate = get().signupDate;
    const newSignupDate = currentSignupDate || new Date().toISOString();
    
    set({ 
      ageGroup: age,
      signupDate: newSignupDate,
      profileComplete: true,
    });
    
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.AGE_GROUP, age),
      AsyncStorage.setItem(STORAGE_KEYS.SIGNUP_DATE, newSignupDate),
      AsyncStorage.setItem(STORAGE_KEYS.PROFILE_COMPLETE, 'true'),
    ]);
  },

  getAgeGroup: () => {
    return get().ageGroup;
  },

  isUnder12: () => {
    return get().ageGroup === 'under12';
  },

  is12Plus: () => {
    return get().ageGroup === '12plus';
  },

  setUserName: (name: string) => {
    set({ userName: name });
    AsyncStorage.setItem(STORAGE_KEYS.USER_NAME, name);
  },

  setSelectedClass: (className: string) => {
    set({ selectedClass: className });
    AsyncStorage.setItem(STORAGE_KEYS.SELECTED_CLASS, className);
  },

  setSelectedStream: (stream: string) => {
    set({ selectedStream: stream });
    AsyncStorage.setItem(STORAGE_KEYS.SELECTED_STREAM, stream);
  },

  setSelectedAvatar: (avatar: string) => {
    set({ selectedAvatar: avatar });
    AsyncStorage.setItem(STORAGE_KEYS.SELECTED_AVATAR, avatar);
  },

  setThemePreference: (theme: 'light' | 'dark' | 'system') => {
    set({ themePreference: theme });
    AsyncStorage.setItem(STORAGE_KEYS.THEME_PREFERENCE, theme);
  },

  completeOnboarding: () => {
    set({ isOnboarded: true });
    AsyncStorage.setItem(STORAGE_KEYS.IS_ONBOARDED, 'true');
  },

  logout: async () => {
    set({
      userId: '',
      ageGroup: null,
      userName: '',
      signupDate: null,
      profileComplete: false,
      selectedClass: '',
      selectedStream: '',
      selectedAvatar: 'Robot',
      themePreference: 'system',
      isOnboarded: false,
      gamificationData: {
        smartCoins: 0,
        totalEarnedCoins: 0,
        weeklyXP: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: null,
        unlockedAvatars: ['Robot'],
        purchasedAvatars: ['Robot'],
        rankMilestones: [],
        weeklyRank: 0,
        lastWeekRank: 0,
      },
      weeklyLeaderboard: [],
    });
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_NAME,
      STORAGE_KEYS.SELECTED_CLASS,
      STORAGE_KEYS.SELECTED_STREAM,
      STORAGE_KEYS.SELECTED_AVATAR,
      STORAGE_KEYS.THEME_PREFERENCE,
      STORAGE_KEYS.IS_ONBOARDED,
      STORAGE_KEYS.AGE_GROUP,
      STORAGE_KEYS.USER_ID,
      STORAGE_KEYS.SIGNUP_DATE,
      STORAGE_KEYS.PROFILE_COMPLETE,
      STORAGE_KEYS.GAMIFICATION_DATA,
      STORAGE_KEYS.WEEKLY_LEADERBOARD,
    ]);
  },

  loadUserData: async () => {
    try {
      const [name, className, stream, avatar, theme, onboarded, ageGroup, userId, signupDate, profileComplete, gamificationData, weeklyLeaderboard] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER_NAME),
        AsyncStorage.getItem(STORAGE_KEYS.SELECTED_CLASS),
        AsyncStorage.getItem(STORAGE_KEYS.SELECTED_STREAM),
        AsyncStorage.getItem(STORAGE_KEYS.SELECTED_AVATAR),
        AsyncStorage.getItem(STORAGE_KEYS.THEME_PREFERENCE),
        AsyncStorage.getItem(STORAGE_KEYS.IS_ONBOARDED),
        AsyncStorage.getItem(STORAGE_KEYS.AGE_GROUP),
        AsyncStorage.getItem(STORAGE_KEYS.USER_ID),
        AsyncStorage.getItem(STORAGE_KEYS.SIGNUP_DATE),
        AsyncStorage.getItem(STORAGE_KEYS.PROFILE_COMPLETE),
        AsyncStorage.getItem(STORAGE_KEYS.GAMIFICATION_DATA),
        AsyncStorage.getItem(STORAGE_KEYS.WEEKLY_LEADERBOARD),
      ]);

      let currentUserId = userId;
      if (!currentUserId) {
        currentUserId = generateUserId();
        await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, currentUserId);
      }

      // Load gamification data or use defaults
      let loadedGamificationData = {
        smartCoins: 0,
        totalEarnedCoins: 0,
        weeklyXP: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: null,
        unlockedAvatars: ['Robot'],
        purchasedAvatars: ['Robot'],
        rankMilestones: [],
        weeklyRank: 0,
        lastWeekRank: 0,
      };

      if (gamificationData) {
        try {
          const parsed = JSON.parse(gamificationData);
          loadedGamificationData = { ...loadedGamificationData, ...parsed };
        } catch (error) {
          console.error('Failed to parse gamification data:', error);
        }
      }

      set({
        userId: currentUserId,
        ageGroup: ageGroup as AgeGroup | null,
        userName: name || '',
        signupDate: signupDate || null,
        profileComplete: profileComplete === 'true',
        selectedClass: className || '',
        selectedStream: stream || '',
        selectedAvatar: avatar || 'Robot',
        themePreference: (theme as 'light' | 'dark' | 'system') || 'system',
        isOnboarded: onboarded === 'true',
        gamificationData: loadedGamificationData,
        weeklyLeaderboard: weeklyLeaderboard ? JSON.parse(weeklyLeaderboard) : [],
      });
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  },

  // Gamification methods
  addSmartCoins: async (amount: number, reason: string) => {
    const currentData = get().gamificationData;
    const newData = {
      ...currentData,
      smartCoins: currentData.smartCoins + amount,
      totalEarnedCoins: currentData.totalEarnedCoins + amount,
    };
    
    set({ gamificationData: newData });
    await AsyncStorage.setItem(STORAGE_KEYS.GAMIFICATION_DATA, JSON.stringify(newData));
    console.log(`Added ${amount} SmartCoins for: ${reason}`);
  },

  spendSmartCoins: async (amount: number, item: string) => {
    const currentData = get().gamificationData;
    if (currentData.smartCoins < amount) {
      console.log('Insufficient SmartCoins');
      return false;
    }

    const newData = {
      ...currentData,
      smartCoins: currentData.smartCoins - amount,
    };
    
    set({ gamificationData: newData });
    await AsyncStorage.setItem(STORAGE_KEYS.GAMIFICATION_DATA, JSON.stringify(newData));
    console.log(`Spent ${amount} SmartCoins on: ${item}`);
    return true;
  },

  updateWeeklyXP: (amount: number) => {
    const currentData = get().gamificationData;
    const newData = {
      ...currentData,
      weeklyXP: currentData.weeklyXP + amount,
    };
    
    set({ gamificationData: newData });
    AsyncStorage.setItem(STORAGE_KEYS.GAMIFICATION_DATA, JSON.stringify(newData));
  },

  unlockAvatar: (avatarId: string) => {
    const currentData = get().gamificationData;
    if (!currentData.unlockedAvatars.includes(avatarId)) {
      const newData = {
        ...currentData,
        unlockedAvatars: [...currentData.unlockedAvatars, avatarId],
      };
      
      set({ gamificationData: newData });
      AsyncStorage.setItem(STORAGE_KEYS.GAMIFICATION_DATA, JSON.stringify(newData));
      console.log(`Unlocked avatar: ${avatarId}`);
    }
  },

  purchaseAvatar: async (avatarId: string, cost: number) => {
    const currentData = get().gamificationData;
    if (currentData.smartCoins < cost) {
      return false;
    }

    if (currentData.purchasedAvatars.includes(avatarId)) {
      return true; // Already purchased
    }

    const newData = {
      ...currentData,
      smartCoins: currentData.smartCoins - cost,
      purchasedAvatars: [...currentData.purchasedAvatars, avatarId],
      unlockedAvatars: [...currentData.unlockedAvatars, avatarId],
    };
    
    set({ gamificationData: newData });
    await AsyncStorage.setItem(STORAGE_KEYS.GAMIFICATION_DATA, JSON.stringify(newData));
    console.log(`Purchased avatar ${avatarId} for ${cost} coins`);
    return true;
  },

  addRankMilestone: (rankName: string) => {
    const currentData = get().gamificationData;
    if (!currentData.rankMilestones.includes(rankName)) {
      const newData = {
        ...currentData,
        rankMilestones: [...currentData.rankMilestones, rankName],
      };
      
      set({ gamificationData: newData });
      AsyncStorage.setItem(STORAGE_KEYS.GAMIFICATION_DATA, JSON.stringify(newData));
      console.log(`Reached rank milestone: ${rankName}`);
    }
  },

  updateWeeklyRank: (rank: number) => {
    const currentData = get().gamificationData;
    const newData = {
      ...currentData,
      weeklyRank: rank,
    };
    
    set({ gamificationData: newData });
    AsyncStorage.setItem(STORAGE_KEYS.GAMIFICATION_DATA, JSON.stringify(newData));
  },

  setWeeklyLeaderboard: (entries: LeaderboardEntry[]) => {
    set({ weeklyLeaderboard: entries });
    AsyncStorage.setItem(STORAGE_KEYS.WEEKLY_LEADERBOARD, JSON.stringify(entries));
  },

  resetWeeklyData: () => {
    const currentData = get().gamificationData;
    const newData = {
      ...currentData,
      weeklyXP: 0,
      lastWeekRank: currentData.weeklyRank,
    };
    
    set({ 
      gamificationData: newData,
      weeklyLeaderboard: [],
    });
    AsyncStorage.setItem(STORAGE_KEYS.GAMIFICATION_DATA, JSON.stringify(newData));
    AsyncStorage.setItem(STORAGE_KEYS.WEEKLY_LEADERBOARD, JSON.stringify([]));
  },
}));
