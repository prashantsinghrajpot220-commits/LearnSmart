import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, FontSizes, FontWeights, Spacing } from '@/constants/theme';
import { useTheme } from '@/components/ThemeContext';
import type { GroupNote, StudyGroup } from '@/services/StudyGroupService';
import { getAvatarById } from '@/data/avatarStore';

interface GroupNoteCardProps {
  note: GroupNote;
  group: StudyGroup;
}

export default function GroupNoteCard({ note, group }: GroupNoteCardProps) {
  const { colors, isDark } = useTheme();

  const profile = group.memberProfiles[note.userId];

  const avatarEmoji = useMemo(() => {
    const id = profile?.avatar ?? 'Robot';
    return getAvatarById(id)?.emoji ?? '👤';
  }, [profile?.avatar]);

  const displayName = profile?.userName ?? 'Member';

  const styles = getStyles(colors, isDark);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarEmoji}>{avatarEmoji}</Text>
        </View>
        <View style={styles.meta}>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.time}>{new Date(note.createdAt).toLocaleString()}</Text>
        </View>
      </View>
      <Text style={styles.content}>{note.content}</Text>
    </View>
  );
}

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
      marginBottom: Spacing.sm,
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.md,
    },
    avatarEmoji: {
      fontSize: 18,
    },
    meta: {
      flex: 1,
    },
    name: {
      fontSize: FontSizes.sm,
      fontWeight: FontWeights.bold,
      color: colors.text,
    },
    time: {
      fontSize: FontSizes.xs,
      color: colors.textSecondary,
      marginTop: 2,
    },
    content: {
      fontSize: FontSizes.md,
      color: colors.text,
      lineHeight: FontSizes.md * 1.4,
    },
  });
