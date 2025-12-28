import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';

interface LessonContent {
  title: string;
  icon: string;
  bulletPoints: string[];
  paragraphs: string[];
}

interface LessonViewProps {
  chapter: string;
  subject: string;
  className: string;
  lessonContent: LessonContent;
  currentLessonIndex: number;
  totalLessons: number;
  onNext?: () => void;
  onPrevious?: () => void;
  showNavigation?: boolean;
}

export default function LessonView({
  chapter,
  subject,
  lessonContent,
  currentLessonIndex,
  totalLessons,
  onNext,
  onPrevious,
  showNavigation = true,
}: LessonViewProps) {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  const handleBack = () => {
    router.back();
  };

  const hasPrevious = currentLessonIndex > 0;
  const hasNext = currentLessonIndex < totalLessons - 1;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.chapterBadge}>
            <Text style={styles.chapterBadgeText}>
              {subject} • {chapter}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        alwaysBounceVertical={true}
      >
        <View style={styles.lessonCard}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{lessonContent.icon || '📖'}</Text>
          </View>

          <Text style={styles.lessonTitle}>{lessonContent.title}</Text>

          <View style={styles.divider} />

          <View style={styles.contentSection}>
            {lessonContent.bulletPoints.map((point, index) => (
              <View key={index} style={styles.bulletPointContainer}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.bulletPointText}>{point}</Text>
              </View>
            ))}
          </View>

          {lessonContent.paragraphs.map((paragraph, index) => (
            <View key={`para-${index}`} style={styles.paragraphContainer}>
              <Text style={styles.paragraphText}>{paragraph}</Text>
            </View>
          ))}

          {lessonContent.paragraphs.length === 0 && lessonContent.bulletPoints.length === 0 && (
            <View style={styles.emptyContent}>
              <Text style={styles.emptyText}>Lesson content coming soon</Text>
            </View>
          )}
        </View>

        {showNavigation && (
          <View style={styles.navigationSpacer} />
        )}
      </ScrollView>

      {showNavigation && (
        <View style={styles.navigationContainer}>
          <View style={styles.navigationRow}>
            <TouchableOpacity
              style={[
                styles.navButton,
                styles.prevButton,
                !hasPrevious && styles.navButtonDisabled,
              ]}
              onPress={onPrevious}
              disabled={!hasPrevious}
              activeOpacity={hasPrevious ? 0.7 : 1}
            >
              <Text
                style={[
                  styles.navButtonText,
                  !hasPrevious && styles.navButtonTextDisabled,
                ]}
              >
                ← Previous
              </Text>
            </TouchableOpacity>

            <View style={styles.lessonIndicator}>
              <Text style={styles.lessonIndicatorText}>
                {currentLessonIndex + 1} / {totalLessons}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.navButton,
                styles.nextButton,
                !hasNext && styles.navButtonDisabled,
              ]}
              onPress={onNext}
              disabled={!hasNext}
              activeOpacity={hasNext ? 0.7 : 1}
            >
              <Text
                style={[
                  styles.navButtonText,
                  !hasNext && styles.navButtonTextDisabled,
                ]}
              >
                Next →
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.select({ web: Spacing.lg, default: Spacing.lg + 20 }),
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: Spacing.sm,
    marginRight: Spacing.sm,
  },
  backButtonText: {
    fontSize: FontSizes.lg,
    color: Colors.primary,
    fontWeight: FontWeights.semibold,
  },
  chapterBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
  },
  chapterBadgeText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  lessonCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    shadowColor: Colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  icon: {
    fontSize: 64,
  },
  lessonTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.charcoal,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  divider: {
    height: 2,
    backgroundColor: Colors.primary,
    borderRadius: 1,
    marginBottom: Spacing.xl,
    width: 60,
    alignSelf: 'center',
  },
  contentSection: {
    marginBottom: Spacing.lg,
  },
  bulletPointContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
    paddingLeft: Spacing.sm,
  },
  bulletPoint: {
    fontSize: FontSizes.lg,
    color: Colors.primary,
    marginRight: Spacing.sm,
    lineHeight: FontSizes.lg * 1.4,
  },
  bulletPointText: {
    fontSize: FontSizes.md,
    color: Colors.text,
    flex: 1,
    lineHeight: FontSizes.md * 1.5,
  },
  paragraphContainer: {
    marginBottom: Spacing.md,
  },
  paragraphText: {
    fontSize: FontSizes.md,
    color: Colors.text,
    lineHeight: FontSizes.md * 1.6,
    textAlign: 'justify',
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  navigationSpacer: {
    height: Spacing.xl,
  },
  navigationContainer: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  navigationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  prevButton: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  nextButton: {
    backgroundColor: Colors.primary,
  },
  navButtonDisabled: {
    backgroundColor: Colors.white,
    borderColor: Colors.lightGray,
    opacity: 0.6,
  },
  navButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  navButtonTextDisabled: {
    color: Colors.textSecondary,
  },
  lessonIndicator: {
    paddingHorizontal: Spacing.md,
  },
  lessonIndicatorText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeights.medium,
  },
});
