import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from './ThemeContext';

interface XPBarProps {
  currentXP: number;
  maxXP: number;
  level: number;
}

export const XPBar: React.FC<XPBarProps> = ({ currentXP, maxXP, level }) => {
  const { colors } = useTheme();
  const progress = Math.min(Math.max(currentXP / maxXP, 0), 1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.levelText, { color: colors.text }]}>Level {level}</Text>
        <Text style={[styles.xpText, { color: colors.textSecondary }]}>
          {currentXP} / {maxXP} XP
        </Text>
      </View>
      <View style={[styles.barContainer, { backgroundColor: colors.border }]}>
        <View
          style={[
            styles.progressFill, 
            { 
              width: `${progress * 100}%`,
              backgroundColor: colors.primary 
            }
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  levelText: {
    fontSize: 16,
    fontWeight: '700',
  },
  xpText: {
    fontSize: 12,
  },
  barContainer: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
});

export default XPBar;
