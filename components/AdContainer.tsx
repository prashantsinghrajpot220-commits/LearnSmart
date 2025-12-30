import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useTheme, ThemeColors } from './ThemeContext';
import { Feather } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AdContainerProps {
  dismissible?: boolean;
}

export default function AdContainer({ dismissible = false }: AdContainerProps) {
  const { colors } = useTheme();
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
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
          <Text style={styles.adText}>Sponsored Space</Text>
          <Text style={styles.adSubtext}>Advertisement placeholder</Text>
        </View>
      </View>
    </View>
  );
}

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  adBox: {
    backgroundColor: '#E8E8E8',
    height: 100,
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
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
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
