import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { getChaptersForSubject } from '@/constants/curriculum';

export default function Chapters() {
  const router = useRouter();
  const { subject, class: className } = useLocalSearchParams<{ subject: string; class: string }>();

  const chapters = className && subject ? getChaptersForSubject(className, subject) : [];

  const handleChapterPress = (chapter: string) => {
    if (chapter.includes('Coming Soon')) {
      return;
    }
    router.push({
      pathname: '/lesson',
      params: { chapter, subject, class: className },
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{subject}</Text>
        <Text style={styles.subtitle}>{className || ''}</Text>

        <Text style={styles.sectionTitle}>Chapters</Text>

        <View style={styles.chapterList}>
          {chapters.map((chapter, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.chapterCard,
                chapter.includes('Coming Soon') && styles.disabledCard,
              ]}
              onPress={() => handleChapterPress(chapter)}
              activeOpacity={chapter.includes('Coming Soon') ? 1 : 0.7}
              disabled={chapter.includes('Coming Soon')}
            >
              <View style={styles.chapterNumber}>
                <Text style={styles.chapterNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.chapterName}>{chapter}</Text>
              <Text style={styles.chapterArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        {chapters.length > 0 && chapters[0].includes('Coming Soon') && (
          <View style={styles.placeholderCard}>
            <Text style={styles.placeholderTitle}>🚧 Coming Soon</Text>
            <Text style={styles.placeholderText}>
              Full curriculum content will be available in Phase 2B
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Platform.select({ web: Spacing.xxl, default: Spacing.xxl + 20 }),
    paddingBottom: Spacing.xxl,
  },
  backButton: {
    marginBottom: Spacing.md,
  },
  backButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.lg,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  chapterList: {
    marginBottom: Spacing.xl,
  },
  chapterCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  disabledCard: {
    opacity: 0.6,
  },
  chapterNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  chapterNumberText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.white,
  },
  chapterName: {
    flex: 1,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.text,
  },
  chapterArrow: {
    fontSize: FontSizes.lg,
    color: Colors.textSecondary,
  },
  placeholderCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  placeholderTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  placeholderText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});
