import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useTheme } from './ThemeContext';
import { useUserStore } from '@/store/userStore';
import BadgeDisplay from './BadgeDisplay';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ReputationCard() {
  const { colors } = useTheme();
  const router = useRouter();
  const { gamificationData } = useUserStore();
  const { reputation, badges, reputationRank } = gamificationData;

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Reputation</Text>
          <Text style={[styles.reputationValue, { color: colors.primary }]}>{reputation}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.rankBadge, { backgroundColor: colors.primary + '20' }]}
          onPress={() => router.push('/reputation-leaderboard')}
        >
          <Ionicons name="trophy-outline" size={16} color={colors.primary} />
          <Text style={[styles.rankText, { color: colors.primary }]}>Rank #{reputationRank || '--'}</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Badges ({badges.length})</Text>
      
      {badges.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgeList}>
          {badges.map((badge) => (
            <BadgeDisplay key={badge.id} badge={badge} size="sm" />
          ))}
        </ScrollView>
      ) : (
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          No badges earned yet. Be helpful in the community to earn badges!
        </Text>
      )}

      <TouchableOpacity 
        style={[styles.footer, { borderTopColor: colors.border }]}
        onPress={() => router.push('/trophy-room')} 
      >
        <Text style={[styles.footerText, { color: colors.primary }]}>View all achievements</Text>
        <Ionicons name="arrow-forward" size={14} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  reputationValue: {
    fontSize: 36,
    fontWeight: FontWeights.bold,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  rankText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    marginHorizontal: 4,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
    opacity: 0.5,
  },
  sectionTitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.sm,
  },
  badgeList: {
    flexDirection: 'row',
  },
  emptyText: {
    fontSize: FontSizes.xs,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
  },
  footerText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    marginRight: 4,
  },
});
