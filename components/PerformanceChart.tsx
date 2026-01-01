import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { useTheme, ThemeColors } from './ThemeContext';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { analyticsService } from '@/services/AnalyticsService';

const { width: screenWidth } = Dimensions.get('window');
const chartWidth = screenWidth - Spacing.lg * 2 - Spacing.lg * 2;
const barWidth = (chartWidth / 8) - 8;

export default function PerformanceChart() {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark);

  const chartData = analyticsService.getPerformanceChartData();
  
  // If no data, show placeholder
  if (chartData.accuracyData.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyChart}>
          <Text style={styles.emptyText}>No performance data yet</Text>
        </View>
      </View>
    );
  }

  const maxAccuracy = Math.max(...chartData.accuracyData, 100);
  
  return (
    <View style={styles.container}>
      {/* Y-axis labels */}
      <View style={styles.yAxis}>
        <Text style={styles.yAxisLabel}>100%</Text>
        <Text style={styles.yAxisLabel}>75%</Text>
        <Text style={styles.yAxisLabel}>50%</Text>
        <Text style={styles.yAxisLabel}>25%</Text>
        <Text style={styles.yAxisLabel}>0%</Text>
      </View>

      {/* Chart area */}
      <View style={styles.chartArea}>
        {/* Grid lines */}
        {['100', '75', '50', '25', '0'].map((percent) => (
          <View
            key={percent}
            style={[
              styles.gridLine,
              { bottom: `${parseInt(percent)}%` },
            ]}
          />
        ))}

        {/* Bars */}
        <View style={styles.barsContainer}>
          {chartData.accuracyData.map((accuracy, index) => {
            const height = (accuracy / maxAccuracy) * 100;
            const barColor = accuracy >= 70 
              ? colors.success 
              : accuracy >= 50 
              ? colors.warning 
              : colors.error;
            
            return (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${height}%`,
                        backgroundColor: barColor,
                      },
                    ]}
                  />
                  <Text style={styles.barLabel}>{accuracy}%</Text>
                </View>
                <Text style={styles.xAxisLabel}>{chartData.labels[index]}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const getStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    height: 200,
  },
  yAxis: {
    width: 40,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: Spacing.xs,
  },
  yAxisLabel: {
    fontSize: FontSizes.xs,
    color: colors.textSecondary,
    textAlign: 'right',
    transform: [{ translateY: -6 }],
  },
  chartArea: {
    flex: 1,
    position: 'relative',
    paddingLeft: Spacing.sm,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.lightGray,
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '100%',
    alignItems: 'flex-end',
  },
  barContainer: {
    alignItems: 'center',
    width: barWidth,
  },
  barWrapper: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barLabel: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: colors.text,
    marginTop: Spacing.xs,
  },
  xAxisLabel: {
    fontSize: FontSizes.xs,
    color: colors.textSecondary,
    marginTop: Spacing.xs,
  },
  emptyChart: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: FontSizes.sm,
    color: colors.textSecondary,
  },
});
