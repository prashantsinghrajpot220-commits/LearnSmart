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

export interface ReputationLeaderboardEntry {
  userId: string;
  userName: string;
  avatar: string;
  reputation: number;
  badgeCount: number;
  helpfulAnswers: number;
  rank: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface AchievementProgress {
  id: string;
  name: string;
  currentValue: number;
  targetValue: number;
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
  reputation: number;
  badges: Badge[];
  achievementProgress: AchievementProgress[];
  reputationRank: number;
}

export interface StudyGroupMembership {
  groupId: string;
  role: 'admin' | 'member';
  joinedAt: string;
}

export interface GroupQuizHistoryEntry {
  groupId: string;
  groupQuizId: string;
  score: number;
  completedAt: string;
}

export interface CoinTransaction {
  id: string;
  amount: number;
  reason: string;
  type: 'earned' | 'spent';
  timestamp: string;
}

export interface NotificationPreferences {
  answers: boolean;
  upvotes: boolean;
  helpfulMarks: boolean;
  badgeUnlocks: boolean;
  leaderboardUpdates: boolean;
  milestones: boolean;
  pushEnabled: boolean;
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
  reputationLeaderboard: ReputationLeaderboardEntry[];

  // Study groups
  studyGroupMemberships: StudyGroupMembership[];
  groupQuizHistory: GroupQuizHistoryEntry[];

  // Q&A Forum
  userQuestions: string[];
  userAnswers: string[];
  userVotes: Record<string, 'upvote' | 'downvote'>;
  favoriteQuestions: string[];

  // Notifications & Gamification
  coinTransactions: CoinTransaction[];
  notificationPreferences: NotificationPreferences;
  answerStreakCount: number;
  lastAnswerDate: string | null;

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

  // Study group actions
  addStudyGroupMembership: (membership: StudyGroupMembership) => Promise<void>;
  removeStudyGroupMembership: (groupId: string) => Promise<void>;
  recordGroupQuizHistory: (entry: GroupQuizHistoryEntry) => Promise<void>;

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

  // Q&A Forum reputation actions
  updateReputation: (amount: number) => Promise<void>;
  addBadge: (badge: Badge) => Promise<void>;
  updateAchievementProgress: (progress: AchievementProgress) => Promise<void>;
  setReputationLeaderboard: (entries: ReputationLeaderboardEntry[]) => void;
  updateReputationRank: (rank: number) => void;

  // Q&A Forum actions
  addUserQuestion: (questionId: string) => Promise<void>;
  addUserAnswer: (answerId: string) => Promise<void>;
  addUserVote: (answerId: string, voteType: 'upvote' | 'downvote') => Promise<void>;
  addToFavorites: (questionId: string) => Promise<void>;
  removeFromFavorites: (questionId: string) => Promise<void>;
  isFavorite: (questionId: string) => boolean;

  // Notification & Gamification actions
  addCoinTransaction: (transaction: Omit<CoinTransaction, 'id' | 'timestamp'>) => Promise<void>;
  getCoinTransactions: () => CoinTransaction[];
  updateNotificationPreferences: (prefs: Partial<NotificationPreferences>) => Promise<void>;
  updateAnswerStreak: () => Promise<void>;
  resetAnswerStreak: () => Promise<void>;
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
  STUDY_GROUP_MEMBERSHIPS: '@learnsmart/study_group_memberships',
  GROUP_QUIZ_HISTORY: '@learnsmart/group_quiz_history',
  USER_QUESTIONS: '@learnsmart/user_questions',
  USER_ANSWERS: '@learnsmart/user_answers',
  USER_VOTES: '@learnsmart/user_votes',
  FAVORITE_QUESTIONS: '@learnsmart/favorite_questions',
  REPUTATION_LEADERBOARD: '@learnsmart/reputation_leaderboard',
  COIN_TRANSACTIONS: '@learnsmart/coin_transactions',
  NOTIFICATION_PREFERENCES: '@learnsmart/notification_preferences',
  ANSWER_STREAK_COUNT: '@learnsmart/answer_streak_count',
  LAST_ANSWER_DATE: '@learnsmart/last_answer_date',
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
    reputation: 0,
    badges: [],
    achievementProgress: [],
    reputationRank: 0,
  },
  weeklyLeaderboard: [],
  reputationLeaderboard: [],

  studyGroupMemberships: [],
  groupQuizHistory: [],

  userQuestions: [],
  userAnswers: [],
  userVotes: {},
  favoriteQuestions: [],

  // Notifications & Gamification
  coinTransactions: [],
  notificationPreferences: {
    answers: true,
    upvotes: true,
    helpfulMarks: true,
    badgeUnlocks: true,
    leaderboardUpdates: true,
    milestones: true,
    pushEnabled: false,
  },
  answerStreakCount: 0,
  lastAnswerDate: null,

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
        reputation: 0,
        badges: [],
        achievementProgress: [],
        reputationRank: 0,
      },
      weeklyLeaderboard: [],
      reputationLeaderboard: [],
      studyGroupMemberships: [],
      groupQuizHistory: [],
      userQuestions: [],
      userAnswers: [],
      userVotes: {},
      favoriteQuestions: [],
      coinTransactions: [],
      notificationPreferences: {
        answers: true,
        upvotes: true,
        helpfulMarks: true,
        badgeUnlocks: true,
        leaderboardUpdates: true,
        milestones: true,
        pushEnabled: false,
      },
      answerStreakCount: 0,
      lastAnswerDate: null,
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
      STORAGE_KEYS.REPUTATION_LEADERBOARD,
      STORAGE_KEYS.STUDY_GROUP_MEMBERSHIPS,
      STORAGE_KEYS.GROUP_QUIZ_HISTORY,
      STORAGE_KEYS.USER_QUESTIONS,
      STORAGE_KEYS.USER_ANSWERS,
      STORAGE_KEYS.USER_VOTES,
      STORAGE_KEYS.FAVORITE_QUESTIONS,
      STORAGE_KEYS.COIN_TRANSACTIONS,
      STORAGE_KEYS.NOTIFICATION_PREFERENCES,
      STORAGE_KEYS.ANSWER_STREAK_COUNT,
      STORAGE_KEYS.LAST_ANSWER_DATE,
    ]);
  },

  loadUserData: async () => {
    try {
      const [
        name,
        className,
        stream,
        avatar,
        theme,
        onboarded,
        ageGroup,
        userId,
        signupDate,
        profileComplete,
        gamificationData,
        weeklyLeaderboard,
        reputationLeaderboard,
        studyGroupMemberships,
        groupQuizHistory,
        userQuestions,
        userAnswers,
        userVotes,
        favoriteQuestions,
        coinTransactions,
        notificationPreferences,
        answerStreakCount,
        lastAnswerDate,
      ] = await Promise.all([
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
        AsyncStorage.getItem(STORAGE_KEYS.REPUTATION_LEADERBOARD),
        AsyncStorage.getItem(STORAGE_KEYS.STUDY_GROUP_MEMBERSHIPS),
        AsyncStorage.getItem(STORAGE_KEYS.GROUP_QUIZ_HISTORY),
        AsyncStorage.getItem(STORAGE_KEYS.USER_QUESTIONS),
        AsyncStorage.getItem(STORAGE_KEYS.USER_ANSWERS),
        AsyncStorage.getItem(STORAGE_KEYS.USER_VOTES),
        AsyncStorage.getItem(STORAGE_KEYS.FAVORITE_QUESTIONS),
        AsyncStorage.getItem(STORAGE_KEYS.COIN_TRANSACTIONS),
        AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_PREFERENCES),
        AsyncStorage.getItem(STORAGE_KEYS.ANSWER_STREAK_COUNT),
        AsyncStorage.getItem(STORAGE_KEYS.LAST_ANSWER_DATE),
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
        reputation: 0,
        badges: [],
        achievementProgress: [],
        reputationRank: 0,
      };

      if (gamificationData) {
        try {
          const parsed = JSON.parse(gamificationData);
          loadedGamificationData = { ...loadedGamificationData, ...parsed };
        } catch (error) {
                      // Debug statement removed
        }
      }

      const safeParse = <T,>(raw: string | null, fallback: T): T => {
        if (!raw) return fallback;
        try {
          return JSON.parse(raw) as T;
        } catch (error) {
                      // Debug statement removed
          return fallback;
        }
      };

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
        weeklyLeaderboard: safeParse(weeklyLeaderboard, [] as LeaderboardEntry[]),
        reputationLeaderboard: safeParse(reputationLeaderboard, [] as ReputationLeaderboardEntry[]),
        studyGroupMemberships: safeParse(studyGroupMemberships, [] as StudyGroupMembership[]),
        groupQuizHistory: safeParse(groupQuizHistory, [] as GroupQuizHistoryEntry[]),
        userQuestions: safeParse(userQuestions, [] as string[]),
        userAnswers: safeParse(userAnswers, [] as string[]),
        userVotes: safeParse(userVotes, {} as Record<string, 'upvote' | 'downvote'>),
        favoriteQuestions: safeParse(favoriteQuestions, [] as string[]),
        coinTransactions: safeParse(coinTransactions, [] as CoinTransaction[]),
        notificationPreferences: safeParse(notificationPreferences, {
          answers: true,
          upvotes: true,
          helpfulMarks: true,
          badgeUnlocks: true,
          leaderboardUpdates: true,
          milestones: true,
          pushEnabled: false,
        } as NotificationPreferences),
        answerStreakCount: answerStreakCount ? parseInt(answerStreakCount, 10) : 0,
        lastAnswerDate: lastAnswerDate || null,
      });
    } catch (error) {
                  // Debug statement removed
    }
  },

  // Study group methods
  addStudyGroupMembership: async (membership: StudyGroupMembership) => {
    const current = get().studyGroupMemberships;
    const without = current.filter((m) => m.groupId !== membership.groupId);
    const next = [...without, membership];

    set({ studyGroupMemberships: next });
    await AsyncStorage.setItem(STORAGE_KEYS.STUDY_GROUP_MEMBERSHIPS, JSON.stringify(next));
  },

  removeStudyGroupMembership: async (groupId: string) => {
    const current = get().studyGroupMemberships;
    const next = current.filter((m) => m.groupId !== groupId);

    set({ studyGroupMemberships: next });
    await AsyncStorage.setItem(STORAGE_KEYS.STUDY_GROUP_MEMBERSHIPS, JSON.stringify(next));
  },

  recordGroupQuizHistory: async (entry: GroupQuizHistoryEntry) => {
    const current = get().groupQuizHistory;
    const next = [entry, ...current].slice(0, 200);

    set({ groupQuizHistory: next });
    await AsyncStorage.setItem(STORAGE_KEYS.GROUP_QUIZ_HISTORY, JSON.stringify(next));
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
                // Debug statement removed
  },

  spendSmartCoins: async (amount: number, item: string) => {
    const currentData = get().gamificationData;
    if (currentData.smartCoins < amount) {
                  // Debug statement removed
      return false;
    }

    const newData = {
      ...currentData,
      smartCoins: currentData.smartCoins - amount,
    };
    
    set({ gamificationData: newData });
    await AsyncStorage.setItem(STORAGE_KEYS.GAMIFICATION_DATA, JSON.stringify(newData));
                // Debug statement removed
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
                  // Debug statement removed
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
                // Debug statement removed
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
                  // Debug statement removed
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

  updateReputation: async (amount: number) => {
    const currentData = get().gamificationData;
    const newData = {
      ...currentData,
      reputation: Math.max(0, currentData.reputation + amount),
    };
    
    set({ gamificationData: newData });
    await AsyncStorage.setItem(STORAGE_KEYS.GAMIFICATION_DATA, JSON.stringify(newData));
  },

  addBadge: async (badge: Badge) => {
    const currentData = get().gamificationData;
    if (!currentData.badges.find(b => b.id === badge.id)) {
      const newData = {
        ...currentData,
        badges: [...currentData.badges, badge],
      };
      
      set({ gamificationData: newData });
      await AsyncStorage.setItem(STORAGE_KEYS.GAMIFICATION_DATA, JSON.stringify(newData));
    }
  },

  updateAchievementProgress: async (progress: AchievementProgress) => {
    const currentData = get().gamificationData;
    const existingIdx = currentData.achievementProgress.findIndex(p => p.id === progress.id);
    
    let nextProgress = [...currentData.achievementProgress];
    if (existingIdx !== -1) {
      nextProgress[existingIdx] = progress;
    } else {
      nextProgress.push(progress);
    }

    const newData = {
      ...currentData,
      achievementProgress: nextProgress,
    };
    
    set({ gamificationData: newData });
    await AsyncStorage.setItem(STORAGE_KEYS.GAMIFICATION_DATA, JSON.stringify(newData));
  },

  setReputationLeaderboard: (entries: ReputationLeaderboardEntry[]) => {
    set({ reputationLeaderboard: entries });
    AsyncStorage.setItem(STORAGE_KEYS.REPUTATION_LEADERBOARD, JSON.stringify(entries));
  },

  updateReputationRank: (rank: number) => {
    const currentData = get().gamificationData;
    const newData = { ...currentData, reputationRank: rank };
    set({ gamificationData: newData });
    AsyncStorage.setItem(STORAGE_KEYS.GAMIFICATION_DATA, JSON.stringify(newData));
  },

  // Q&A Forum actions
  addUserQuestion: async (questionId: string) => {
    const current = get().userQuestions;
    if (!current.includes(questionId)) {
      const next = [...current, questionId];
      set({ userQuestions: next });
      await AsyncStorage.setItem(STORAGE_KEYS.USER_QUESTIONS, JSON.stringify(next));
    }
  },

  addUserAnswer: async (answerId: string) => {
    const current = get().userAnswers;
    if (!current.includes(answerId)) {
      const next = [...current, answerId];
      set({ userAnswers: next });
      await AsyncStorage.setItem(STORAGE_KEYS.USER_ANSWERS, JSON.stringify(next));
    }
  },

  addUserVote: async (answerId: string, voteType: 'upvote' | 'downvote') => {
    const current = get().userVotes;
    const next = { ...current, [answerId]: voteType };
    set({ userVotes: next });
    await AsyncStorage.setItem(STORAGE_KEYS.USER_VOTES, JSON.stringify(next));
  },

  addToFavorites: async (questionId: string) => {
    const current = get().favoriteQuestions;
    if (!current.includes(questionId)) {
      const next = [...current, questionId];
      set({ favoriteQuestions: next });
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITE_QUESTIONS, JSON.stringify(next));
    }
  },

  removeFromFavorites: async (questionId: string) => {
    const current = get().favoriteQuestions;
    const next = current.filter(id => id !== questionId);
    set({ favoriteQuestions: next });
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITE_QUESTIONS, JSON.stringify(next));
  },

  isFavorite: (questionId: string) => {
    return get().favoriteQuestions.includes(questionId);
  },

  // Notification & Gamification actions
  addCoinTransaction: async (transaction) => {
    const current = get().coinTransactions;
    const newTransaction: CoinTransaction = {
      ...transaction,
      id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    const next = [newTransaction, ...current].slice(0, 100);

    set({ coinTransactions: next });
    await AsyncStorage.setItem(STORAGE_KEYS.COIN_TRANSACTIONS, JSON.stringify(next));
  },

  getCoinTransactions: () => {
    return get().coinTransactions;
  },

  updateNotificationPreferences: async (prefs) => {
    const current = get().notificationPreferences;
    const next = { ...current, ...prefs };

    set({ notificationPreferences: next });
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_PREFERENCES, JSON.stringify(next));
  },

  updateAnswerStreak: async () => {
    const current = get().answerStreakCount;
    const lastDate = get().lastAnswerDate;
    const today = new Date().toISOString().split('T')[0];

    if (lastDate === today) {
      return;
    }

    const lastDateObj = lastDate ? new Date(lastDate) : null;
    const todayObj = new Date(today);
    const yesterday = new Date(todayObj);
    yesterday.setDate(yesterday.getDate() - 1);

    let newStreak = 1;
    if (lastDateObj) {
      const lastDateString = lastDateObj.toISOString().split('T')[0];
      const yesterdayString = yesterday.toISOString().split('T')[0];

      if (lastDateString === yesterdayString) {
        newStreak = current + 1;
      }
    }

    set({ answerStreakCount: newStreak, lastAnswerDate: today });
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.ANSWER_STREAK_COUNT, newStreak.toString()),
      AsyncStorage.setItem(STORAGE_KEYS.LAST_ANSWER_DATE, today),
    ]);
  },

  resetAnswerStreak: async () => {
    set({ answerStreakCount: 0, lastAnswerDate: null });
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.ANSWER_STREAK_COUNT, '0'),
      AsyncStorage.removeItem(STORAGE_KEYS.LAST_ANSWER_DATE),
    ]);
  },
}));
