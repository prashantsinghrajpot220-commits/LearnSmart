"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AD_UNIT_IDS = void 0;
var react_native_1 = require("react-native");
var googleAds_1 = require("@/utils/googleAds");
/**
 * AdMob Configuration
 *
 * To use real ad units, update the environment variables or replace the values below.
 * In development, we always default to Test IDs to avoid policy violations.
 *
 * Note: EXPO_PUBLIC_ prefixed variables are automatically loaded by Expo.
 */
// Ad Unit IDs for Banner Ads
exports.AD_UNIT_IDS = {
    BANNER_LESSON: react_native_1.Platform.select({
        android: process.env.EXPO_PUBLIC_ADMOB_BANNER_LESSON_ID || googleAds_1.TestIds.BANNER,
        ios: process.env.EXPO_PUBLIC_ADMOB_BANNER_LESSON_ID || googleAds_1.TestIds.BANNER,
        default: googleAds_1.TestIds.BANNER,
    }),
    BANNER_QUIZ: react_native_1.Platform.select({
        android: process.env.EXPO_PUBLIC_ADMOB_BANNER_QUIZ_ID || googleAds_1.TestIds.BANNER,
        ios: process.env.EXPO_PUBLIC_ADMOB_BANNER_QUIZ_ID || googleAds_1.TestIds.BANNER,
        default: googleAds_1.TestIds.BANNER,
    }),
};
