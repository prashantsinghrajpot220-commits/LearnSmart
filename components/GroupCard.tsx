import React, { useMemo, memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, FontSizes, FontWeights, Spacing } from '@/constants/theme';
import { useTheme } from '@/components/ThemeContext';
import type { StudyGroup } from '@/services/StudyGroupService';
import { getAvatarById } from '@/data/avatarStore';

interface GroupCardProps {
  group: StudyGroup;
  onPress: () => void;
}

const GroupCard = memo(({ group, onPress }: GroupCardProps) => {
  const { colors, isDark } = useTheme();

  const memberAvatars = useMemo(() => {
    return Object.values(group.memberProfiles)
      .map((p) => p.avatar)
      .slice(0, 4)
      .map((avatarId) => getAvatarById(avatarId)?.emoji ?? '👤');
  }, [group.memberProfiles]);

  const styles = getStyles(colors, isDark);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          {group.icon?.startsWith('http') ? (
            <Image source={{ uri: group.icon }} style={styles.iconImage} />
          ) : (
            <Text style={styles.iconText}>{group.icon || '👥'}</Text>
          )}
        </View>

        <View style={styles.meta}>
          <Text style={styles.name} numberOfLines={1}>
            {group.name}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {group.description}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.avatarRow}>
          {memberAvatars.map((emoji, idx) => (
            <View key={`${emoji}-${idx}`} style={styles.avatarBubble}>
              <Text style={styles.avatarEmoji}>{emoji}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.memberCount}>{group.members.length} members</Text>
      </View>
    </TouchableOpacity>
  );
});

export default GroupCard;

const getStyles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.cardBackground,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconWrap: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: isDark ? '#2A2A2A' : '#F5F1E8',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.md,
      overflow: 'hidden',
    },
    iconText: {
      fontSize: 26,
    },
    iconImage: {
      width: '100%',
      height: '100%',
    },
    meta: {
      flex: 1,
    },
    name: {
      fontSize: FontSizes.lg,
      fontWeight: FontWeights.bold,
      color: colors.text,
      marginBottom: 2,
    },
    description: {
      fontSize: FontSizes.sm,
      color: colors.textSecondary,
      lineHeight: FontSizes.sm * 1.35,
    },
    footer: {
      marginTop: Spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    avatarRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatarBubble: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 6,
    },
    avatarEmoji: {
      fontSize: 14,
    },
    memberCount: {
      fontSize: FontSizes.sm,
      color: colors.textSecondary,
      fontWeight: FontWeights.medium,
    },
  });
