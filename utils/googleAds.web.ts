import React from 'react';
import { View, Text } from 'react-native';

export const BannerAd = () => null;

export const BannerAdSize = {
  ANCHORED_ADAPTIVE_BANNER: 'ANCHORED_ADAPTIVE_BANNER',
  BANNER: 'BANNER',
  FULL_BANNER: 'FULL_BANNER',
  LARGE_BANNER: 'LARGE_BANNER',
  LEARNED_RECTANGLE: 'LEARNED_RECTANGLE',
  MEDIUM_RECTANGLE: 'MEDIUM_RECTANGLE',
  SMART_BANNER: 'SMART_BANNER',
  WIDE_SKYSCRAPER: 'WIDE_SKYSCRAPER',
  ADAPTIVE_BANNER: 'ADAPTIVE_BANNER',
};

export const TestIds = {
  BANNER: 'test-id',
  INTERSTITIAL: 'test-id',
  REWARDED: 'test-id',
};

const mobileAds = () => ({
  initialize: () => Promise.resolve({}),
  setRequestConfiguration: () => Promise.resolve({}),
});

export default mobileAds;
