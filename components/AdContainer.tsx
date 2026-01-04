import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useTheme, ThemeColors } from './ThemeContext';
import { Feather } from '@expo/vector-icons';
import { BannerAd, BannerAdSize } from '@/utils/googleAds';
import { AD_UNIT_IDS } from '@/config/adConfig';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AdContainerProps {
  dismissible?: boolean;
  unitId?: string;
}

export default function AdContainer({ 
  dismissible = false,
  unitId = AD_UNIT_IDS.BANNER_LESSON
}: AdContainerProps) {
  const { colors } = useTheme();
  const [isDismissed, setIsDismissed] = useState(false);
  const [loadError, setLoadError] = useState(false);

  if (isDismissed) return null;

  const styles = getStyles(colors);

  // Fallback for Web or when ad fails to load
  const renderPlaceholder = (message = 'Advertisement placeholder', subtext = 'Sponsored Space') => (
    <View style={styles.adBox}>
      {dismissible && (
        <TouchableOpacity
          style={styles.dismissButton}
          onPress={() => setIsDismissed(true)}
          activeOpacity={0.7}
        >
          <Feather name="x" size={16} color="#888888" />
        </TouchableOpacity>
      )}
      <View style={styles.adContent}>
        <Feather name="tag" size={24} color="#999999" />
        <Text style={styles.adText}>{subtext}</Text>
        <Text style={styles.adSubtext}>{message}</Text>
      </View>
    </View>
  );

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        {renderPlaceholder('Ads not available on web', 'Web Preview')}
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.container}>
        {renderPlaceholder('Failed to load advertisement', 'Ad Error')}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.adWrapper}>
        {dismissible && (
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={() => setIsDismissed(true)}
            activeOpacity={0.7}
          >
            <Feather name="x" size={16} color="#888888" />
          </TouchableOpacity>
        )}
        <BannerAd
          unitId={unitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
          onAdFailedToLoad={(error) => {
            console.warn('AdMob error:', error);
            setLoadError(true);
          }}
        />
      </View>
    </View>
  );
}

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
    alignItems: 'center',
    width: '100%',
  },
  adWrapper: {
    width: SCREEN_WIDTH - (Spacing.lg * 2),
    minHeight: 60,
    backgroundColor: '#F0F0F0',
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  adBox: {
    backgroundColor: '#E8E8E8',
    height: 100,
    width: SCREEN_WIDTH - (Spacing.lg * 2),
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  dismissButton: {
    position: 'absolute',
    top: Spacing.xs,
    right: Spacing.xs,
    padding: Spacing.xs,
    backgroundColor: 'rgba(245, 245, 245, 0.8)',
    borderRadius: 12,
    zIndex: 10,
  },
  adContent: {
    alignItems: 'center',
  },
  adText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: '#666666',
    marginTop: Spacing.sm,
  },
  adSubtext: {
    fontSize: FontSizes.xs,
    color: '#999999',
    marginTop: 2,
  },
});
