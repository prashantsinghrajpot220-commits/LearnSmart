import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, FontSizes, FontWeights, Spacing } from '@/constants/theme';
import { useTheme } from '@/components/ThemeContext';
import type { GroupChatMessage, StudyGroup } from '@/services/StudyGroupService';
import { useUserStore } from '@/store/userStore';
import { getAvatarById } from '@/data/avatarStore';

interface GroupChatMessageProps {
  message: GroupChatMessage;
  group: StudyGroup;
}

export default function GroupChatMessage({ message, group }: GroupChatMessageProps) {
  const { colors, isDark } = useTheme();
  const { userId } = useUserStore();

  const isOwn = message.userId === userId;

  const profile = group.memberProfiles[message.userId];

  const avatarEmoji = useMemo(() => {
    const id = profile?.avatar ?? 'Robot';
    return getAvatarById(id)?.emoji ?? '👤';
  }, [profile?.avatar]);

  const displayName = profile?.userName ?? 'Member';

  const styles = getStyles(colors, isDark, isOwn);

  return (
    <View style={styles.row}>
      {!isOwn ? (
        <View style={styles.avatar}>
          <Text style={styles.avatarEmoji}>{avatarEmoji}</Text>
        </View>
      ) : null}

      <View style={styles.bubble}>
        {!isOwn ? <Text style={styles.name}>{displayName}</Text> : null}
        <Text style={styles.message}>{message.message}</Text>
        <Text style={styles.time}>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </View>

      {isOwn ? (
        <View style={styles.avatar}>
          <Text style={styles.avatarEmoji}>{avatarEmoji}</Text>
        </View>
      ) : null}
    </View>
  );
}

const getStyles = (colors: any, isDark: boolean, isOwn: boolean) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: isOwn ? 'flex-end' : 'flex-start',
      alignItems: 'flex-end',
      marginBottom: Spacing.sm,
    },
    avatar: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 6,
    },
    avatarEmoji: {
      fontSize: 14,
    },
    bubble: {
      maxWidth: '78%',
      backgroundColor: isOwn ? colors.primary : colors.cardBackground,
      borderRadius: BorderRadius.lg,
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
      borderWidth: isOwn ? 0 : 1,
      borderColor: colors.border,
    },
    name: {
      fontSize: FontSizes.xs,
      fontWeight: FontWeights.bold,
      color: isOwn ? '#FFFFFF' : colors.text,
      marginBottom: 2,
    },
    message: {
      fontSize: FontSizes.sm,
      color: isOwn ? '#FFFFFF' : colors.text,
      lineHeight: FontSizes.sm * 1.35,
    },
    time: {
      marginTop: 4,
      fontSize: 10,
      color: isOwn ? 'rgba(255,255,255,0.75)' : colors.textSecondary,
      alignSelf: 'flex-end',
    },
  });
