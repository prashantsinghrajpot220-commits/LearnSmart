import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AgeGroup = 'under12' | '12plus';

interface UserState {
  userId: string;
  ageGroup: AgeGroup | null;
  userName: string;
  signupDate: string | null;
  profileComplete: boolean;

  selectedClass: string;
  selectedStream: string;
  isOnboarded: boolean;

  setAgeGroup: (age: AgeGroup) => Promise<void>;
  getAgeGroup: () => AgeGroup | null;
  isUnder12: () => boolean;
  is12Plus: () => boolean;

  setUserName: (name: string) => void;
  setSelectedClass: (className: string) => void;
  setSelectedStream: (stream: string) => void;
  completeOnboarding: () => void;
  logout: () => void;
  loadUserData: () => Promise<void>;
}

const STORAGE_KEYS = {
  USER_NAME: '@learnsmart_user_name',
  SELECTED_CLASS: '@learnsmart_selected_class',
  SELECTED_STREAM: '@learnsmart_selected_stream',
  IS_ONBOARDED: '@learnsmart_is_onboarded',
  AGE_GROUP: '@learnsmart/user_age_group',
  USER_ID: '@learnsmart/user_id',
  SIGNUP_DATE: '@learnsmart/signup_date',
  PROFILE_COMPLETE: '@learnsmart/profile_complete',
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
  isOnboarded: false,

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
      isOnboarded: false,
    });
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_NAME,
      STORAGE_KEYS.SELECTED_CLASS,
      STORAGE_KEYS.SELECTED_STREAM,
      STORAGE_KEYS.IS_ONBOARDED,
      STORAGE_KEYS.AGE_GROUP,
      STORAGE_KEYS.USER_ID,
      STORAGE_KEYS.SIGNUP_DATE,
      STORAGE_KEYS.PROFILE_COMPLETE,
    ]);
  },

  loadUserData: async () => {
    try {
      const [name, className, stream, onboarded, ageGroup, userId, signupDate, profileComplete] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER_NAME),
        AsyncStorage.getItem(STORAGE_KEYS.SELECTED_CLASS),
        AsyncStorage.getItem(STORAGE_KEYS.SELECTED_STREAM),
        AsyncStorage.getItem(STORAGE_KEYS.IS_ONBOARDED),
        AsyncStorage.getItem(STORAGE_KEYS.AGE_GROUP),
        AsyncStorage.getItem(STORAGE_KEYS.USER_ID),
        AsyncStorage.getItem(STORAGE_KEYS.SIGNUP_DATE),
        AsyncStorage.getItem(STORAGE_KEYS.PROFILE_COMPLETE),
      ]);

      let currentUserId = userId;
      if (!currentUserId) {
        currentUserId = generateUserId();
        await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, currentUserId);
      }

      set({
        userId: currentUserId,
        ageGroup: ageGroup as AgeGroup | null,
        userName: name || '',
        signupDate: signupDate || null,
        profileComplete: profileComplete === 'true',
        selectedClass: className || '',
        selectedStream: stream || '',
        isOnboarded: onboarded === 'true',
      });
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  },
}));
