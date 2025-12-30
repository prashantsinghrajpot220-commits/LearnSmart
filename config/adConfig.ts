import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';

/**
 * AdMob Configuration
 * 
 * To use real ad units, update the environment variables or replace the values below.
 * In development, we always default to Test IDs to avoid policy violations.
 * 
 * Note: EXPO_PUBLIC_ prefixed variables are automatically loaded by Expo.
 */

// Ad Unit IDs for Banner Ads
export const AD_UNIT_IDS = {
  BANNER_LESSON: Platform.select({
    android: process.env.EXPO_PUBLIC_ADMOB_BANNER_LESSON_ID || TestIds.BANNER,
    ios: process.env.EXPO_PUBLIC_ADMOB_BANNER_LESSON_ID || TestIds.BANNER,
    default: TestIds.BANNER,
  }),
  BANNER_QUIZ: Platform.select({
    android: process.env.EXPO_PUBLIC_ADMOB_BANNER_QUIZ_ID || TestIds.BANNER,
    ios: process.env.EXPO_PUBLIC_ADMOB_BANNER_QUIZ_ID || TestIds.BANNER,
    default: TestIds.BANNER,
  }),
};
