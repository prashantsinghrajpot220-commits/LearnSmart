import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme, ThemeColors } from './ThemeContext';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { VoiceNote } from '@/types/notes';

interface NoteCardProps {
  note: VoiceNote;
  onDelete: (id: string) => void;
  onToggleStar: (id: string) => void;
}

export default function NoteCard({ note, onDelete, onToggleStar }: NoteCardProps) {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const styles = getStyles(colors, isDark);

  const handleDelete = () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(note.id),
        },
      ]
    );
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const getLanguageBadge = (language: string): string => {
    switch (language) {
      case 'hi':
        return '🇮🇳 Hindi';
      case 'hinglish':
        return '🇮🇳 Hinglish';
      default:
        return '🇬🇧 English';
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/voice-notes/${note.id}` as any)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title} numberOfLines={1}>
            {note.title}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.date}>{formatDate(note.updatedAt)}</Text>
            <Text style={styles.duration}>{note.duration}s</Text>
            <Text style={styles.language}>{getLanguageBadge(note.language)}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.starButton}
          onPress={(e) => {
            e.stopPropagation();
            onToggleStar(note.id);
          }}
        >
          <Text style={styles.starIcon}>{note.isStarred ? '⭐' : '☆'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.preview} numberOfLines={3}>
        {note.summarizedContent}
      </Text>

      {note.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {note.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {note.tags.length > 3 && (
            <Text style={styles.moreTags}>+{note.tags.length - 3}</Text>
          )}
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
        >
          <Text style={styles.footerButtonText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerButton, styles.editButton]}
          onPress={(e) => {
            e.stopPropagation();
            router.push(`/voice-notes/${note.id}/edit` as any);
          }}
        >
          <Text style={[styles.footerButtonText, { color: colors.white }]}>Edit</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const getStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: isDark ? colors.text : colors.charcoal,
    marginBottom: Spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  date: {
    fontSize: FontSizes.xs,
    color: colors.textSecondary,
  },
  duration: {
    fontSize: FontSizes.xs,
    color: colors.primary,
    fontWeight: FontWeights.medium,
  },
  language: {
    fontSize: FontSizes.xs,
    color: colors.textSecondary,
  },
  starButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.sm,
  },
  starIcon: {
    fontSize: FontSizes.lg,
  },
  preview: {
    fontSize: FontSizes.sm,
    color: colors.text,
    lineHeight: FontSizes.sm * 1.5,
    marginBottom: Spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  tag: {
    backgroundColor: colors.lightGray,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  tagText: {
    fontSize: FontSizes.xs,
    color: colors.text,
    fontWeight: FontWeights.medium,
  },
  moreTags: {
    fontSize: FontSizes.xs,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    paddingTop: Spacing.sm,
    gap: Spacing.sm,
  },
  footerButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: colors.primary,
  },
  editButton: {
    backgroundColor: colors.primary,
  },
});
