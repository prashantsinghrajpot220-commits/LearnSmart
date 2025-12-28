import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
  userName: string;
  selectedClass: string;
  isOnboarded: boolean;
  setUserName: (name: string) => void;
  setSelectedClass: (className: string) => void;
  completeOnboarding: () => void;
  logout: () => void;
  loadUserData: () => Promise<void>;
}

const STORAGE_KEYS = {
  USER_NAME: '@learnsmart_user_name',
  SELECTED_CLASS: '@learnsmart_selected_class',
  IS_ONBOARDED: '@learnsmart_is_onboarded',
};

export const useUserStore = create<UserState>((set) => ({
  userName: '',
  selectedClass: '',
  isOnboarded: false,

  setUserName: (name: string) => {
    set({ userName: name });
    AsyncStorage.setItem(STORAGE_KEYS.USER_NAME, name);
  },

  setSelectedClass: (className: string) => {
    set({ selectedClass: className });
    AsyncStorage.setItem(STORAGE_KEYS.SELECTED_CLASS, className);
  },

  completeOnboarding: () => {
    set({ isOnboarded: true });
    AsyncStorage.setItem(STORAGE_KEYS.IS_ONBOARDED, 'true');
  },

  logout: async () => {
    set({
      userName: '',
      selectedClass: '',
      isOnboarded: false,
    });
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_NAME,
      STORAGE_KEYS.SELECTED_CLASS,
      STORAGE_KEYS.IS_ONBOARDED,
    ]);
  },

  loadUserData: async () => {
    try {
      const [name, className, onboarded] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER_NAME),
        AsyncStorage.getItem(STORAGE_KEYS.SELECTED_CLASS),
        AsyncStorage.getItem(STORAGE_KEYS.IS_ONBOARDED),
      ]);

      set({
        userName: name || '',
        selectedClass: className || '',
        isOnboarded: onboarded === 'true',
      });
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  },
}));
